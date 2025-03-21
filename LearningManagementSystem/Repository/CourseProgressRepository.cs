using Dapper;
using LearningManagementSystem.Helpers;
using LearningManagementSystem.Models;
using LearningManagementSystem.Models.DTOs;
using System;
using System.Collections.Generic;
using System.Data;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;

public class CourseProgressRepository
{
    private readonly DatabaseHelper _dbHelper;
    private readonly EmployeeRepository employeeRepository;

    public CourseProgressRepository(DatabaseHelper dbHelper)
    {
        _dbHelper = dbHelper;
        employeeRepository = new EmployeeRepository(dbHelper);
    }

    public async Task<bool> AddCourseProgressAsync(int courseId, int employeeId, string newOrReused)
    {
        const string query = @"INSERT INTO CourseProgress (CourseID, EmployeeID, Status, NewOrReused) 
                              VALUES (@CourseID, @EmployeeID, @Status, @NewOrReused)";

        using var connection = _dbHelper.GetConnection();
        int rowsAffected = await connection.ExecuteAsync(query, new
        {
            CourseID = courseId,
            EmployeeID = employeeId,
            Status = "Not Started",
            NewOrReused = newOrReused
        });
        return rowsAffected > 0;
    }

    public async Task<AddMultipleCourseProgressResult> AddMultipleCourseProgressAsync(int courseId, List<int> employeeIds, string newOrReused)
    {
        var result = new AddMultipleCourseProgressResult();
        foreach (var employeeId in employeeIds)
        {
            if (await AddCourseProgressAsync(courseId, employeeId, newOrReused))
                result.Added.Add(employeeId);
            else
                result.Failed.Add(employeeId);
        }
        result.Success = result.Failed.Count == 0;
        return result;
    }

    public async Task<bool> UpdateCourseProgressAsync(int progressId, string status, DateTime? date = null)
    {
        if (!await CourseProgressExistsAsync(progressId))
            return false;

        string query = "UPDATE CourseProgress SET Status = @Status, ";
        var parameters = new DynamicParameters(new { ProgressID = progressId, Status = status });

        if (status == "Started")
        {
            query += "StartDate = @Date, LastUpdated = @Date WHERE ProgressID = @ProgressID";
            parameters.Add("Date", date ?? DateTime.UtcNow);
        }
        else if (status == "Completed")
        {
            query += "EndDate = @Date, LastUpdated = @Date, MonthCompleted = @MonthCompleted WHERE ProgressID = @ProgressID";
            parameters.Add("Date", date ?? DateTime.UtcNow);
            parameters.Add("MonthCompleted", (date ?? DateTime.UtcNow).ToString("MMM yyyy", CultureInfo.InvariantCulture));
        }
        else
        {
            return false;
        }

        using var connection = _dbHelper.GetConnection();
        return await connection.ExecuteAsync(query, parameters) > 0;
    }

    public async Task<bool> CourseProgressExistsAsync(int progressId, int? employeeId = null)
    {
        using var connection = _dbHelper.GetConnection();
        string query = "SELECT COUNT(1) FROM CourseProgress WHERE ProgressID = @ProgressId";
        var parameters = new DynamicParameters(new { ProgressId = progressId });

        if (employeeId.HasValue)
        {
            query += " AND EmployeeID = @EmployeeId";
            parameters.Add("EmployeeId", employeeId.Value);
        }

        return await connection.ExecuteScalarAsync<int>(query, parameters) > 0;
    }

    public async Task<CourseProgress> GetCourseProgressByIdAsync(int progressId)
    {
        const string query = "SELECT * FROM CourseProgress WHERE ProgressID = @ProgressID";
        using var connection = _dbHelper.GetConnection();
        return await connection.QueryFirstOrDefaultAsync<CourseProgress>(query, new { ProgressID = progressId });
    }

    public async Task<IEnumerable<CourseProgress>> GetCourseProgressesByStatusAsync(string status, int employeeId = 0)
    {
        var query = "SELECT * FROM CourseProgress WHERE Status = @Status";
        var parameters = new DynamicParameters(new { Status = status });
        if (employeeId > 0)
        {
            query += " AND EmployeeID = @EmployeeID";
            parameters.Add("EmployeeID", employeeId);
        }
        using var connection = _dbHelper.GetConnection();
        return await connection.QueryAsync<CourseProgress>(query, parameters);
    }

