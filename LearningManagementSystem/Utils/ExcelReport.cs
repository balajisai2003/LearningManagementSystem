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
    }
}
