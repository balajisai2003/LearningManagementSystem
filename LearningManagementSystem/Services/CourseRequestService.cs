using LearningManagementSystem.Services.IServices;
using LearningManagementSystem.Repository;
using LearningManagementSystem.Helpers;
using LearningManagementSystem.Models;
using LearningManagementSystem.Models.DTOs;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LearningManagementSystem.Services
{
    public class CourseRequestService : ICourseRequestService
    {
        private readonly CourseRequestFormRepository _repository;
        private readonly ResponseDTO _responseDTO;

        public CourseRequestService(CourseRequestFormRepository repository)
        {
            _repository = repository;
            _responseDTO = new ResponseDTO();
        }

        public async Task<ResponseDTO> ApproveRequestFormAsync(int requestId)
        {
            var requestDetails = await _repository.GetRequestByIdAsync(requestId);
            if (requestDetails == null)
            {
                _responseDTO.Success = false;
                _responseDTO.Message = "Request not found!";
                return _responseDTO;
            }

            if (requestDetails.Status == "Approved")
            {
                _responseDTO.Success = false;
                _responseDTO.Message = "Request has already been approved!";
                return _responseDTO;
            }

            bool success = await _repository.ApproveRequestAsync(requestId);
            _responseDTO.Success = success;
            _responseDTO.Message = success ? "Successfully approved the request." : "Failed to approve the request.";
            _responseDTO.Data = success ? requestDetails : null;

            return _responseDTO;
        }

        public async Task<ResponseDTO> CreateRequestFormAsync(CourseRequestForm form)
        {
            bool created = await _repository.CreateRequestFormAsync(form);

            _responseDTO.Success = created;
            _responseDTO.Message = created ? "Successfully created a new request." : "Failed to create the request.";
            _responseDTO.Data = created ? form : null;

            return _responseDTO;
        }

        public async Task<ResponseDTO> DeleteRequestFormAsync(int requestId)
        {
            var requestDetails = await _repository.GetRequestByIdAsync(requestId);
            if (requestDetails == null)
            {
                _responseDTO.Success = false;
                _responseDTO.Message = "Request not found!";
                return _responseDTO;
            }

            bool deleted = await _repository.DeleteRequestFormAsync(requestId);
            _responseDTO.Success = deleted;
            _responseDTO.Message = deleted ? "Successfully deleted the request." : "Failed to delete the request.";

            return _responseDTO;
        }

        public async Task<ResponseDTO> GetRequestByIdAsync(int requestId)
        {
            var courseRequest = await _repository.GetRequestByIdAsync(requestId);

            _responseDTO.Success = courseRequest != null;
            _responseDTO.Message = courseRequest != null ? "Successfully fetched the request." : "Request not found!";
            _responseDTO.Data = courseRequest;

            return _responseDTO;
        }

        public async Task<ResponseDTO> GetAllRequestsAsync()
        {
            var requestsList = await _repository.GetAllRequestsAsync();

            _responseDTO.Success = requestsList != null && requestsList.Any();
            _responseDTO.Message = _responseDTO.Success ? "Successfully fetched all requests." : "No requests found!";
            _responseDTO.Data = requestsList;

            return _responseDTO;
        }

        public async Task<ResponseDTO> RejectRequestFormAsync(int requestId)
        {
            bool success = await _repository.RejectRequestAsync(requestId);

            _responseDTO.Success = success;
            _responseDTO.Message = success ? "Successfully rejected the request." : "Failed to reject the request.";

            return _responseDTO;
        }

        public async Task<ResponseDTO> UpdateRequestFormAsync(int requestId, CourseRequestForm form)
        {
            var requestDetails = await _repository.GetRequestByIdAsync(requestId);
            if (requestDetails == null)
            {
                _responseDTO.Success = false;
                _responseDTO.Message = "Request not found!";
                return _responseDTO;
            }

            bool updated = await _repository.UpdateRequestFormAsync(requestId, form);
            _responseDTO.Success = updated;
            _responseDTO.Message = updated ? "Successfully updated the request." : "Failed to update the request.";
            _responseDTO.Data = updated ? form : null;

            return _responseDTO;
        }

        public async Task<ResponseDTO> GetRequestsByEmployeeIdAsync(int employeeId)
        {
            var requestsList = await _repository.GetRequestsByEmployeeIdAsync(employeeId);

            _responseDTO.Success = requestsList != null && requestsList.Any();
            _responseDTO.Message = _responseDTO.Success ? "Successfully fetched requests." : "No requests found!";
            _responseDTO.Data = requestsList;

            return _responseDTO;
        }
    }
}
