using LearningManagementSystem.Helpers;
using LearningManagementSystem.Models;
using LearningManagementSystem.Models.DTOs;
using LearningManagementSystem.Services.IServices;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace LearningManagementSystem.Controllers
{
    [Route("api/CourseProgress")]
    [ApiController]
    public class CourseProgressController : ControllerBase
    {
        private readonly ICourseProgressService _courseProgressService;
        public CourseProgressController(ICourseProgressService courseProgressService)
        {
            _courseProgressService = courseProgressService;
        }


        [HttpGet("ping")]
        public string ping()
        {
            return "pong";
        }

        [HttpGet("progresses")]
        public async Task<ResponseDTO> GetAllCourseProgresses()
        {
            var response = await _courseProgressService.GetAllCourseProgressesAsync();
            return response;
        }

        [HttpGet("progress/{progressId}")]
        public async Task<ResponseDTO> GetCourseProgressById([FromRoute] int progressId)
        {
            var response = await _courseProgressService.GetCourseProgressByIdAsync(progressId);
            return response;
        }

        [HttpGet("employee/{employeeId}")]
        public async Task<ResponseDTO> GetEmployeeCourseProgresses([FromRoute] int employeeId)
        {
            var response = await _courseProgressService.GetEmployeeCourseProgressesAsync(employeeId);
            return response;
        }

        [HttpGet("course/{courseId}")]
        public async Task<ResponseDTO> GetCourseProgressesByCourseId([FromRoute] int courseId)
        {
            var response = await _courseProgressService.GetCourseProgressesByCourseIdAsync(courseId);
            return response;
        }

        [HttpPost("add")]
        public async Task<ResponseDTO> AddCourseProgress([FromBody] CourseProgress courseProgress)
        {
            var response = await _courseProgressService.AddCourseProgressAsync(courseProgress);
            return response;
        }

        [HttpPost("start/{progressId}")]
        public async Task<ResponseDTO> StartCourse([FromRoute] int progressId)
        {
            var response = await _courseProgressService.StartCourseAsync(progressId);
            return response;
        }

        [HttpPost("complete/{progressId}")]
        public async Task<ResponseDTO> CompleteCourse([FromRoute] int progressId)
        {
            var response = await _courseProgressService.CompleteCourseAsync(progressId);
            return response;
        }

        [HttpPut("update/{progressId}")]
        public async Task<ResponseDTO> UpdateCourseProgress([FromRoute] int progressId, [FromBody] CourseProgress courseProgress)
        {
            var response = await _courseProgressService.UpdateCourseProgressAsync(progressId, courseProgress);
            return response;
        }

        [HttpDelete("delete/{progressId}")]
        public async Task<ResponseDTO> DeleteCourseProgress([FromRoute] int progressId)
        {
            var response = await _courseProgressService.DeleteCourseProgressAsync(progressId);
            return response;
        }

        #region haven't been implemented yet
        [HttpGet("status/{status}")]
        public async Task<ResponseDTO> GetCourseProgressesByStatus([FromRoute] string status, [FromQuery] int employeeId = 0)
        {
           throw new NotImplementedException();
        }

        [HttpPost("reset/{progressId}")]
        public async Task<ResponseDTO> ResetCourse([FromRoute] int progressId)
        {
            throw new NotImplementedException();
        }
        #endregion

    }
}
