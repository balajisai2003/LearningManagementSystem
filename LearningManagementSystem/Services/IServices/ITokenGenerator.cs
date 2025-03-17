using LearningManagementSystem.Models;

namespace LearningManagementSystem.Services.IServices
{
    public interface ITokenGenerator
    {
        string GenerateToken(Employee employee, string role);

    }
}
