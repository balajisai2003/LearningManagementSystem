using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace LearningManagementSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CourseRequestController : ControllerBase
    {
        [HttpGet]
        public string ping()
        {
            return "pong";
        }
    }
}
