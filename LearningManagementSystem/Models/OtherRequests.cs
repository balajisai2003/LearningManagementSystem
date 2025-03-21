namespace LearningManagementSystem.Models
{
    public class OtherRequests
    {

        public int RequestID { get; set; }
        public int EmployeeID { get; set; }
        public string RequestType { get; set; }
        public string Description { get; set; }
        public string RequestEmpIDs { get; set; } // Could be stored as JSON or comma-separated values with employeeid: employeeName
        public DateTime RequestDate { get; set; }
        public string Status { get; set; }
        public string Comments { get; set; }
        public string ImageLink { get; set; }
    }
}
