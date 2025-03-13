using Dapper;
using LearningManagementSystem.Helpers;
using LearningManagementSystem.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Globalization;
using System.Linq;

namespace LearningManagementSystem.Repository
{
    public class CourseProgressRepository
    {
        private readonly DatabaseHelper _dbHelper;

        public CourseProgressRepository(DatabaseHelper dbHelper)
        {
            _dbHelper = dbHelper;
        }

        // Add Course Progress
        public bool AddCourseProgress(int CourseId, int EmployeeId, string NewOrReused)
        {
            using (IDbConnection dbConnection = _dbHelper.GetConnection())
            {
                const string query = "INSERT INTO CourseProgress (CourseID, EmployeeID, Status, NewOrReUsed) VALUES (@CourseID, @EmployeeID, @Status, @NewOrReUsed)";
                int rowsAffected = dbConnection.Execute(query, new
                {
                    CourseID = CourseId,
                    EmployeeID = EmployeeId,
                    Status = "Not Started",
                    NewOrReUsed = NewOrReused
                });

                return rowsAffected > 0;
            }
        }

        // Start Course - Updates StartDate and Status
        public bool StartCourse(int ProgressId)
        {
            using (IDbConnection dbConnection = _dbHelper.GetConnection())
            {
                const string query = "UPDATE CourseProgress SET StartDate = @StartDate, Status = @Status WHERE ProgressID = @ProgressID";
                int rowsAffected = dbConnection.Execute(query, new
                {
                    StartDate = DateTime.Now,
                    Status = "Started",
                    ProgressID = ProgressId
                });

                return rowsAffected > 0;
            }
        }

        // Complete Course - Updates EndDate, Status, and MonthCompleted
        public bool CompleteCourse(int ProgressId)
        {
            string monthCompleted = DateTime.Now.ToString("MMM yyyy", CultureInfo.InvariantCulture); // Format: Mar 2025

            using (IDbConnection dbConnection = _dbHelper.GetConnection())
            {
                const string query = "UPDATE CourseProgress SET EndDate = @EndDate, Status = @Status, MonthCompleted = @MonthCompleted WHERE ProgressID = @ProgressID";
                int rowsAffected = dbConnection.Execute(query, new
                {
                    EndDate = DateTime.Now,
                    Status = "Completed",
                    MonthCompleted = monthCompleted,
                    ProgressID = ProgressId
                });

                return rowsAffected > 0;
            }
        }

        // Check if Course Progress Exists for a given ProgressID and EmployeeID
        public bool CourseProgressExists(int ProgressId, int EmployeeId)
        {
            using (IDbConnection dbConnection = _dbHelper.GetConnection())
            {
                const string query = "SELECT COUNT(1) FROM CourseProgress WHERE ProgressID = @ProgressID AND EmployeeID = @EmployeeID";
                return dbConnection.ExecuteScalar<int>(query, new { ProgressID = ProgressId, EmployeeID = EmployeeId }) > 0;
            }
        }

        // Get Course Progress by ProgressID
        public CourseProgress GetCourseProgressById(int ProgressId)
        {
            using (IDbConnection dbConnection = _dbHelper.GetConnection())
            {
                const string query = "SELECT * FROM CourseProgress WHERE ProgressID = @ProgressID";
                return dbConnection.QueryFirstOrDefault<CourseProgress>(query, new { ProgressID = ProgressId });
            }
        }

        // Get all course progress records for an Employee
        public IEnumerable<CourseProgress> GetEmployeeCourseProgress(int EmployeeId)
        {
            using (IDbConnection dbConnection = _dbHelper.GetConnection())
            {
                const string query = "SELECT * FROM CourseProgress WHERE EmployeeID = @EmployeeID";
                return dbConnection.Query<CourseProgress>(query, new { EmployeeID = EmployeeId }).ToList();
            }
        }

        // Get In-Progress Courses (Started but not completed)
        public IEnumerable<CourseProgress> GetInProgressCourses(int EmployeeId)
        {
            using (IDbConnection dbConnection = _dbHelper.GetConnection())
            {
                const string query = "SELECT * FROM CourseProgress WHERE EmployeeID = @EmployeeID AND Status = 'Started'";
                return dbConnection.Query<CourseProgress>(query, new { EmployeeID = EmployeeId }).ToList();
            }
        }

        // Get Completed Courses
        public IEnumerable<CourseProgress> GetCompletedCourses(int EmployeeId)
        {
            using (IDbConnection dbConnection = _dbHelper.GetConnection())
            {
                const string query = "SELECT * FROM CourseProgress WHERE EmployeeID = @EmployeeID AND Status = 'Completed'";
                return dbConnection.Query<CourseProgress>(query, new { EmployeeID = EmployeeId }).ToList();
            }
        }

        // Get Courses by Specific Status (Not Started, Started, Completed)
        public IEnumerable<CourseProgress> GetCoursesByStatus(int EmployeeId, string Status)
        {
            using (IDbConnection dbConnection = _dbHelper.GetConnection())
            {
                const string query = "SELECT * FROM CourseProgress WHERE EmployeeID = @EmployeeID AND Status = @Status";
                return dbConnection.Query<CourseProgress>(query, new { EmployeeID = EmployeeId, Status }).ToList();
            }
        }

        // Get Courses Completed in a Specific Month
        public IEnumerable<CourseProgress> GetCoursesCompletedInMonth(int EmployeeId, string MonthYear)
        {
            using (IDbConnection dbConnection = _dbHelper.GetConnection())
            {
                const string query = "SELECT * FROM CourseProgress WHERE EmployeeID = @EmployeeID AND MonthCompleted = @MonthYear";
                return dbConnection.Query<CourseProgress>(query, new { EmployeeID = EmployeeId, MonthYear }).ToList();
            }
        }

        // Get Employees Enrolled in a Specific Course
        public IEnumerable<CourseProgress> GetEmployeesByCourse(int CourseId)
        {
            using (IDbConnection dbConnection = _dbHelper.GetConnection())
            {
                const string query = "SELECT * FROM CourseProgress WHERE CourseID = @CourseID";
                return dbConnection.Query<CourseProgress>(query, new { CourseID = CourseId }).ToList();
            }
        }

        // Get Course Progress between StartDate and EndDate
        public IEnumerable<CourseProgress> GetCourseProgressBetweenDates(DateTime startDate, DateTime endDate)
        {
            using (IDbConnection dbConnection = _dbHelper.GetConnection())
            {
                const string query = "SELECT * FROM CourseProgress WHERE StartDate BETWEEN @StartDate AND @EndDate";
                return dbConnection.Query<CourseProgress>(query, new { StartDate = startDate, EndDate = endDate }).ToList();
            }
        }
    }
}
