namespace LearningManagementSystem.Models
{
    public class JwtOptions
    {
        public string? Issuer { get; set; }
        public string? Audience { get; set; }
        public string? Secret { get; set; }
        public double DurationInMinutes { get; set; }
    }
}
