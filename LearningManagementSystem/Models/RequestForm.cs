namespace LearningManagementSystem.Models
{
    public class RequestForm
    {
        public int RequestID { get; set; }
        public int EmployeeID { get; set; }
        public Employee Employee { get; set; }
        public int CourseID { get; set; }
        public Course Course { get; set; }
        public string RequestedFor { get; set; }
        public string RequestEmpID { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string Status { get; set; }
        public string Comments { get; set; }
        public string ImageLink { get; set; }
    }
}
