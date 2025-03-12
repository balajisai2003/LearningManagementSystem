namespace LearningManagementSystem.Models
{
    public class Brownbag
    {
        public int RequestId { get; set; }
        public int EmployeeID { get; set; }
        public string EmployeeName { get; set; }
        public string TopicType { get; set; }
        public string TopicName { get; set; }
        public string Agenda { get; set; }
        public string SpeakerDescription { get; set; }
        public DateTime RequestDate { get; set; }
    }
}
