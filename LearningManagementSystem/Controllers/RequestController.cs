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
    public class RequestController : ControllerBase
    {
        private ICourseRequestService _requestService;
        public RequestController(ICourseRequestService requestService)
        {
            _requestService = requestService;
        }
        [HttpGet]
        public string ping()
        {
            return "pong";
        }

        [HttpPost]
        public ResponseDTO GetRequestsById(int requestId)
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

        //[HttpPost(RequestId)]
        //public ResponseDTO ApproveRequestForm([FromBody] int requestId)
        //{
        //    var response = _requestService.ApproveRequestForm(requestId);
        //    return response;
        //}

        //[HttpPost]
        //public ResponseDTO RejectRequestForm(int requestId)
        //{
        //    var response = _requestService.RejectRequestForm(requestId);
        //    return response;
        //}

        [HttpPost("AllRequests")]
        public ResponseDTO GetAllCourseRequestForms()
        {
            var response = _requestService.GetRequests();
            return response;
        }
    }
}
