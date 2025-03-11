namespace LearningManagementSystem.Models
{
    public class CourseProgress
    {
        public int ProgressID { get; set; }
        public int EmployeeID { get; set; }
        public Employee Employee { get; set; }
        public int CourseID { get; set; }
        public Course Course { get; set; }
        public int Progress { get; set; }
        public string Status { get; set; }
        public DateTime LastUpdated { get; set; } = DateTime.Now;
    }
}
