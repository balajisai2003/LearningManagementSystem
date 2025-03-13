using LearningManagementSystem.Models;
using LearningManagementSystem.Models.DTOs;
using LearningManagementSystem.Services.IServices;

namespace LearningManagementSystem.Services
{
    public class CourseProgressService : ICourseProgressService
    {
        public ResponseDTO AddCourseProgress(CourseProgress courseProgress)
        {
            throw new NotImplementedException();
        }

        public ResponseDTO CompleteCourse(int ProgressId)
        {
            throw new NotImplementedException();
        }

        public ResponseDTO DeleteCourseProgress(int ProgressId)
        {
            throw new NotImplementedException();
        }

        public ResponseDTO GetAllCourseProgresses()
        {
            throw new NotImplementedException();
        }

        public ResponseDTO GetCourseProgressesByCourseId(int CourseId)
        {
            throw new NotImplementedException();
        }

        public ResponseDTO GetCourseProgressesById(int ProgressId)
        {
            throw new NotImplementedException();
        }

        public ResponseDTO GetCourseProgressesByStatus(string status, int EmployeeId = 0)
        {
            throw new NotImplementedException();
        }

        public ResponseDTO GetEmployeeCourseProgressesById(int EmployeeId)
        {
            throw new NotImplementedException();
        }

        public ResponseDTO ResetCourse(int ProgressId)
        {
            throw new NotImplementedException();
        }

        public ResponseDTO StartCourse(int ProgressId)
        {
            throw new NotImplementedException();
        }

        public ResponseDTO UpdateCourseProgress(int ProgressId, CourseProgress courseProgress)
        {
            throw new NotImplementedException();
        }
    }
}
