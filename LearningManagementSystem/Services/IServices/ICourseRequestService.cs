using LearningManagementSystem.Models;
using LearningManagementSystem.Models.DTOs;

namespace LearningManagementSystem.Services.IServices
{
    public interface ICourseRequestService
    {
        public ResponseDTO CreateRequestForm(CourseRequestForm form);
        public ResponseDTO UpdateRequestFormById(int id,CourseRequestForm form);
        public ResponseDTO DeleteRequestFormById(int id);
        public ResponseDTO ApproveRequestForm(int id); // once approved we need to add the course to all the employee in requestEmpIDs
        public ResponseDTO RejectRequestForm(int id);
        public ResponseDTO GetRequests();
        public ResponseDTO GetRequestById(int id);
        public ResponseDTO GetRequestsByEmployeeId(int employeeId);
    }
}
