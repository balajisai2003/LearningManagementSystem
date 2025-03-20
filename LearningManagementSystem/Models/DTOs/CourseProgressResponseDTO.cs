namespace LearningManagementSystem.Models.DTOs
{
    public class CourseProgressResponseDTO
    {
        public int ProgressID { get; set; }
        public int EmployeeID { get; set; }
        public Employee EmployeeDetails { get; set; }
        public int CourseID { get; set; }
        public string Status { get; set; }
        public DateTime LastUpdated { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string NewOrReUsed { get; set; }
        public string? MonthCompleted { get; set; }
        public Course CourseDetails { get; set; }
    }
}
