using LearningManagementSystem.Models;
using LearningManagementSystem.Models.DTOs;

namespace LearningManagementSystem.Services.IServices
{
    public interface ICourseService
    {
        public Task<ResponseDTO> GetAllCoursesasync();
        public Task<ResponseDTO> GetCourseByIdAsync(int courseId);
        public Task<ResponseDTO> CreateCourseAsync(Course course);
        public Task<ResponseDTO> UpdateCourseAsync(int courseId,Course course);
        public Task<ResponseDTO> DeleteCourseAsync(int courseId);


    }
}
