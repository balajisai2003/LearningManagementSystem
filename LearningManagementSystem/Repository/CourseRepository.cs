using Dapper;
using LearningManagementSystem.Helpers;
using LearningManagementSystem.Models;
using Microsoft.Identity.Client;
using System.Data.Common;

namespace LearningManagementSystem.Repository
{
    public class CourseRepository
    {
        public DatabaseHelper _databasehelper;
        public CourseRepository(DatabaseHelper databaseHelper)
        {
            _databasehelper = databaseHelper;
        }

        public async Task<IEnumerable<Course>> GetCoursesAsync()
        {
            using (var dbconn = _databasehelper.GetConnection())
            {
                string query = "Select * from Courses";
                var response = await dbconn.QueryAsync<Course>(query);
                return response;
            }
        }

        public async Task<Course> GetCourseById(int courseId)
        {
            using (var dbconn = _databasehelper.GetConnection())
            {
                string query = "Select * from Courses where CourseID = @CourseID";
                var response = await dbconn.QueryAsync<Course>(query, new
                {
                    CourseID = courseId
                });
                return response.First();
            }
        }

        public async Task<bool> AddCourse(Course course)
        {
            /*
             public string Title { get; set; }
        public string ResourceLink { get; set; }
        public string Description { get; set; }
        public string Category { get; set; }  // "Technical", "Soft Skill", "Domain"
        public string TrainingMode { get; set; }  // "Online", "Trainer", "Recordings"
        public string TrainingSource { get; set; }  // "Youtube", "REpo"
        public int? DurationInWeeks { get; set; }
        public int? DurationInHours { get; set; }
        public decimal? Price { get; set; }
        public String Skills { get; set; }
        public int Points { get; }
            */
            using (var dbconn = _databasehelper.GetConnection())
            {
                string query = "Insert into Courses values(@Title, @ResourceLink, @Description, @Category, @TrainingMode, @TrainingSource, @DurationInWeeks, @DurationInHours, @Price, @Skills, @Points)";
                var rowsAffected = await dbconn.ExecuteAsync(query, new
                {
                    course.Title,
                    course.ResourceLink,
                    course.Description,
                    course.Category,
                    course.TrainingMode,
                    course.TrainingSource,
                    course.DurationInWeeks,
                    course.DurationInHours,
                    course.Price,
                    course.Skills,
                    course.Points
                });
                return rowsAffected > 0;
            }
        }

        public async Task<bool> UpdateCourse(int courseId, Course course)
        {
            using (var dbconn = _databasehelper.GetConnection())
            {
                string query = "Update Courses set Title = @Title, ResourceLink = @ResourceLink, Description = @Description, Category = @Category, TrainingMode = @TrainingMode, TrainingSource = @TrainingSource, DurationInWeeks = @DurationInWeeks, DurationInHours = @DurationInHours, Price = @Price, Skills = @Skills, Points = @Points where CourseID = @CourseID";
                var rowsAffected = await dbconn.ExecuteAsync(query, new
                {
                    Title = course.Title,
                    ResourseLink = course.ResourceLink,
                    Description = course.Description,
                    Category = course.Category,
                    TrainingMode = course.TrainingMode,
                    TrainingSource = course.TrainingSource,
                    DurationInWeeks = course.DurationInWeeks,
                    DurationInHours = course.DurationInHours,
                    Price = course.Price,
                    Skills = course.Skills,
                    Points = course.Points,
                    CourseID = courseId
                });
                return rowsAffected>0;
            }
        }

        public async Task<bool> DeleteCourse(int courseId)
        {
            using (var dbConn = _databasehelper.GetConnection())
            {
                string query = "Delete from Courses where CourseID = @CourseID";
                var response = await dbConn.ExecuteAsync(query, new
                {
                    CourseID = courseId
                });
                return response>0;
            }
        }


    }
}
