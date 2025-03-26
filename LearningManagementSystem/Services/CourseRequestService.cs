using LearningManagementSystem.Services.IServices;
using LearningManagementSystem.Repository;
using LearningManagementSystem.Helpers;
using LearningManagementSystem.Models;
using LearningManagementSystem.Models.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Security.Cryptography.X509Certificates;
using LearningManagementSystem.Utils;

namespace LearningManagementSystem.Services
{
    public class CourseRequestService : ICourseRequestService
    {
        private readonly CourseRequestFormRepository _courseRequestRepository;
        private readonly CourseProgressRepository _courseProgressRepository;
        private readonly EmployeeRepository _employeeRepository;
        private readonly CourseRepository _courseRepository;
        private readonly ResponseDTO _responseDTO;
        private IConfiguration _configuration;
        private MailService _mailService;

        public CourseRequestService(CourseRequestFormRepository courseRequestRepository, CourseProgressRepository courseProgressRepository,EmployeeRepository employeeRepository,CourseRepository courseRepository, IConfiguration configuration)
        {
            _courseRequestRepository = courseRequestRepository;
            _courseProgressRepository = courseProgressRepository;
            _courseRepository = courseRepository;
            _employeeRepository = employeeRepository;
            _responseDTO = new ResponseDTO();
            _configuration = configuration;
            _mailService = new MailService(configuration);

        }

        public async Task<ResponseDTO> ApproveRequestFormAsync(int requestId, string newOrReused)
        {
            try
            {
                var requestDetails = await _courseRequestRepository.GetRequestByIdAsync(requestId);
                if (requestDetails == null)
                {
                    return new ResponseDTO { Success = false, Message = "Request not found!" };
                }

                if (requestDetails.Status == "Approved")
                {
                    return new ResponseDTO { Success = false, Message = "Request has already been approved!" };
                }

                var requestEmpIds = !string.IsNullOrEmpty(requestDetails.RequestEmpIDs)
                    ? requestDetails.RequestEmpIDs.Split(',').Select(int.Parse).ToList()
                    : new List<int>();

                var progressResult = await _courseProgressRepository.AddMultipleCourseProgressAsync(requestDetails.CourseID, requestEmpIds, newOrReused, requestDetails.EmployeeID);
                bool success = await _courseRequestRepository.ApproveRequestAsync(requestId) || progressResult.Success;

                return new ResponseDTO
                {
                    Success = success,
                    Message = success ? "Successfully approved the request." : "Failed to approve the request or add course to progress.",
                    Data = success ? requestDetails : null
                };
            }
            catch (Exception ex)
            {
                return new ResponseDTO { Success = false, Message = $"An error occurred: {ex.Message}" };
            }
        }

        public async Task<ResponseDTO> CreateRequestFormAsync(CourseRequestForm form)
        {
            try
            {
                var requestId = await _courseRequestRepository.CreateRequestFormAsync(form);
                bool created = requestId!=-1 ? true : false;
                if (created)
                {
                    form.RequestID = requestId;
                    Course course = await _courseRepository.GetCourseById(form.CourseID);
                    var employee = await _employeeRepository.GetEmployeeByIDAsync(form.EmployeeID);

                    var employeeMail = await _mailService.SendMailToEmployee(employee, form,course);
                    var lndMail = await _mailService.SendMailToLnD(employee, form, course);
                }
                return new ResponseDTO
                {
                    Success = created,
                    Message = created ? "Successfully created a new request." : "Failed to create the request.",
                    Data = created ? form : null
                };
            }
            catch (Exception ex)
            {
                return new ResponseDTO { Success = false, Message = $"An error occurred: {ex.Message}" };
            }
        }

        public async Task<ResponseDTO> DeleteRequestFormAsync(int requestId)
        {
            try
            {
                var requestDetails = await _courseRequestRepository.GetRequestByIdAsync(requestId);
                if (requestDetails == null)
                {
                    return new ResponseDTO { Success = false, Message = "Request not found!" };
                }

                bool deleted = await _courseRequestRepository.DeleteRequestFormAsync(requestId);
                return new ResponseDTO
                {
                    Success = deleted,
                    Message = deleted ? "Successfully deleted the request." : "Failed to delete the request."
                };
            }
            catch (Exception ex)
            {
                return new ResponseDTO { Success = false, Message = $"An error occurred: {ex.Message}" };
            }
        }

