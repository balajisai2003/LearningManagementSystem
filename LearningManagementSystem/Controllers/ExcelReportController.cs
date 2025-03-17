using LearningManagementSystem.Helpers;
using LearningManagementSystem.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace LearningManagementSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ExcelReportController : ControllerBase
    {
        private readonly DatabaseHelper _dbHelper;
        private ExcelReport excelReport;
        public ExcelReportController(DatabaseHelper databaseHelper)
        {
            excelReport = new ExcelReport(databaseHelper);
        }

        [HttpGet("ping")]
        public IActionResult Get()
        {
            return Ok("Excel Report");
        }
        [HttpGet("report")]
        public async Task<IActionResult> GetExcelReport()
        {
            return await excelReport.GetReport();
        }
    }
}
