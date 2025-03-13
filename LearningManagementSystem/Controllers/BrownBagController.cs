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
        public ResponseDTO GetAllBrownBagSessions()
        {
            var response = _brownBagService.GetAllBrownBagSessions();
            return response;
        }

        [HttpPost("create")]
        public ResponseDTO Create(Brownbag brownbag)
        {
            var response = _brownBagService.CreateBrownBagSession(brownbag);
            return response;
        }

        [HttpDelete("delete/{requestId}")]
        public ResponseDTO Delete(int requestId)
        {
            var response = _brownBagService.DeleteBrownBagSession(requestId);
            return response;
        }

        [HttpGet("Requests/{requestId}")]
        public ResponseDTO Get(int requestId)
        {
            var response = _brownBagService.GetBrownBagSession(requestId);
            return response;
        }

        [HttpPut("update/{requestId}")]
        public ResponseDTO Update(int requestId, Brownbag brownbag)
        {
            var response = _brownBagService.UpdateBrownBagSession(requestId, brownbag);
            return response;
        }

        [HttpGet("Requests/Employee/{employeeId}")]
        public ResponseDTO GetBrownBagSessionsByEmployeeId(int employeeId)
        {
            var response = _brownBagService.GetBrownBagSessionsByEmployeeId(employeeId);
            return response;
        }



    }
}
