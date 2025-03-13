using LearningManagementSystem.Models;
using LearningManagementSystem.Models.DTOs;
using LearningManagementSystem.Services;
using LearningManagementSystem.Services.IServices;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace LearningManagementSystem.Controllers
{
    [Route("api/CoursesRequest")]
    [ApiController]
    public class CourseRequestController : ControllerBase
    {
        private ICourseRequestService _requestService;
        public CourseRequestController(ICourseRequestService requestService)
        {
            _requestService = requestService;
        }
        [HttpGet("ping")]
        public string ping()
        {
            return "pong";
        }

        [HttpGet("Requests/{requestId}")]
        public async Task<ResponseDTO> GetRequestByIdAsync([FromRoute]int requestId)
        {
            var response = await  _requestService.GetRequestByIdAsync(requestId);
            return response; 
        }//getr req by emp id..

        [HttpPost("create")]
        public async Task<ResponseDTO> CreateRequestFormAsync( CourseRequestForm form)
        {
            var response = await _requestService.CreateRequestFormAsync(form);
            return response;
        }

        [HttpPut("update")]
        public async Task<ResponseDTO> UpdateRequestFormAsync(int requestId,CourseRequestForm form)
        {
            var response = await _requestService.UpdateRequestFormAsync(requestId, form);
            return response;
        }

        [HttpDelete("Delete")]
        public async Task<ResponseDTO> DeleteRequestFormAsync(int requestId)
        {
            var response = await _requestService.DeleteRequestFormAsync(requestId);
            return response;
        }

        [HttpPatch("Approve/{requestId}")]
        public async Task<ResponseDTO> ApproveRequestFormAsync([FromRoute] int requestId)
        {
            var response = await _requestService.ApproveRequestFormAsync(requestId);
            return response;
        }

        [HttpPatch("Reject/{requestId}")]
        public async Task<ResponseDTO> RejectRequestFormAsync([FromRoute] int requestId)
        {
            var response = await _requestService.RejectRequestFormAsync(requestId);
            return response;
        }

        [HttpGet("Requests")]
        public async Task<ResponseDTO> GetAllRequestsAsync()
        {
            var response = await _requestService.GetAllRequestsAsync();
            return response;
        }

        [HttpGet("Requests/Employee/{employeeId}")]
        public async Task<ResponseDTO> GetRequestsByEmployeeIdAsync([FromRoute] int employeeId)
        {
            var response = await _requestService.GetRequestsByEmployeeIdAsync(employeeId);
            return response;
        }
    }
}