        public async Task<ResponseDTO> GetRequestByIdAsync(int requestId)
        {
            try
            {
                var courseRequest = await _courseRequestRepository.GetRequestByIdAsync(requestId);
                return new ResponseDTO
                {
                    Success = courseRequest != null,
                    Message = courseRequest != null ? "Successfully fetched the request." : "Request not found!",
                    Data = courseRequest
                };
            }
            catch (Exception ex)
            {
                return new ResponseDTO { Success = false, Message = $"An error occurred: {ex.Message}" };
            }
        }

        public async Task<ResponseDTO> GetAllRequestsAsync()
        {
            try
            {
                var requestsList = await _courseRequestRepository.GetAllRequestsAsync();
                return new ResponseDTO
                {
                    Success = requestsList != null && requestsList.Any(),
                    Message = requestsList != null && requestsList.Any() ? "Successfully fetched all requests." : "No requests found!",
                    Data = requestsList
                };
            }
            catch (Exception ex)
            {
                return new ResponseDTO { Success = false, Message = $"An error occurred: {ex.Message}" };
            }
        }

        public async Task<ResponseDTO> GetBulkRequestsAsync()
        {
            try
            {
                var requestsList = await _courseRequestRepository.GetBulkRequestsAsync();
                return new ResponseDTO
                {
                    Success = requestsList != null && requestsList.Any(),
                    Message = requestsList != null && requestsList.Any() ? "Successfully fetched all bulk requests." : "No bulk requests found!",
                    Data = requestsList
                };
            }
            catch (Exception ex)
            {
                return new ResponseDTO { Success = false, Message = $"An error occurred: {ex.Message}" };
            }
        }

        public async Task<ResponseDTO> RejectRequestFormAsync(int requestId)
        {
            try
            {
                bool success = await _courseRequestRepository.RejectRequestAsync(requestId);
                return new ResponseDTO
                {
                    Success = success,
                    Message = success ? "Successfully rejected the request." : "Failed to reject the request."
                };
            }
            catch (Exception ex)
            {
                return new ResponseDTO { Success = false, Message = $"An error occurred: {ex.Message}" };
            }
        }

        public async Task<ResponseDTO> UpdateRequestFormAsync(int requestId, CourseRequestForm form)
        {
            try
            {
                var requestDetails = await _courseRequestRepository.GetRequestByIdAsync(requestId);
                if (requestDetails == null)
                {
                    return new ResponseDTO { Success = false, Message = "Request not found!" };
                }

                bool updated = await _courseRequestRepository.UpdateRequestFormAsync(requestId, form);
                return new ResponseDTO
                {
                    Success = updated,
                    Message = updated ? "Successfully updated the request." : "Failed to update the request.",
                    Data = updated ? form : null
                };
            }
            catch (Exception ex)
            {
                return new ResponseDTO { Success = false, Message = $"An error occurred: {ex.Message}" };
            }
        }
        public async Task<ResponseDTO> GetRequestsByEmployeeIdAsync(int employeeId)
        {
            try
            {
                var requestsList = await _courseRequestRepository.GetRequestsByEmployeeIdAsync(employeeId);
                return new ResponseDTO
                {
                    Success = requestsList != null && requestsList.Any(),
                    Message = requestsList != null && requestsList.Any() ? "Successfully fetched all requests." : "No requests found!",
                    Data = requestsList
                };
            }
            catch (Exception ex)
            {
                return new ResponseDTO { Success = false, Message = $"An error occurred: {ex.Message}" };
            }
        }

        public async Task<int> GetEmployeeIdByRequestId(int requestId)
        {
            try
            {
                var requestDetails = await _courseRequestRepository.GetRequestByIdAsync(requestId);
                if (requestDetails == null)
                {
                    return -1;
                }
                return requestDetails.EmployeeID;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return -1;
            }
        }

        public async Task<bool> IsRequestApprovedAsync(int requestId)
        {
            try
            {
                var requestDetails = await _courseRequestRepository.GetRequestByIdAsync(requestId);
                return requestDetails.Status == "Approved";
            }
            catch (Exception)
            {
                return false;
            }
        }
    }
}