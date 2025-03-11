namespace LearningManagementSystem.Models
{
    public class Course
    {
        public int CourseID { get; set; }
        public string Topic { get; set; }
        public string Category { get; set; }
        public string TrainingMode { get; set; }
        public string TrainingSource { get; set; }
        public int? DurationInWeeks { get; set; }
        public int? DurationInHours { get; set; }
        public decimal? Price { get; set; }
        public string Status { get; set; }
        public string MonthCompleted { get; set; }
        public int? CreatedByEmployeeID { get; set; }
        public Employee CreatedByEmployee { get; set; }
    }

    
}
