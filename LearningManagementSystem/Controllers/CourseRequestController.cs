using LearningManagementSystem.Models;
using LearningManagementSystem.Models.DTOs;
using LearningManagementSystem.Services;
using LearningManagementSystem.Services.IServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace LearningManagementSystem.Controllers
{
    [Route("api/CoursesRequest")]
    [ApiController]
    [Authorize]
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
            if(!await IsAuthorizedForRequeste(requestId))
            {
                return UnauthorizedResponse();
            }
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
            if (!await IsAuthorizedForRequeste(requestId))
            {
                return UnauthorizedResponse();
            }
            if( await _requestService.IsRequestApprovedAsync(requestId))
            {
                return new ResponseDTO
                {
                    Success = false,
                    Message = "Request already approves",
                    Data = null
                };
            }
            var response = await _requestService.UpdateRequestFormAsync(requestId, form);
            return response;
        }

        [HttpDelete("Delete")]
        public async Task<ResponseDTO> DeleteRequestFormAsync(int requestId)
        {
            if (!await IsAuthorizedForRequeste(requestId))
            {
                return UnauthorizedResponse();
            }
            if (await _requestService.IsRequestApprovedAsync(requestId))
            {
                return new ResponseDTO
                {
                    Success = false,
                    Message = "Request already approves",
                    Data = null
                };
            }
            var response = await _requestService.DeleteRequestFormAsync(requestId);
            return response;
        }

        [HttpPatch("Approve/{requestId}")]
        [Authorize(Roles = "Admin")]
        public async Task<ResponseDTO> ApproveRequestFormAsync([FromRoute] int requestId, string newOrReused)
        {
            if (await _requestService.IsRequestApprovedAsync(requestId))
            {
                return new ResponseDTO
                {
                    Success = false,
                    Message = "Request already approves",
                    Data = null
                };
            }
            var response = await _requestService.ApproveRequestFormAsync(requestId, newOrReused);
            return response;
        }
      
        [HttpPatch("Reject/{requestId}")]
        [Authorize(Roles = "Admin")]
        public async Task<ResponseDTO> RejectRequestFormAsync([FromRoute] int requestId)
        {
            var response = await _requestService.RejectRequestFormAsync(requestId);
            return response;
        }

        [HttpGet("Requests")]
        [Authorize(Roles = "Admin")]
        public async Task<ResponseDTO> GetAllRequestsAsync()
        {
            var response = await _requestService.GetAllRequestsAsync();
            return response;
        }

        [HttpGet("BulkRequests")]
        public async Task<ResponseDTO> GetBulkRequestsAsync()
        {
            var response = await _requestService.GetBulkRequestsAsync();
            return response;
        }

        [HttpGet("Requests/Employee/{employeeId}")]

        public async Task<ResponseDTO> GetRequestsByEmployeeIdAsync([FromRoute] int employeeId)
        {
            if (!IsAuthorizedUser(employeeId))
            {
                return UnauthorizedResponse();
            }
            var response = await _requestService.GetRequestsByEmployeeIdAsync(employeeId);
            return response;
        }

        private bool IsAuthorizedUser(int employeeId)
        {
            var userId = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;
            var role = User.FindFirst(ClaimTypes.Role)?.Value;
            return userId != null && (userId == employeeId.ToString() || role == "Admin");
        }

        private async Task<bool> IsAuthorizedForRequeste(int requestId)
        {
            // Assuming there's a method to get the employee ID from the progress ID
            int employeeId = await _requestService.GetEmployeeIdByRequestId(requestId);
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
