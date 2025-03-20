using System.Net.Mail;
using System.Net;

namespace LearningManagementSystem.Utils
{
    public class MailService
    {
        private readonly IConfiguration _configuration;
        public MailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task SendMail(string to, string subject, string body, bool isbodyHtml)
        {
            try
            {
                string? MailServer = _configuration["EmailSettings:MailServer"];
                string? FromEmail = _configuration["EmailSettings:FromEmail"];
                string? Password = _configuration["EmailSettings:Password"];
                string? SenderName = _configuration["EmailSettings:SenderName"];
                int Port = Convert.ToInt32(_configuration["EmailSettings:MailPort"]);
                var client = new SmtpClient(MailServer, Port)
                {
                    Credentials = new NetworkCredential(FromEmail, Password),
                    EnableSsl = true,
                };
                MailAddress fromAddress = new MailAddress(FromEmail, SenderName);
                MailMessage mailMessage = new MailMessage
                {
                    From = fromAddress, 
                    Subject = subject, 
                    Body = body, 
                    IsBodyHtml = isbodyHtml 
                };
                mailMessage.To.Add(to);
                await client.SendMailAsync(mailMessage);
            }
            catch (SmtpException smtpEx)
            {
                // Log detailed SMTP error for debugging
                Console.WriteLine($"SMTP Error: {smtpEx.Message}");
                throw;
            }
            catch (Exception ex)
            {
                // Log general errors
                Console.WriteLine($"General Error: {ex.Message}");
                throw;
            }
        }
    }
}
