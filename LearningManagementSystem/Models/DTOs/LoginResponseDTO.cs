namespace LearningManagementSystem.Models.DTOs
{
    public class LoginResponseDTO
    {
        public object employee { get; set; }
        public string Token { get; set; }
        public string message { get; set; }
        public bool isSuccess { get; set; }
    }
}
