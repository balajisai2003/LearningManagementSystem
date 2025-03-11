namespace LearningManagementSystem.Models
{
    public class Course
    {
        public int CourseID { get; set; }
        public string Topic { get; set; }
        public string Category { get; set; }  // "Technical", "Soft Skill", "Domain"
        public string TrainingMode { get; set; }  // "Online", "Trainer", "Recordings"
        public string TrainingSource { get; set; }  // "Self Learning", "Trainer", "Recordings"
        public int? DurationInWeeks { get; set; }
        public int? DurationInHours { get; set; }
        public decimal? Price { get; set; }
        public string Status { get; set; }  // "New", "ReUsed"
    }


}
