using Dapper;
using LearningManagementSystem.Helpers;
using LearningManagementSystem.Models;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;

namespace LearningManagementSystem.Utils
{
    public class ReportModel
    {
        public string Month { get; set; }
        public int People { get; set; }
    }
    public class ExcelReport
    {
        private DatabaseHelper _dbHelper;
        public ExcelReport(DatabaseHelper dbhelper)
        {
            _dbHelper = dbhelper;            
        }

        public async Task<IActionResult> GetReport()
        {
            using (var connection = _dbHelper.GetConnection())
            {
                
                IEnumerable<ExcelReportModel> response = await connection.QueryAsync<ExcelReportModel>("dbo.New_ExcelData", commandType: System.Data.CommandType.StoredProcedure);

                if (response != null)
                {
                    Console.WriteLine("Stored Procedure executed");
                    foreach(var item in response)
                    {
                        Console.WriteLine(item.ParticipantID+" "+item.StartDate+" "+item.EndDate+" "+item.CourseTitle);
                    }
                    return new OkObjectResult(response);
                }
                Console.WriteLine("Stored Procedure not executed");
                return new OkResult();
            }
        }

        public async Task<IActionResult> CoursesData(DateTime startdate, DateTime? enddate = null)
        {
            using (var connection = _dbHelper.GetConnection())
            {
                var parameters = new DynamicParameters();
                parameters.Add("@StartDate", startdate);
                parameters.Add("@EndDate", enddate);
                string totalCoursesQquery = "SELECT count(*) FROM CourseProgress WHERE StartDate = @StartDate ";
                if (enddate != null)
                    totalCoursesQquery += "AND EndDate = @EndDate";

                int totalCourses = await connection.ExecuteScalarAsync<int>(totalCoursesQquery, new
                {
                    StartDate = startdate,
                    EndDate = enddate
                });

                string completedCoursesQuery = "SELECT count(*) FROM CourseProgress WHERE StartDate >= @StartDate AND Status = 'Completed' ";
                if (enddate != null)
                   completedCoursesQuery += "AND EndDate <= @EndDate";
                int completedCourses = await connection.ExecuteScalarAsync<int>(totalCoursesQquery, new
                {
                    StartDate = startdate,
                    EndDate = enddate
                });

                string inprogressCoursesQuery = "SELECT count(*) FROM CourseProgress WHERE StartDate >= @StartDate AND Status = 'In Progress' ";
                if (enddate != null)
                    inprogressCoursesQuery += "AND EndDate <= @EndDate";

                int inprogressCourses = await connection.ExecuteScalarAsync<int>(inprogressCoursesQuery, new
                {
                    StartDate = startdate,
                    EndDate = enddate
                });

                string inProgressMonthQuery = "Select Max(DATENAME(MM,StartDate)) as Month, Count(1) as People from CourseProgress Where Status='In Progress' AND StartDate >= @StartDate ";
                if (enddate != null)
                    inProgressMonthQuery += "AND EndDate <= @EndDate ";

                inProgressMonthQuery += "Group by Month(StartDate)";
                IEnumerable<ReportModel> inProgressMonth = await connection.QueryAsync<ReportModel>(inProgressMonthQuery, new
                {
                    StartDate = startdate,
                    EndDate = enddate
                });

                string completedMonthQuery = "Select Max(DATENAME(MM,StartDate)) as Month, Count(1) as People from CourseProgress Where Status='Completed' AND StartDate >= @StartDate ";
                if (enddate != null)
                    completedMonthQuery += "AND EndDate <= @EndDate ";

                completedMonthQuery += "Group by Month(StartDate)";
                IEnumerable<ReportModel> completedMonth = await connection.QueryAsync<ReportModel>(completedMonthQuery, new
                {
                    StartDate = startdate,
                    EndDate = enddate
                });

                // emp details in progresses...
                return new OkObjectResult(new
                {
                    TotalCourses = totalCourses,
                    CompletedCourses = completedCourses,
                    InProgressCourses = inprogressCourses,
                    InProgressMonth = inProgressMonth,
                    CompletedMonth = completedMonth
                });
            }
        }
    }
}
