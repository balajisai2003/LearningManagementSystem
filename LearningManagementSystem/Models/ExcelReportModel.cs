namespace LearningManagementSystem.Models
{
    public class ExcelReportModel
    {
        public int EmployeeID { get; set; }
        public string Designation { get; set; }
        public string Category { get; set; }
        public string TechGroup { get; set; }
        public string TrainingMode { get; set; }
        public string CourseTitle { get; set; }
        public string status { get; set; }
        public DateTime RequestRangeStartDate { get; set; }

        public DateTime RequestRangeEndDate { get; set; }
    }
}
