using LearningManagementSystem.Models;

namespace LearningManagementSystem.Services.IServices
{
    public interface ICourseRequestForm
    {
        void CreateRequestForm();
        CourseRequestForm UpdateRequestFormById(int id);
        void DeleteRequestFormById(int id);
        void ApproveRequestForm(int id);
        void RejectRequestForm(int id);
        List<CourseRequestForm> GetRequests();

        CourseRequestForm GetRequestById(int id);
    }
}
