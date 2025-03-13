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
            bool isAdded = await _repository.AddCourseProgressAsync(courseProgress.CourseID, courseProgress.EmployeeID, courseProgress.NewOrReUsed);
            return GenerateResponse(isAdded, "Course progress added successfully.", "Failed to add course progress.");
        }

        public async Task<ResponseDTO> CompleteCourseAsync(int progressId)
        {
            bool isUpdated = await _repository.UpdateCourseProgressAsync(progressId, "Completed", DateTime.UtcNow);
            return GenerateResponse(isUpdated, "Course marked as completed.", "Failed to complete the course.");
        }

        public async Task<ResponseDTO> DeleteCourseProgressAsync(int progressId)
        {
            return new ResponseDTO
            {
                Success = false,
                Message = "Course progress deletion is not implemented."
            };
        }

        public async Task<ResponseDTO> GetAllCourseProgressesAsync()
        {
            var progresses = await _repository.GetCourseProgressAsync();
            return GenerateResponse(progresses != null, "Retrieved all course progresses.", "No course progress records found.", progresses);
        }

        public async Task<ResponseDTO> GetCourseProgressByIdAsync(int progressId)
        {
            var progress = await _repository.GetCourseProgressByIdAsync(progressId);
            return GenerateResponse(progress != null, "Course progress retrieved successfully.", "Course progress not found.", progress);
        }

        public async Task<ResponseDTO> GetCourseProgressesByCourseIdAsync(int courseId)
        {
            var progresses = await _repository.GetCourseProgressAsync(courseId: courseId);
            return GenerateResponse(progresses != null, "Course progresses retrieved successfully.", "No course progresses found.", progresses);
        }

        public Task<ResponseDTO> GetCourseProgressesByStatusAsync(string status, int employeeId = 0)
        {
            throw new NotImplementedException();
        }

        public async Task<ResponseDTO> GetEmployeeCourseProgressesAsync(int employeeId)
        {
            var progresses = await _repository.GetCourseProgressAsync(employeeId: employeeId);
            return GenerateResponse(progresses != null, "Employee course progresses retrieved successfully.", "No course progress found for this employee.", progresses);
        }

        public async Task<ResponseDTO> ResetCourseAsync(int progressId)
        {
            bool isReset = await _repository.ResetCourseProgressAsync(progressId);
            return GenerateResponse(isReset, "Course progress reset successfully.", "Failed to reset course progress.");
        }

        public Task<ResponseDTO> StartCourseAsync(int progressId)
        {
            throw new NotImplementedException();
        }

        public async Task<ResponseDTO> UpdateCourseProgressAsync(int progressId, CourseProgress courseProgress)
        {
            bool isUpdated = await _repository.UpdateCourseProgressAsync(progressId, courseProgress.Status, courseProgress.EndDate);
            return GenerateResponse(isUpdated, "Course progress updated successfully.", "Failed to update progress.");
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
    }
}
