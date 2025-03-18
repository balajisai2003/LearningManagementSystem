using LearningManagementSystem.Models;
using LearningManagementSystem.Models.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LearningManagementSystem.Services.IServices
{
    public interface ICourseProgressService
    {
        Task<ResponseDTO> GetAllCourseProgressesAsync();
        Task<ResponseDTO> GetCourseProgressByIdAsync(int progressId);
        Task<ResponseDTO> GetEmployeeCourseProgressesAsync(int employeeId);
        Task<ResponseDTO> GetCourseProgressesByStatusAsync(string status, int employeeId = 0);
        Task<ResponseDTO> GetCourseProgressesByCourseIdAsync(int courseId);
        Task<ResponseDTO> AddCourseProgressAsync(CourseProgress courseProgress);
        Task<ResponseDTO> StartCourseAsync(int progressId);
        Task<ResponseDTO> CompleteCourseAsync(int progressId);
        Task<ResponseDTO> ResetCourseAsync(int progressId);
        Task<ResponseDTO> UpdateCourseProgressAsync(int progressId, CourseProgress courseProgress);
        Task<ResponseDTO> DeleteCourseProgressAsync(int progressId);
        Task<int> GetEmployeeIdByProgressId(int progressId);
    }
}
