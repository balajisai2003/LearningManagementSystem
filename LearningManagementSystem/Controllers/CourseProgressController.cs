using LearningManagementSystem.Helpers;
using LearningManagementSystem.Models;
using LearningManagementSystem.Models.DTOs;
using LearningManagementSystem.Services.IServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace LearningManagementSystem.Controllers
{
    [Route("api/CourseProgress")]
    [ApiController]
    [Authorize]
    public class CourseProgressController : ControllerBase
    {
        private readonly ICourseProgressService _courseProgressService;
        public CourseProgressController(ICourseProgressService courseProgressService)
        {
            _courseProgressService = courseProgressService;
        }

        [AllowAnonymous]
        [HttpGet("ping")]
        public string Ping()
        {
            return "pong";
        }

        [Authorize(Roles = "Admin,admin" )]
        [HttpGet("progresses")]
        public async Task<ResponseDTO> GetAllCourseProgresses()
        {
            return await _courseProgressService.GetAllCourseProgressesAsync();
        }

        [HttpGet("progress/{progressId}")]
        public async Task<ResponseDTO> GetCourseProgressById([FromRoute] int progressId, [FromQuery] int employeeId)
        {
            if (!IsAuthorizedUser(employeeId))
                return UnauthorizedResponse();

            return await _courseProgressService.GetCourseProgressByIdAsync(progressId);
        }

        [HttpGet("employee/{employeeId}")]
        public async Task<ResponseDTO> GetEmployeeCourseProgresses([FromRoute] int employeeId)
        {
            if (!IsAuthorizedUser(employeeId))
                return UnauthorizedResponse();

            return await _courseProgressService.GetEmployeeCourseProgressesAsync(employeeId);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("add")]
        public async Task<ResponseDTO> AddCourseProgress([FromBody] CourseProgress courseProgress)
        {
            return await _courseProgressService.AddCourseProgressAsync(courseProgress);
        }

        [HttpPost("start/{progressId}")]
        public async Task<ResponseDTO> StartCourse([FromRoute] int progressId)
        {
            if (!await IsAuthorizedForProgress(progressId))
                return UnauthorizedResponse();

            return await _courseProgressService.StartCourseAsync(progressId);
        }

        [HttpPost("complete/{progressId}")]
        public async Task<ResponseDTO> CompleteCourse([FromRoute] int progressId)
        {
            if (!await IsAuthorizedForProgress(progressId))
                return UnauthorizedResponse();

            return await _courseProgressService.CompleteCourseAsync(progressId);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("update/{progressId}")]
        public async Task<ResponseDTO> UpdateCourseProgress([FromRoute] int progressId, [FromBody] CourseProgress courseProgress)
        {
            return await _courseProgressService.UpdateCourseProgressAsync(progressId, courseProgress);
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("delete/{progressId}")]
        public async Task<ResponseDTO> DeleteCourseProgress([FromRoute] int progressId)
        {
            return await _courseProgressService.DeleteCourseProgressAsync(progressId);
        }

        [HttpGet("status/{status}")]
        public async Task<ResponseDTO> GetCourseProgressesByStatus([FromRoute] string status, [FromQuery] int employeeId = 0)
        {
            if (employeeId != 0 && !IsAuthorizedUser(employeeId))
                return UnauthorizedResponse();

            return await _courseProgressService.GetCourseProgressesByStatusAsync(status, employeeId);
        }

        [HttpPost("reset/{progressId}")]
        public async Task<ResponseDTO> ResetCourse([FromRoute] int progressId)
        {
            if (! await IsAuthorizedForProgress(progressId))
                return UnauthorizedResponse();

            return await _courseProgressService.ResetCourseAsync(progressId);
        }

        private bool IsAuthorizedUser(int employeeId)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var role = User.FindFirst(ClaimTypes.Role)?.Value;
            return userId != null && (userId == employeeId.ToString() || role == "Admin");
        }

        private async Task<bool> IsAuthorizedForProgress(int progressId)
        {
            // Assuming there's a method to get the employee ID from the progress ID
            int employeeId = await _courseProgressService.GetEmployeeIdByProgressId(progressId);
            return IsAuthorizedUser(employeeId);
        }

        private ResponseDTO UnauthorizedResponse()
        {
            return new ResponseDTO
            {
                Success = false,
                Message = "Unauthorized access",
                Data = null
            };
        }
    }
}
