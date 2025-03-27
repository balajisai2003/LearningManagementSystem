using Azure.Core;
using LearningManagementSystem.Models;
using LearningManagementSystem.Models.DTOs;
using LearningManagementSystem.Services.IServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace LearningManagementSystem.Controllers
{
    [Route("api/BrownBagRequest")]
    [ApiController]
    [Authorize]
    public class BrownBagController : ControllerBase
    {
        private IBrownBagService _brownBagService;
        public BrownBagController(IBrownBagService brownBagService)
        {
            _brownBagService = brownBagService;
        }
        
        [HttpGet("Requests")]
        public async Task<ResponseDTO> GetAllBrownBagSessions()
        {
            var response = await _brownBagService.GetAllBrownBagSessionsAsync();
            return response;
        }

        [HttpPost("create")]
        public async Task<ResponseDTO> Create(Brownbag brownbag)
        {
            brownbag.EmployeeID = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var response = await _brownBagService.CreateBrownBagSessionAsync(brownbag);
            return response;
        }

        [HttpDelete("delete/{requestId}")]
        public async Task<ResponseDTO> Delete(int requestId)
        {
            if (!await IsAuthorizedForRequeste(requestId))
            {
                return UnauthorizedResponse();
            }
            var response = await _brownBagService.DeleteBrownBagSessionAsync(requestId);
            return response;
        }

        [HttpGet("Requests/{requestId}")]
        public async Task<ResponseDTO> Get(int requestId)
        {
            if (!await IsAuthorizedForRequeste(requestId))
            {
                return UnauthorizedResponse();
            }
            var response = await _brownBagService.GetBrownBagSessionAsync(requestId);
            return response;
        }

        [HttpPut("update/{requestId}")]
        public async Task<ResponseDTO> Update(int requestId, Brownbag brownbag)
        {
            if (!await IsAuthorizedForRequeste(requestId))
            {
                return UnauthorizedResponse();
            }
            var response = await _brownBagService.UpdateBrownBagSessionAsync(requestId, brownbag);
            return response;
        }

        [HttpGet("Requests/Employee/{employeeId}")]
        public async Task<ResponseDTO> GetBrownBagSessionsByEmployeeId(int employeeId)
        {
            var response = await _brownBagService.GetBrownBagSessionsByEmployeeIdAsync(employeeId);
            return response;
        }

        [HttpPatch("accept/{requestId}")]
        [Authorize(Roles = "Admin")]
        public async Task<ResponseDTO> AcceptBrownBagRequest(int requestId)
        {
            var response = await _brownBagService.ApproveBrownBagSessionAsync(requestId);
            return response;
        }

        [HttpPatch("reject/{requestId}")]
        [Authorize(Roles = "Admin")]
        public async Task<ResponseDTO> RejectBrownBagRequest(int requestId)
        {
            var response = await _brownBagService.RejectBrownBagSessionAsync(requestId);
            return response;
        }

        private bool IsAuthorizedUser(int employeeId)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var role = User.FindFirst(ClaimTypes.Role)?.Value;
            return userId != null && (userId == employeeId.ToString() || role == "Admin");
        }

        private async Task<bool> IsAuthorizedForRequeste(int requestId)
        {
            // Assuming there's a method to get the employee ID from the progress ID
            int employeeId = await _brownBagService.GetEmployeeIdByBrownbagId(requestId);
            if (employeeId == -1)
                return false;
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
