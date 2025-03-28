using LearningManagementSystem.Helpers;
using LearningManagementSystem.Models;
using LearningManagementSystem.Models.DTOs;
using LearningManagementSystem.Repository;
using LearningManagementSystem.Services.IServices;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LearningManagementSystem.Services
{
    public class CourseProgressService : ICourseProgressService
    {
        private readonly CourseProgressRepository _repository;

        public CourseProgressService(DatabaseHelper dbHelper)
        {
            _repository = new CourseProgressRepository(dbHelper);
        }
         
        public async Task<ResponseDTO> AddCourseProgressAsync(CourseProgress courseProgress)
        {
            try
            {
                if (await _repository.IsDuplicateCourseProgressExist(courseProgress.EmployeeID, courseProgress.CourseID)) 
                {
                    return new ResponseDTO()
                    {
                        Success = false,
                        Message = "Course Progress Already Exists",
                        Data = null,
                    };
                }
                bool isAdded = await _repository.AddCourseProgressAsync(courseProgress.CourseID, courseProgress.EmployeeID, courseProgress.NewOrReUsed, courseProgress.RequestorEmployeeId);
                return GenerateResponse(isAdded, "Course progress added successfully.", "Failed to add course progress.");
            }
            catch (Exception ex)
            {
                return HandleException(ex, "An error occurred while adding course progress.");
            }
        }

        public async Task<ResponseDTO> CompleteCourseAsync(int progressId)
        {
            try
            {
                bool isUpdated = await _repository.UpdateCourseProgressAsync(progressId, "Completed", DateTime.UtcNow);
                return GenerateResponse(isUpdated, "Course marked as completed.", "Failed to complete the course.");
            }
            catch (Exception ex)
            {
                return HandleException(ex, "An error occurred while completing the course.");
            }
        }

        public async Task<ResponseDTO> DeleteCourseProgressAsync(int progressId)
        {
            try
            {
                bool isDeleted = await _repository.DeleteCourseProgressAsync(progressId);
                return GenerateResponse(isDeleted, "Course progress deleted successfully.", "Failed to delete course progress.");
            }
            catch (Exception ex)
            {
                return HandleException(ex, "An error occurred while deleting course progress.");
            }
        }

        public async Task<ResponseDTO> GetAllCourseProgressesAsync()
        {
            try
            {
                var progresses = await _repository.GetCourseProgressAsync();
                return GenerateResponse(progresses != null, "Retrieved all course progresses.", "No course progress records found.", progresses);
            }
            catch (Exception ex)
            {
                return HandleException(ex, "An error occurred while retrieving course progresses.");
            }
        }

        public async Task<ResponseDTO> GetCourseProgressByIdAsync(int progressId)
        {
            try
            {
                var progress = await _repository.GetCourseProgressByIdAsync(progressId);
                return GenerateResponse(progress != null, "Course progress retrieved successfully.", "Course progress not found.", progress);
            }
            catch (Exception ex)
            {
                return HandleException(ex, "An error occurred while retrieving course progress.");
            }
        }

        public async Task<ResponseDTO> GetCourseProgressesByCourseIdAsync(int courseId)
        {
            try
            {
                var progresses = await _repository.GetCourseProgressAsync(courseId: courseId);
                return GenerateResponse(progresses != null, "Course progresses retrieved successfully.", "No course progresses found.", progresses);
            }
            catch (Exception ex)
            {
                return HandleException(ex, "An error occurred while retrieving course progresses by course ID.");
            }
        }

        public async Task<ResponseDTO> GetEmployeeCourseProgressesAsync(int employeeId)
        {
            try
            {
                var progresses = await _repository.GetCourseProgressAsync(employeeId: employeeId);
                return GenerateResponse(progresses != null, "Employee course progresses retrieved successfully.", "No course progress found for this employee.", progresses);
            }
            catch (Exception ex)
            {
                return HandleException(ex, "An error occurred while retrieving employee course progresses.");
            }
        }

        public async Task<ResponseDTO> ResetCourseAsync(int progressId)
        {
            try
            {
                bool isReset = await _repository.ResetCourseProgressAsync(progressId);
                return GenerateResponse(isReset, "Course progress reset successfully.", "Failed to reset course progress.");
            }
            catch (Exception ex)
            {
                return HandleException(ex, "An error occurred while resetting course progress.");
            }
        }

        public async Task<ResponseDTO> StartCourseAsync(int progressId)
        {
            try
            {
                bool isUpdated = await _repository.UpdateCourseProgressAsync(progressId, "Started");
                return GenerateResponse(isUpdated, "Course progress updated successfully.", "Failed to update progress.");
            }
            catch (Exception ex)
            {
                return HandleException(ex, "An error occurred while starting the course.");
            }
        }

        public async Task<ResponseDTO> UpdateCourseProgressAsync(int progressId, CourseProgress courseProgress)
        {
            try
            {
                bool isUpdated = await _repository.UpdateCourseProgressAsync(progressId, courseProgress.Status, courseProgress.EndDate);
                return GenerateResponse(isUpdated, "Course progress updated successfully.", "Failed to update progress.");
            }
            catch (Exception ex)
            {
                return HandleException(ex, "An error occurred while updating course progress.");
            }
        }

        public async Task<ResponseDTO> GetCourseProgressesByStatusAsync(string status, int employeeId = 0)
        {
            try
            {
                var progresses = await _repository.GetCourseProgressesByStatusAsync(status, employeeId);
                return GenerateResponse(progresses != null, "Course progresses retrieved successfully.", "No course progresses found.", progresses);
            }
            catch (Exception ex)
            {
                return HandleException(ex, "An error occurred while retrieving course progresses by status.");
            }
        }

        // Helper method to generate ResponseDTO
        private ResponseDTO GenerateResponse(bool success, string successMessage, string failureMessage, object data = null)
        {
            return new ResponseDTO
            {
                Success = success,
                Message = success ? successMessage : failureMessage,
                Data = success ? data : null
            };
        }

        // Helper method to handle exceptions
        private ResponseDTO HandleException(Exception ex, string customMessage)
        {
            return new ResponseDTO
            {
                Success = false,
                Message = customMessage,
                Data = ex.Message
            };
        }

        public async Task<int> GetEmployeeIdByProgressId(int progressId)
        {
            var progress = await _repository.GetCourseProgressByIdAsync(progressId);
            return progress.EmployeeID;
        }
    }
}