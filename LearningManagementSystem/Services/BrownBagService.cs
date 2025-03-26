using LearningManagementSystem.Services.IServices;
using LearningManagementSystem.Models;
using LearningManagementSystem.Helpers;
using LearningManagementSystem.Models.DTOs;
using Dapper;
using LearningManagementSystem.Repository;
using System;
using System.Threading.Tasks;

namespace LearningManagementSystem.Services
{
    public class BrownBagService : IBrownBagService
    {
        private readonly BrownbagRepository repository;
        private readonly ResponseDTO _responseDTO;

        public BrownBagService(DatabaseHelper dbhelper)
        {
            repository = new BrownbagRepository(dbhelper);
            _responseDTO = new ResponseDTO();
        }

        public async Task<ResponseDTO> GetAllBrownBagSessionsAsync()
        {
            try
            {
                var brownbags = await repository.GetAllBrownbagsAsync();
                _responseDTO.Success = brownbags != null && brownbags.Any();
                _responseDTO.Message = _responseDTO.Success ? "Successfully fetched all brownbag sessions." : "No brownbag sessions found.";
                _responseDTO.Data = brownbags;
            }
            catch (Exception ex)
            {
                _responseDTO.Success = false;
                _responseDTO.Message = "An error occurred while fetching brownbag sessions.";
                _responseDTO.Data = ex.Message;
            }
            return _responseDTO;
        }

        public async Task<ResponseDTO> CreateBrownBagSessionAsync(Brownbag brownbag)
        {
            try
            {
                int created = await repository.CreateBrownbagAsync(brownbag);
                _responseDTO.Success = created > 0;
                _responseDTO.Message = _responseDTO.Success ? "Successfully created a new brownbag session." : "Failed to create the brownbag session.";
                _responseDTO.Data = created;
            }
            catch (Exception ex)
            {
                _responseDTO.Success = false;
                _responseDTO.Message = "An error occurred while creating the brownbag session.";
                _responseDTO.Data = ex.Message;
            }
            return _responseDTO;
        }

        public async Task<ResponseDTO> DeleteBrownBagSessionAsync(int requestId)
        {
            try
            {
                int deleted = await repository.DeleteBrownbagByIdAsync(requestId);
                _responseDTO.Success = deleted > 0;
                _responseDTO.Message = _responseDTO.Success ? "Successfully deleted the brownbag session." : "Brownbag session not found.";
                _responseDTO.Data = deleted;
            }
            catch (Exception ex)
            {
                _responseDTO.Success = false;
                _responseDTO.Message = "An error occurred while deleting the brownbag session.";
                _responseDTO.Data = ex.Message;
            }
            return _responseDTO;
        }

        public async Task<ResponseDTO> GetBrownBagSessionAsync(int requestId)
        {
            try
            {
                var brownbag = await repository.GetBrownbagByIdAsync(requestId);
                _responseDTO.Success = brownbag != null;
                _responseDTO.Message = _responseDTO.Success ? "Successfully fetched the brownbag session." : "Brownbag session not found.";
                _responseDTO.Data = brownbag;
            }
            catch (Exception ex)
            {
                _responseDTO.Success = false;
                _responseDTO.Message = "An error occurred while fetching the brownbag session.";
                _responseDTO.Data = ex.Message;
            }
            return _responseDTO;
        }

        public async Task<ResponseDTO> UpdateBrownBagSessionAsync(int requestId, Brownbag brownbag)
        {
            try
            {
                int updated = await repository.UpdateBrownbagByIdAsync(requestId, brownbag);
                _responseDTO.Success = updated > 0;
                _responseDTO.Message = _responseDTO.Success ? "Successfully updated the brownbag session." : "Brownbag session not found or update failed.";
                _responseDTO.Data = updated;
            }
            catch (Exception ex)
            {
                _responseDTO.Success = false;
                _responseDTO.Message = "An error occurred while updating the brownbag session.";
                _responseDTO.Data = ex.Message;
            }
            return _responseDTO;
        }

        public async Task<ResponseDTO> GetBrownBagSessionsByEmployeeIdAsync(int employeeId)
        {
            try
            {
                var brownbags = await repository.GetBrownbagsByEmployeeIdAsync(employeeId);
                _responseDTO.Success = brownbags != null && brownbags.Any();
                _responseDTO.Message = _responseDTO.Success ? "Successfully fetched all brownbag sessions by the employee." : "No brownbag sessions found for this employee.";
                _responseDTO.Data = brownbags;
            }
            catch (Exception ex)
            {
                _responseDTO.Success = false;
                _responseDTO.Message = "An error occurred while fetching brownbag sessions by the employee.";
                _responseDTO.Data = ex.Message;
            }
            return _responseDTO;
        }

        public async Task<ResponseDTO> ApproveBrownBagSessionAsync(int requestId)
        {
            try
            {
                var response = await repository.ApproveBrownbagByIdAsync(requestId);
                _responseDTO.Success = response;
                _responseDTO.Message = response ? "Successfully approved the brownbag session." : "Brownbag session not found or approval failed.";
                _responseDTO.Data = response;
            }
            catch(Exception ex)
            {
                _responseDTO.Success = false;
                _responseDTO.Message = "An error occurred while fetching brownbag sessions by the employee.";
                _responseDTO.Data = ex.Message;
            }
            return _responseDTO;
        }

        public async Task<ResponseDTO> RejectBrownBagSessionAsync(int requestId)
        {
            try
            {
                var response = await repository.RejectBrownbagByIdAsync(requestId);
                _responseDTO.Success = response;
                _responseDTO.Message = response ? "Successfully rejected the brownbag session." : "Brownbag session not found or rejection failed.";
                _responseDTO.Data = response;
            }
            catch (Exception ex)
            {
                _responseDTO.Success = false;
                _responseDTO.Message = "An error occurred while fetching brownbag sessions by the employee.";
                _responseDTO.Data = ex.Message;
            }
            return _responseDTO;
        }
    }
}