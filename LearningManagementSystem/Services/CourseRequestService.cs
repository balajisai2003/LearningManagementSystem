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
        private readonly CourseRequestFormRepository _CRFrepository;

        private readonly CourseProgressRepository _CPRepository;

        private readonly ResponseDTO _responseDTO;

        public CourseRequestService(CourseRequestFormRepository CRFrepository, CourseProgressRepository CPRepository)
        {
            _CRFrepository = CRFrepository;
            _responseDTO = new ResponseDTO();
            _CPRepository = CPRepository;
        }

        public async Task<ResponseDTO> ApproveRequestFormAsync(int requestId, string newOrReused)
        {
            var requestDetails = await _CRFrepository.GetRequestByIdAsync(requestId);
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

            List<int> RequestEmpIDs = new List<int>();
            if (!string.IsNullOrEmpty(requestDetails.RequestEmpIDs))
            {
                RequestEmpIDs = requestDetails.RequestEmpIDs.Split(',').Select(int.Parse).ToList();
            }

            //bool IsCourseAdded = await _CPRepository.AddCourseProgressAsync(requestDetails.CourseID, requestDetails.EmployeeID, newOrReused);

            

            var res = await _CPRepository.AddMultipleCourseProgressAsync(requestDetails.CourseID, RequestEmpIDs, newOrReused);
            

            bool success = await _CRFrepository.ApproveRequestAsync(requestId) || res.success;
            _responseDTO.Success = success;
            _responseDTO.Message = success ? "Successfully approved the request." : "Failed to approve the request or Failed to add course to Progress.\n";
            _responseDTO.Message += $"Successfully added {res.Added.Count} .... the following have been added : \n {String.Join(",",res.Added)}....";
            _responseDTO.Data = success ? requestDetails : null;

            return _responseDTO;
        }

        public async Task<ResponseDTO> CreateRequestFormAsync(CourseRequestForm form)
        {
            bool created = await _CRFrepository.CreateRequestFormAsync(form);

            _responseDTO.Success = created;
            _responseDTO.Message = created ? "Successfully created a new request." : "Failed to create the request.";
            _responseDTO.Data = created ? form : null;

            return _responseDTO;
        }

        public async Task<ResponseDTO> DeleteRequestFormAsync(int requestId)
        {
            var requestDetails = await _CRFrepository.GetRequestByIdAsync(requestId);
            if (requestDetails == null) 
            {
                _responseDTO.Success = false;
                _responseDTO.Message = "Request not found!";
                return _responseDTO;
            }

            bool deleted = await _CRFrepository.DeleteRequestFormAsync(requestId);
            _responseDTO.Success = deleted;
            _responseDTO.Message = deleted ? "Successfully deleted the request." : "Failed to delete the request.";

            return _responseDTO;
        }

        public async Task<ResponseDTO> GetRequestByIdAsync(int requestId)
        {
            var courseRequest = await _CRFrepository.GetRequestByIdAsync(requestId);

            _responseDTO.Success = courseRequest != null;
            _responseDTO.Message = courseRequest != null ? "Successfully fetched the request." : "Request not found!";
            _responseDTO.Data = courseRequest;

            return _responseDTO;
        }

        public async Task<ResponseDTO> GetAllRequestsAsync()
        {
            var requestsList = await _CRFrepository.GetAllRequestsAsync();

            _responseDTO.Success = requestsList != null && requestsList.Any();
            _responseDTO.Message = _responseDTO.Success ? "Successfully fetched all requests." : "No requests found!";
            _responseDTO.Data = requestsList;

            return _responseDTO;
        }

        public async Task<ResponseDTO> RejectRequestFormAsync(int requestId)
        {
            bool success = await _CRFrepository.RejectRequestAsync(requestId);

            _responseDTO.Success = success;
            _responseDTO.Message = success ? "Successfully rejected the request." : "Failed to reject the request.";

            return _responseDTO;
        }

        public async Task<ResponseDTO> UpdateRequestFormAsync(int requestId, CourseRequestForm form)
        {
            var requestDetails = await _CRFrepository.GetRequestByIdAsync(requestId);
            if (requestDetails == null)
            {
                _responseDTO.Success = false;
                _responseDTO.Message = "Request not found!";
                return _responseDTO;
            }

            bool updated = await _CRFrepository.UpdateRequestFormAsync(requestId, form);
            _responseDTO.Success = updated;
            _responseDTO.Message = updated ? "Successfully updated the request." : "Failed to update the request.";
            _responseDTO.Data = updated ? form : null;

            return _responseDTO;
        }

        public async Task<ResponseDTO> GetRequestsByEmployeeIdAsync(int employeeId)
        {
            var requestsList = await _CRFrepository.GetRequestsByEmployeeIdAsync(employeeId);

            _responseDTO.Success = requestsList != null && requestsList.Any();
            _responseDTO.Message = _responseDTO.Success ? "Successfully fetched requests." : "No requests found!";
            _responseDTO.Data = requestsList;

            return _responseDTO;
        }
    }
}
