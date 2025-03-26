using LearningManagementSystem.Models;
using LearningManagementSystem.Models.DTOs;
using LearningManagementSystem.Services.IServices;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace LearningManagementSystem.Controllers
{
    [Route("api/BrownBagRequest")]
    [ApiController]
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
            var response = await _brownBagService.CreateBrownBagSessionAsync(brownbag);
            return response;
        }

        [HttpDelete("delete/{requestId}")]
        public async Task<ResponseDTO> Delete(int requestId)
        {
            var response = await _brownBagService.DeleteBrownBagSessionAsync(requestId);
            return response;
        }

        [HttpGet("Requests/{requestId}")]
        public async Task<ResponseDTO> Get(int requestId)
        {
            var response = await _brownBagService.GetBrownBagSessionAsync(requestId);
            return response;
        }

        [HttpPut("update/{requestId}")]
        public async Task<ResponseDTO> Update(int requestId, Brownbag brownbag)
        {
            var response = await _brownBagService.UpdateBrownBagSessionAsync(requestId, brownbag);
            return response;
        }

        [HttpGet("Requests/Employee/{employeeId}")]
        public async Task<ResponseDTO> GetBrownBagSessionsByEmployeeId(int employeeId)
        {
            var response = await _brownBagService.GetBrownBagSessionsByEmployeeIdAsync(employeeId);
            return response;
        }



    }
}
