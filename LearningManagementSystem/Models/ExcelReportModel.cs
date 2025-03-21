namespace LearningManagementSystem.Models
{
    public class ExcelReportModel
    {
        public int RequestorID { get; set; }
        public string RequestorName { get; set; }
        public int ParticipantID { get; set; }
        public string ParticipantName { get; set; }
        public string Designation { get; set; }
        public string Cadre { get; set; }
        public string Location { get; set; }
        public string TechGroup { get; set; }
        public string Category { get; set; }
        public string TrainingMode { get; set; }
        public string CourseTitle { get; set; }
        public int DurationInWeeks { get; set; }
        public int DurationInHours { get; set; }
        public string status { get; set; }
        public DateTime? StartDate { get; set; } = null; 
        public DateTime? EndDate { get; set; } = null;
        public string MonthCompleted { get; set; }
        public decimal Price { get; set; }

    }
}
