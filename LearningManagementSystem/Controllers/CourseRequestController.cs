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
        public ResponseDTO GetRequestsById([FromRoute]int requestId)
        {
            var response = _requestService.GetRequestById(requestId);
            return response; 
        }//getr req by emp id..

        [HttpPost("create")]
        public ResponseDTO CreateRequestForm( CourseRequestForm form)
        {
            var response = _requestService.CreateRequestForm(form);
            return response;
        }

        [HttpPost("update")]
        public ResponseDTO UpdateRequestFormById(int requestId,CourseRequestForm form)
        {
            var response = _requestService.UpdateRequestFormById(requestId, form);
            return response;
        }

        [HttpPost("Delete")]
        public ResponseDTO DeleteRequestFormById(int requestId)
        {
            var response = _requestService.DeleteRequestFormById(requestId);
            return response;
        }

        [HttpPost("Approve/{requestId}")]
        public ResponseDTO ApproveRequestForm([FromRoute] int requestId)
        {
            var response = _requestService.ApproveRequestForm(requestId);
            return response;
        }

        [HttpPost("Reject/{requestId}")]
        public ResponseDTO RejectRequestForm([FromRoute] int requestId)
        {
            var response = _requestService.RejectRequestForm(requestId);
            return response;
        }

        [HttpPost("Requests")]
        public ResponseDTO GetAllCourseRequestForms()
        {
            var response = _requestService.GetRequests();
            return response;
        }
    }
}
