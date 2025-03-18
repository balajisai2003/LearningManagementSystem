using LearningManagementSystem.Models;
using LearningManagementSystem.Models.DTOs;
using LearningManagementSystem.Services.IServices;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace LearningManagementSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeController : ControllerBase
    {
        private IEmployeeService _employeeService;
        public EmployeeController(IEmployeeService employeeService)
        {
            _employeeService = employeeService;
        }

        [HttpGet("ping")]
        public string ping()
        {
            return "pong";
        }

        [HttpGet("AllEmployees")]
        public async Task<ResponseDTO> GetAllEmployees()
        {
            var response = await _employeeService.GetAllEmployeesAsync();
            return response;
        }

        [HttpGet("Employee/{employeeId}")]
        public async Task<ResponseDTO> GetEmployeeById([FromRoute] int employeeId)
        {
            var response = await _employeeService.GetEmployeeByIdAsync(employeeId);
            return response;
        }

        [HttpDelete("Delete/{employeeId}")]
        public async Task<ResponseDTO> DeleteEmployee([FromRoute] int employeeId)
        {
            var response = await _employeeService.DeleteAsync(employeeId);
            return response;
        }

        [HttpPost("Register")]
        public async Task<ResponseDTO> RegisterEmployee([FromBody] Employee employee)
        {
            var response = await _employeeService.RegisterAsync(employee);
            return response;
        }

        [HttpPost("Login")]
        public async Task<LoginResponseDTO> LoginEmployee([FromBody] LoginRequestDTO employee)
        {
            var response = await _employeeService.LoginAsync(employee);
            return response;
        }

        [HttpPut("Update/{employeeId}")]
        public async Task<ResponseDTO> UpdateEmployee([FromRoute] int employeeId, [FromBody] Employee employee)
        {
            var response = await _employeeService.UpdateAsync(employeeId, employee);
            return response;
        }



    }
}
