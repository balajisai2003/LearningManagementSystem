using LearningManagementSystem.Services.IServices;
using LearningManagementSystem.Models;
using LearningManagementSystem.Helpers;
using LearningManagementSystem.Models.DTOs;
using Dapper;
using LearningManagementSystem.Repository;

namespace LearningManagementSystem.Services
{
    public class BrownBagService:IBrownBagService
    {
        public BrownbagRepository repository;
        public ResponseDTO _responseDTO;

        public BrownBagService(DatabaseHelper dbhelper)
        {
            repository = new BrownbagRepository(dbhelper);
            _responseDTO = new ResponseDTO();
        }

        public ResponseDTO GetAllBrownBagSessions()
        {
            var brownbags = repository.GetAllBrownbags();
            if(brownbags != null || brownbags.Count()==0)
            {
                _responseDTO.Success = true;
                _responseDTO.Message = "Successfully fetched all brownbag sessions.";
                _responseDTO.Data = brownbags;
            }
            else
            {
                _responseDTO.Success = false;
                _responseDTO.Message = "Failed to fetch brownbag sessions.";
                _responseDTO.Data = null;
            }
            return _responseDTO;
        }

        public ResponseDTO CreateBrownBagSession(Brownbag brownbag)
        {
            int created = repository.CreateBrownbag(brownbag);
            if (created > 0)
            {
                _responseDTO.Success = true;
                _responseDTO.Message = "Successfully created a new brownbag session.";
                _responseDTO.Data = created;
            }
            else
            {
                _responseDTO.Success = false;
                _responseDTO.Message = "Failed to create the brownbag session.";
                _responseDTO.Data = null;
            }
            return _responseDTO;
        }

        public ResponseDTO DeleteBrownBagSession(int requestId)
        {
            int deleted = repository.DeleteBrownbagById(requestId);
            if (deleted > 0)
            {
                _responseDTO.Success = true;
                _responseDTO.Message = "Successfully deleted the brownbag session.";
                _responseDTO.Data = deleted;
            }
            else
            {
                _responseDTO.Success = false;
                _responseDTO.Message = "Failed to delete the brownbag session.";
                _responseDTO.Data = null;
            }
            return _responseDTO;
        }

        public ResponseDTO GetBrownBagSession(int requestId)
        {
            var brownbag = repository.GetBrownbagById(requestId);
            if (brownbag != null)
            {
                _responseDTO.Success = true;
                _responseDTO.Message = "Successfully fetched the brownbag session.";
                _responseDTO.Data = brownbag;
            }
            else
            {
                _responseDTO.Success = false;
                _responseDTO.Message = "Failed to fetch the brownbag session.";
                _responseDTO.Data = null;
            }
            return _responseDTO;
        }

        public ResponseDTO UpdateBrownBagSession(int requestId, Brownbag brownbag)
        {
            int updated = repository.UpdateBrownbagById(requestId, brownbag);
            if (updated > 0)
            {
                _responseDTO.Success = true;
                _responseDTO.Message = "Successfully updated the brownbag session.";
                _responseDTO.Data = updated;
            }
            else
            {
                _responseDTO.Success = false;
                _responseDTO.Message = "Failed to update the brownbag session.";
                _responseDTO.Data = null;
            }
            return _responseDTO;
        }

        public ResponseDTO GetBrownBagSessionsByEmployeeId(int employeeId)
        {
            var brownbags = repository.GetBrownbagsByEmployeeId(employeeId);
            if (brownbags != null || brownbags.Count() == 0)
            {
                _responseDTO.Success = true;
                _responseDTO.Message = "Successfully fetched all brownbag sessions by the employee.";
                _responseDTO.Data = brownbags;
            }
            else
            {
                _responseDTO.Success = false;
                _responseDTO.Message = "Failed to fetch brownbag sessions by the employee.";
                _responseDTO.Data = null;
            }
            return _responseDTO;
        }
    }
}
