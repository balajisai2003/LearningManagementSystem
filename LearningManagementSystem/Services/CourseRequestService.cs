using LearningManagementSystem.Services.IServices;
using LearningManagementSystem.Repository;
using LearningManagementSystem.Helpers;
using LearningManagementSystem.Models;
using LearningManagementSystem.Models.DTOs;

namespace LearningManagementSystem.Services
{
    public class CourseRequestService : ICourseRequestService
    {
        public CourseRequestFormRepository repository;
        public ResponseDTO _responseDTO;

        public CourseRequestService(DatabaseHelper dbhelper)
        {
            repository = new CourseRequestFormRepository(dbhelper);
            _responseDTO = new ResponseDTO();
        }

        public ResponseDTO ApproveRequestForm(int requestId)
        {
            CourseRequestForm requestDetails = repository.GetRequestById(requestId);
            if (requestDetails.Status != "approved")
            {
                CourseRequestForm response = repository.ApproveRequestForm(requestId);
                _responseDTO.Success = true;
                _responseDTO.Message = "Successfully approved the request.";
                _responseDTO.Data = response;
                return _responseDTO;
            }
            _responseDTO.Success = false;
            _responseDTO.Message = "Request has already been approved!";
            _responseDTO.Data = null;
            return _responseDTO;
        }

        public ResponseDTO CreateRequestForm(CourseRequestForm form)
        {
            int created = repository.CreateRequestForm(form);
            if (created > 0)
            {
                _responseDTO.Success = true;
                _responseDTO.Message = "Successfully created a new request.";
                _responseDTO.Data = created;
            }
            else
            {
                _responseDTO.Success = false;
                _responseDTO.Message = "Failed to create the request.";
                _responseDTO.Data = null;
            }
            return _responseDTO;
        }

        public ResponseDTO DeleteRequestFormById(int requestId)
        {
            CourseRequestForm requestDetails = repository.GetRequestById(requestId);
            if (requestDetails != null)
            {
                int deleted = repository.DeleteRequestFormById(requestId);
                if (deleted > 0)
                {
                    _responseDTO.Success = true;
                    _responseDTO.Message = "Successfully deleted the request.";
                    _responseDTO.Data = deleted;
                }
                else
                {
                    _responseDTO.Success = false;
                    _responseDTO.Message = "Failed to delete the request.";
                    _responseDTO.Data = null;
                }
            }
            else
            {
                _responseDTO.Success = false;
                _responseDTO.Message = "Request not found!";
                _responseDTO.Data = null;
            }
            return _responseDTO;
        }

        public ResponseDTO GetRequestById(int requestId)
        {
            CourseRequestForm courseRequest = repository.GetRequestById(requestId);
            if (courseRequest != null)
            {
                _responseDTO.Success = true;
                _responseDTO.Message = "Successfully fetched the request.";
                _responseDTO.Data = courseRequest;
            }
            else
            {
                _responseDTO.Success = false;
                _responseDTO.Message = "Request not found!";
                _responseDTO.Data = null;
            }
            return _responseDTO;
        }

        public ResponseDTO GetRequests()
        {
            List<CourseRequestForm> requestsList = repository.GetRequests();
            if (requestsList != null && requestsList.Count > 0)
            {
                _responseDTO.Success = true;
                _responseDTO.Message = "Successfully fetched all requests.";
                _responseDTO.Data = requestsList;
            }
            else
            {
                _responseDTO.Success = false;
                _responseDTO.Message = "No requests found!";
                _responseDTO.Data = null;
            }
            return _responseDTO;
        }

        public ResponseDTO RejectRequestForm(int requestId)
        {
            CourseRequestForm response = repository.RejectRequestForm(requestId);
            if (response != null)
            {
                _responseDTO.Success = true;
                _responseDTO.Message = "Successfully rejected the request.";
                _responseDTO.Data = response;
            }
            else
            {
                _responseDTO.Success = false;
                _responseDTO.Message = "Failed to reject the request.";
                _responseDTO.Data = null;
            }
            return _responseDTO;
        }

        public ResponseDTO UpdateRequestFormById(int requestId, CourseRequestForm form)
        {
            CourseRequestForm requestDetails = repository.GetRequestById(requestId);
            if (requestDetails != null)
            {
                // Assuming UpdateRequestFormById updates the request status or other details
                CourseRequestForm response = repository.UpdateRequestFormById(requestId,form);
                _responseDTO.Success = true;
                _responseDTO.Message = "Successfully updated the request.";
                _responseDTO.Data = response;
            }
            else
            {
                _responseDTO.Success = false;
                _responseDTO.Message = "Request not found!";
                _responseDTO.Data = null;
            }
            return _responseDTO;
        }

        public ResponseDTO GetRequestsByEmployeeId(int employeeId)
        {
            List<CourseRequestForm> requestsList = repository.GetRequestsByEmployeeId(employeeId);
            if (requestsList != null && requestsList.Count > 0)
            {
                _responseDTO.Success = true;
                _responseDTO.Message = "Successfully fetched all requests.";
                _responseDTO.Data = requestsList;
            }
            else
            {
                _responseDTO.Success = false;
                _responseDTO.Message = "No requests found!";
                _responseDTO.Data = null;
            }
            return _responseDTO;
        }
    }
}
