namespace LearningManagementSystem.Models
{
    public class Course
    {
        public int CourseID { get; set; }
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

    }


}
