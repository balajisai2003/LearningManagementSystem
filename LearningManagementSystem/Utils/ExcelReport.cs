using Dapper;
using LearningManagementSystem.Helpers;
using LearningManagementSystem.Models;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;

namespace LearningManagementSystem.Utils
{
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

        public async Task<IActionResult> CoursesData(DateTime startdate , DateTime? enddate=null)
        {
            using (var connection = _dbHelper.GetConnection())
            {
                var parameters = new DynamicParameters();
                parameters.Add("@StartDate", startdate);
                parameters.Add("@EndDate", enddate);
                string totalCoursesQquery="";
                if (enddate == null)
                    totalCoursesQquery = "SELECT count(*) FROM CourseProgress WHERE StartDate = @StartDate ";
                else
                    totalCoursesQquery += "AND EndDate = @EndDate";
                IEnumerable<ExcelReportModel> totalCourses = await connection.QueryAsync<ExcelReportModel>(totalCoursesQquery, new
                {
                    StartDate = startdate,
                    EndDate = enddate
                });

                string completedCoursesQuery = "";
                if (enddate == null)
                    completedCoursesQuery = "SELECT count(*) FROM CourseProgress WHERE StartDate = @StartDate AND Status = 'Completed'";
                else
                    completedCoursesQuery += "AND EndDate = @EndDate";
                IEnumerable<ExcelReportModel> completedCourses = await connection.QueryAsync<ExcelReportModel>(totalCoursesQquery, new
                {
                    StartDate = startdate,
                    EndDate = enddate
                });

                string inprogressCoursesQuery = "";
                if (enddate == null)
                    inprogressCoursesQuery = "SELECT count(*) FROM CourseProgress WHERE StartDate = @StartDate AND Status = 'In Progress'";
                else
                    inprogressCoursesQuery += "AND EndDate = @EndDate";
                IEnumerable<ExcelReportModel> inprogressCourses = await connection.QueryAsync<ExcelReportModel>(totalCoursesQquery, new
                {
                    StartDate = startdate,
                    EndDate = enddate
                });


            }
            return new OkResult();
        }
    }
}