    //public async Task<IEnumerable<CourseProgress>> GetCourseProgressAsync(int? courseId = null, int? employeeId = null, string status = null, string monthYear = null, DateTime? startDate = null, DateTime? endDate = null)
    //{
    //    var query = "SELECT * FROM CourseProgress WHERE 1=1";
    //    var parameters = new DynamicParameters();

    //    if (courseId.HasValue) query += " AND CourseID = @CourseID";
    //    if (employeeId.HasValue) query += " AND EmployeeID = @EmployeeID";
    //    if (!string.IsNullOrEmpty(status)) query += " AND Status = @Status";
    //    if (!string.IsNullOrEmpty(monthYear)) query += " AND MonthCompleted = @MonthYear";
    //    if (startDate.HasValue) query += " AND StartDate >= @StartDate";
    //    if (endDate.HasValue) query += " AND EndDate <= @EndDate";

    //    parameters.AddDynamicParams(new { courseId, employeeId, status, monthYear, startDate, endDate });

    //    using var connection = _dbHelper.GetConnection();
    //    return await connection.QueryAsync<CourseProgress>(query, parameters);
    //}

    public async Task<IEnumerable<CourseProgressResponseDTO>> GetCourseProgressAsync(int? courseId = null, int? employeeId = null, string status = null, string monthYear = null, DateTime? startDate = null, DateTime? endDate = null)
    {
        var query = @"
        SELECT cp.*, c.*
        FROM CourseProgress cp
        JOIN Courses c ON cp.CourseID = c.CourseID
        WHERE 1=1";
        var parameters = new DynamicParameters();

        if (courseId.HasValue) query += " AND cp.CourseID = @CourseID";
        if (employeeId.HasValue) query += " AND cp.EmployeeID = @EmployeeID";
        if (!string.IsNullOrEmpty(status)) query += " AND cp.Status = @Status";
        if (!string.IsNullOrEmpty(monthYear)) query += " AND cp.MonthCompleted = @MonthYear";
        if (startDate.HasValue) query += " AND cp.StartDate >= @StartDate";
        if (endDate.HasValue) query += " AND cp.EndDate <= @EndDate";

        parameters.AddDynamicParams(new { courseId, employeeId, status, monthYear, startDate, endDate });

        using var connection = _dbHelper.GetConnection();
        var result = await connection.QueryAsync<CourseProgress, Course, CourseProgressResponseDTO>(
            query,
            (courseProgress, course) =>
            {
                return new CourseProgressResponseDTO
                {
                    ProgressID = courseProgress.ProgressID,
                    EmployeeID = courseProgress.EmployeeID,
                    CourseID = courseProgress.CourseID,
                    Status = courseProgress.Status,
                    LastUpdated = courseProgress.LastUpdated,
                    StartDate = courseProgress.StartDate,
                    EndDate = courseProgress.EndDate,
                    NewOrReUsed = courseProgress.NewOrReUsed,
                    MonthCompleted = courseProgress.MonthCompleted,
                    RequestorEmployeeId = courseProgress.RequestorEmployeeId,
                    CourseDetails = course,
                    EmployeeDetails =  employeeRepository.GetEmployeeByIDAsync(courseProgress.EmployeeID).Result
                };
            },
            parameters,
            splitOn: "CourseID"
        );

        return result;
    }

    public async Task<bool> ResetCourseProgressAsync(int progressId)
    {
        const string query = "UPDATE CourseProgress SET StartDate = NULL, EndDate = NULL, Status = 'Not Started', MonthCompleted = NULL WHERE ProgressID = @ProgressID";
        using var connection = _dbHelper.GetConnection();
        return await connection.ExecuteAsync(query, new { ProgressID = progressId }) > 0;
    }

    public async Task<bool> DeleteCourseProgressAsync(int progressId)
    {
        const string query = "DELETE FROM CourseProgress WHERE ProgressID = @ProgressID";
        using var connection = _dbHelper.GetConnection();
        return await connection.ExecuteAsync(query, new { ProgressID = progressId }) > 0;
    }
}

public class AddMultipleCourseProgressResult
{
    public List<int> Added { get; set; } = new();
    public List<int> Failed { get; set; } = new();
    public bool Success { get; set; }
}