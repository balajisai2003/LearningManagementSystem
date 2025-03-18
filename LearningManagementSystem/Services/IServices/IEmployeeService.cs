using LearningManagementSystem.Models;
using LearningManagementSystem.Models.DTOs;

namespace LearningManagementSystem.Services.IServices
{
    public interface IEmployeeService 
    {
        Task<ResponseDTO> RegisterAsync(Employee request);
        Task<LoginResponseDTO> LoginAsync(LoginRequestDTO request);
        Task<ResponseDTO> UpdateAsync(int id, Employee request);
        Task<ResponseDTO> DeleteAsync(int id);
        Task<ResponseDTO> GetEmployeeByIdAsync(int id);
        Task<ResponseDTO> GetAllEmployeesAsync();
    }
}
