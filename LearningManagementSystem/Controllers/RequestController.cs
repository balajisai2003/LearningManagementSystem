using LearningManagementSystem.Models.DTOs;
using LearningManagementSystem.Services;
using LearningManagementSystem.Services.IServices;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace LearningManagementSystem.Controllers
{
    [Route("api/[controller]")]
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
    }
}
