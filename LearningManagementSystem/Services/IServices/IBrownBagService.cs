using Azure;
using LearningManagementSystem.Models;
using LearningManagementSystem.Models.DTOs;

namespace LearningManagementSystem.Services.IServices
{
    public interface IBrownBagService
    {
         Task<ResponseDTO> CreateBrownBagSessionAsync(Brownbag brownbag);
         Task<ResponseDTO> UpdateBrownBagSessionAsync(int requestId, Brownbag brownbag);
         Task<ResponseDTO> DeleteBrownBagSessionAsync(int requestId);
         Task<ResponseDTO> GetBrownBagSessionAsync(int requestId);
         Task<ResponseDTO> GetAllBrownBagSessionsAsync();
         Task<ResponseDTO> GetBrownBagSessionsByEmployeeIdAsync(int employeeId);
        Task<ResponseDTO> ApproveBrownBagSessionAsync(int requestId);
        Task<ResponseDTO> RejectBrownBagSessionAsync(int requestId);
        Task<int> GetEmployeeIdByBrownbagId(int requestId);


    }
}
