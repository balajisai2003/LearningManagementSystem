using System.Text.Json;

namespace LearningManagementSystem.Models
{
    public class CourseProgress
    {
        public int ProgressID { get; set; }
        public int EmployeeID { get; set; } 
        public int CourseID { get; set; } // Get the course details from CourseID
        //public int Progress { get; set; }  // 0 to 100
        public int RequestorEmployeeId { get; set; }
        public string Status { get; set; }  // "default : Not Started", "In Progress", "Completed"
        public DateTime LastUpdated { get; set; } = DateTime.UtcNow;
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string NewOrReUsed { get; set; }  // "New", "ReUsed"
        public string? MonthCompleted { get; set; }
        //public string CourseContents { get; set; }  // JSON string

        //public List<CourseContentItem>? GetCourseContents()
        //{
        //    return string.IsNullOrEmpty(CourseContents)
        //        ? new List<CourseContentItem>()
        //        : JsonSerializer.Deserialize<List<CourseContentItem>>(CourseContents);
        //}

        //public void SetCourseContents(List<CourseContentItem> contents)
        //{
        //    CourseContents = JsonSerializer.Serialize(contents);
        //}
    }

    //public class CourseContentItem
    //{
    //    public string Title { get; set; }
    //    public string Link { get; set; }
    //    public bool Completed { get; set; }
    //}
}
