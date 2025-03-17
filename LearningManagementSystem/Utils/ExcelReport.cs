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

        public async Task<IActionResult> DownloadReport(DateTime startDate , DateTime endDate)
        {
            using (var connection = _dbHelper.GetConnection())
            {
                
                IEnumerable<ExcelReportModel> response = await connection.QueryAsync<ExcelReportModel>("dbo.ExcelData", new { RequestRangeStartDate = startDate, RequestRangeEndDate = endDate }, commandType: System.Data.CommandType.StoredProcedure);

                if (response != null)
                {
                    Console.WriteLine("Stored Procedure executed");
                    foreach(var item in response)
                    {
                        Console.Write(item.EmployeeID+" "+item.RequestRangeEndDate+" "+item.RequestRangeEndDate+" "+item.CourseTitle);
                    }
                    return new OkObjectResult(response);
                }
                Console.WriteLine("Stored Procedure not executed");
                return new OkResult();



                //SqlCommand sqlCommand = new SqlCommand("dbo.ExcelData", sqlConnection);
                //sqlCommand.CommandType = System.Data.CommandType.StoredProcedure;
                //sqlCommand.Parameters.AddWithValue("@StartDate", startDate);
                //sqlCommand.Parameters.AddWithValue("@EndDate", endDate);
                //SqlDataReader reader = sqlCommand.ExecuteReader();
                //var report = await reader.ReadAsync();
                //if (report)
                //{
                //    return new OkResult();
                //}
            }
            return new NotFoundResult();


        }
    }
}
