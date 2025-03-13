using LearningManagementSystem.Models;
using LearningManagementSystem.Models.DTOs;

namespace LearningManagementSystem.Services.IServices
{
    public interface ICourseProgressService
    {
        public ResponseDTO GetAllCourseProgresses();
        public ResponseDTO GetCourseProgressesById(int ProgressId);
        public ResponseDTO GetEmployeeCourseProgressesById(int EmployeeId);
        public ResponseDTO GetCourseProgressesByStatus(string status, int EmployeeId = 0);
        public ResponseDTO GetCourseProgressesByCourseId(int CourseId);
        public ResponseDTO AddCourseProgress(CourseProgress courseProgress);
        public ResponseDTO StartCourse(int ProgressId);
        public ResponseDTO CompleteCourse(int ProgressId);
        public ResponseDTO ResetCourse(int ProgressId);
        public ResponseDTO UpdateCourseProgress(int ProgressId, CourseProgress courseProgress);
        public ResponseDTO DeleteCourseProgress(int ProgressId);


    }
}
