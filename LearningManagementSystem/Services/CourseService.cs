using LearningManagementSystem.Helpers;
using LearningManagementSystem.Models;
using LearningManagementSystem.Models.DTOs;
using LearningManagementSystem.Repository;
using LearningManagementSystem.Services.IServices;

namespace LearningManagementSystem.Services
{
    public class CourseService : ICourseService
    {
        private readonly CourseRepository _courseRepository;
        public CourseService(DatabaseHelper databaseHelper)
        {
            _courseRepository = new CourseRepository(databaseHelper);
        }
        public async Task<ResponseDTO> CreateCourseAsync(Course course)
        {
            try
            {
                bool isCreated = await _courseRepository.AddCourse(course);
                var Response = GenerateResponse(isCreated, "Course Added Successfully", "Failed to Add Course");
                return Response;
            }
            catch(Exception ex)
            {
                return HandleException(ex,"An error occured while adding the course");
            }

        }

        public async Task<ResponseDTO> DeleteCourseAsync(int courseId)
        {
            try
            {
                var isDeleted = await _courseRepository.DeleteCourse(courseId);
                var Response = GenerateResponse(isDeleted, "Course Deleted Successfully", "Failed to Delete Course");
                return Response;
            }
            catch (Exception ex)
            {
                return HandleException(ex, "An error occured while deleting the course");
            }
        }

        public async Task<ResponseDTO> GetAllCoursesasync()
        {
            try
            {
                var Courses = await _courseRepository.GetCoursesAsync();
                var Response = GenerateResponse(true, "Courses Fetched Successfully", "Failed to Fetch Courses", Courses);
                return Response;
            }
            catch(Exception ex)
            {
                return HandleException(ex, "An error occured while fetching the courses");
            }
        }

        public async Task<ResponseDTO> GetCourseByIdAsync(int courseId)
        {
            try 
            { 
                var course = await _courseRepository.GetCourseById(courseId);
                var response = GenerateResponse(course != null, "Course fetched successfully", "Failed to fetch the course", course);
                return response;
            }
            catch (Exception ex)
            {
                return HandleException(ex, "An error occured while fetching the course");
            }
        }

        public async Task<ResponseDTO> UpdateCourseAsync(int courseId,Course course)
        {
            try
            {
                var isUpdated = await _courseRepository.UpdateCourse(courseId,course);
                var Response = GenerateResponse(isUpdated, "Course Updated Successfully", "Failed to Update Course");
                return Response;
            }
            catch (Exception ex)
            {
                return HandleException(ex, "An error occured while updating the course");
            }
        }

        private ResponseDTO GenerateResponse(bool success, string successMessage, string failureMessage, object data = null)
        {
            return new ResponseDTO
            {
                Success = success,
                Message = success ? successMessage : failureMessage,
                Data = success ? data : null
            };
        }

        private ResponseDTO HandleException(Exception ex, string customMessage)
        {
            return new ResponseDTO
            {
                Success = false,
                Message = customMessage,
                Data = ex.Message
            };
        }
    }
}
