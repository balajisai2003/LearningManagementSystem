using System.Security.Cryptography;
using System.Text;

namespace LearningManagementSystem.Utils
{
    public class Hasher
    {
        public static string PasswordHasher(string password)
        {
            using (SHA256 sha256Hash = SHA256.Create())
            {
                byte[] bytes = sha256Hash.ComputeHash(Encoding.UTF8.GetBytes(password));
                StringBuilder builder = new StringBuilder();
                for (int i = 0; i < bytes.Length; i++)
                {
                    builder.Append(bytes[i].ToString("x2"));
                }
                var hashedPassword = builder.ToString();
                return hashedPassword;
            }
        }
    }
}
