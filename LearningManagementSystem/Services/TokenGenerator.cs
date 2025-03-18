using LearningManagementSystem.Models;
using LearningManagementSystem.Services.IServices;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace LearningManagementSystem.Services
{
    public class TokenGenerator : ITokenGenerator
    {
        private readonly JwtOptions _jwtOptions;

        public TokenGenerator(IOptions<JwtOptions> jwtOptions)
        {
            _jwtOptions = jwtOptions.Value;
        }
        public string GenerateToken(Employee employee, string role)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = System.Text.Encoding.ASCII.GetBytes(_jwtOptions.Secret);

            var claims = new List<Claim>
                {
                    new Claim(JwtRegisteredClaimNames.Email, employee.Email), // Changed from employee.Email to employee.Name
                    new Claim(JwtRegisteredClaimNames.Sub, employee.EmployeeID.ToString()), // Changed from employee.Id to employee.EmployeeID
                    new Claim(JwtRegisteredClaimNames.Name, employee.Name), // Changed from employee.Email to employee.Name
                    new Claim(ClaimTypes.Role, role) // Changed from employee.Role to role
                };

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Audience = _jwtOptions.Audience,
                Issuer = _jwtOptions.Issuer,
                Subject = new ClaimsIdentity(claims),
                Expires = System.DateTime.UtcNow.AddMinutes(_jwtOptions.DurationInMinutes),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
