using LearningManagementSystem.Models;
using LearningManagementSystem.Models.DTOs;
using LearningManagementSystem.Services.IServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace LearningManagementSystem.Controllers
{
    [Route("api/Courses")]
    [ApiController]
    [Authorize]
    public class CourseController : ControllerBase
    {
        public ICourseService _courseService;
        public CourseController(ICourseService courseService)
        {
            _courseService = courseService;
        }

        [HttpGet("ping")]
        [AllowAnonymous]
        public string ping()
        {
            return "pong";
        }

        [HttpGet("AllCourses")]
        public async Task<ResponseDTO> GetAllCourses()
        {
            var response = await _courseService.GetAllCoursesasync();
            return response;
        }

        [HttpGet("{courseId}")]
        [Authorize(Roles = "Admin")]
        public async Task<ResponseDTO> GetCourseById([FromRoute] int courseId)
        {
            var response = await _courseService.GetCourseByIdAsync(courseId);
            return response;
        }

        [HttpPost("add")]
        [Authorize(Roles = "Admin")]
        public async Task <ResponseDTO> AddCourse([FromBody] Course course)
        {
            var response = await _courseService.CreateCourseAsync(course);
            return response;
        }

        [HttpPut("update/{courseId}")]
        [Authorize(Roles = "Admin")]
        public async Task<ResponseDTO> UpdateCourse([FromRoute] int courseId, [FromBody] Course course)
        {
            var response = await _courseService.UpdateCourseAsync(courseId, course);
            return response;
        }

        [HttpDelete("delete/{courseId}")]
        [Authorize(Roles = "Admin")]
        public async Task<ResponseDTO> DeleteCourse([FromRoute] int courseId)
        {
            var response = await _courseService.DeleteCourseAsync(courseId);
            return response;
        }

    }
}
