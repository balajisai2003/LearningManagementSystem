using System.ComponentModel.DataAnnotations;

namespace LearningManagementSystem.Models.DTOs
{
    public class LoginRequestDTO
    {
        [Required]
        [MaxLength(255)]
        [EmailAddress]
        public string Email { get; set; }
        [Required]
        [MinLength(8)]
        public string Password { get; set; }

    }
}
