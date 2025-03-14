using LearningManagementSystem.Models;
using LearningManagementSystem.Models.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LearningManagementSystem.Services.IServices
{
    public interface ICourseRequestService
    {
        Task<ResponseDTO> ApproveRequestFormAsync(int requestId, string newOrReused);
        Task<ResponseDTO> CreateRequestFormAsync(CourseRequestForm form);
        Task<ResponseDTO> DeleteRequestFormAsync(int requestId);
        Task<ResponseDTO> GetRequestByIdAsync(int requestId);
        Task<ResponseDTO> GetAllRequestsAsync();
        Task<ResponseDTO> RejectRequestFormAsync(int requestId);
        Task<ResponseDTO> UpdateRequestFormAsync(int requestId, CourseRequestForm form);
        Task<ResponseDTO> GetRequestsByEmployeeIdAsync(int employeeId);
    }
}
