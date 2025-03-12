using LearningManagementSystem.Models;
using LearningManagementSystem.Models.DTOs;

namespace LearningManagementSystem.Services.IServices
{
    public interface IBrownBagService
    {
        public ResponseDTO CreateBrownBagSession(Brownbag brownbag);
        public ResponseDTO UpdateBrownBagSession(int requestId, Brownbag brownbag);
        public ResponseDTO DeleteBrownBagSession(int requestId);
        public ResponseDTO GetBrownBagSession(int requestId);
        public ResponseDTO GetAllBrownBagSessions();
        public ResponseDTO GetBrownBagSessionsByEmployeeId(int employeeId);


    }
}
