using System.Net.Mail;
using System.Net;
using SendGrid;
using SendGrid.Helpers.Mail;
using LearningManagementSystem.Models;

namespace LearningManagementSystem.Utils
{
    public class MailService
    {
        private readonly IConfiguration _configuration;
        public MailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<bool> SendMailToEmployee(string toAddress, CourseRequestForm requestForm)
        {
            try
            {
                string apiKey = ConfigurationBinder.GetValue<string>(_configuration, "apiKey");
                var client = new SendGridClient(apiKey);
                string fromMail = ConfigurationBinder.GetValue<string>(_configuration, "fromEmail");
                var from = new EmailAddress(fromMail, "LMS tool");
                var subject = "Course Request Form Submission";
                var to = new EmailAddress(toAddress);
                var plainTextContent = $"Dear Employee,\n\n" +
                                       $"Thank you for submitting your course request form. Here are the details:\n\n" +
                                       $"Employee ID: {requestForm.EmployeeID}\n" +
                                       $"Course ID: {requestForm.CourseID}\n" +
                                       $"Requested Date: {DateOnly.FromDateTime(requestForm.RequestDate)}\n" +
                                       $"Requested Employee IDs: {requestForm.RequestEmpIDs}\n\n" +
                                       $"Learning and Development (L&D) team will reach out to you within 24-48 hours.\n\n" +
                                       $"Thank you,\n" +
                                       $"LMS Team";
                var htmlContent = $"<p>Dear Employee,</p>" +
                                  $"<p>Thank you for submitting your course request form. Here are the details:</p>" +
                                  $"<strong>Employee ID:</strong> {requestForm.EmployeeID}<br>" +
                                  $"<strong>Course ID:</strong> {requestForm.CourseID}<br>" +
                                  $"<strong>Requested Date:</strong> {DateOnly.FromDateTime(requestForm.RequestDate)}<br>" +
                                  $"<strong>Requested Employee IDs:</strong> {requestForm.RequestEmpIDs}</p>" +
                                  $"<p>Learning and Development (L&D) team will reach out to you within 24-48 hours.</p>" +
                                  $"<p>Thank you,<br>" +
                                  $"L&D Team</p>";
                var msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent, htmlContent);

                var response = await client.SendEmailAsync(msg);

                if (response.StatusCode == System.Net.HttpStatusCode.Accepted)
                {
                    Console.WriteLine("Email sent successfully!");
                    return true;
                }
                else
                {
                    Console.WriteLine($"Failed to send email. Status code: {response.StatusCode}");
                    return false;
                }

            }
            catch (SmtpException smtpEx)
            {
                Console.WriteLine($"SMTP exception: {smtpEx.Message}");
                throw;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                throw;
            }
        }

        public async Task<bool> SendMailToLnD(CourseRequestForm requestForm)
        {
            try
            {
                string apiKey = ConfigurationBinder.GetValue<string>(_configuration, "apiKey");
                var client = new SendGridClient(apiKey);
                string fromMail = ConfigurationBinder.GetValue<string>(_configuration, "fromEmail");
                var from = new EmailAddress(fromMail, "LMS tool");
                string lndMail = ConfigurationBinder.GetValue<string>(_configuration, "lndMail");
                var to = new EmailAddress(lndMail);
                var subject = "New Course Request Form Submission";
                var plainTextContent = $"A new course request form has been submitted. Here are the details:\n\n" +
                                       $"Request ID: {requestForm.RequestID}\n" +
                                       $"Employee ID: {requestForm.EmployeeID}\n" +
                                       $"Course ID: {requestForm.CourseID}\n" +
                                       $"Requested Date: {DateOnly.FromDateTime(requestForm.RequestDate)}\n" +
                                       $"Requested Employee IDs: {requestForm.RequestEmpIDs}\n";
                var htmlContent = $"<p>A new course request form has been submitted. Here are the details:</p>" +
                                  $"<strong>Request ID:</strong> {requestForm.RequestID}<br>" +
                                  $"<strong>Employee ID:</strong> {requestForm.EmployeeID}<br>" +
                                  $"<strong>Course ID:</strong> {requestForm.CourseID}<br>" +
                                  $"<strong>Requested Date:</strong> {DateOnly.FromDateTime(requestForm.RequestDate)}<br>" +
                                  $"<strong>Requested Employee IDs:</strong> {requestForm.RequestEmpIDs}</p>";
                var msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent, htmlContent);

                var response = await client.SendEmailAsync(msg);

                if (response.StatusCode == System.Net.HttpStatusCode.Accepted)
                {
                    Console.WriteLine("Email sent successfully!");
                    return true;
                }
                else
                {
                    Console.WriteLine($"Failed to send email. Status code: {response.StatusCode}");
                    return false;
                }

            }
            catch (SmtpException smtpEx)
            {
                Console.WriteLine($"SMTP exception: {smtpEx.Message}");
                throw;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                throw;
            }
        }

        public async Task<bool> SendMailBrownBagEmployees(string toAddress, Brownbag brownbag)
        {
            try
            {
                string apiKey = ConfigurationBinder.GetValue<string>(_configuration, "apiKey");
                var client = new SendGridClient(apiKey);
                string fromMail = ConfigurationBinder.GetValue<string>(_configuration, "fromEmail");
                var from = new EmailAddress(fromMail, "LMS tool");
                var subject = "BrownBag Session Request Submission";
                var to = new EmailAddress(toAddress);
                var plainTextContent = $"Dear Employee,\n\n" +
                                       $"Thank you for submitting your request to conduct a BrownBag session. Here are the details:\n\n" +
                                       $"Employee Name: {brownbag.EmployeeName}\n" +
                                       $"Topic Type: {brownbag.TopicType}\n" +
                                       $"Topic Name: {brownbag.TopicName}\n" +
                                       $"Agenda: {brownbag.Agenda}\n" +
                                       $"Speaker Description: {brownbag.SpeakerDescription}\n" +
                                       $"Requested Date: {DateOnly.FromDateTime(brownbag.RequestDate)}\n\n" +
                                       $"Our team will review your request and get back to you within 24-48 hours.\n\n" +
                                       $"Thank you,\n" +
                                       $"LMS Team";
                var htmlContent = $"<p>Dear Employee,</p>" +
                                  $"<p>Thank you for submitting your request to conduct a BrownBag session. Here are the details:</p>" +
                                  $"<strong>Employee Name:</strong> {brownbag.EmployeeName}<br>" +
                                  $"<strong>Topic Type:</strong> {brownbag.TopicType}<br>" +
                                  $"<strong>Topic Name:</strong> {brownbag.TopicName}<br>" +
                                  $"<strong>Agenda:</strong> {brownbag.Agenda}<br>" +
                                  $"<strong>Speaker Description:</strong> {brownbag.SpeakerDescription}<br>" +
                                  $"<strong>Requested Date:</strong> {DateOnly.FromDateTime(brownbag.RequestDate)}<br>" +
                                  $"<p>Our team will review your request and get back to you within 24-48 hours.</p>" +
                                  $"<p>Thank you,<br>" +
                                  $"L&D Team</p>";
                var msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent, htmlContent);

                var response = await client.SendEmailAsync(msg);

                if (response.StatusCode == System.Net.HttpStatusCode.Accepted)
                {
                    Console.WriteLine("Email sent successfully!");
                    return true;
                }
                else
                {
                    Console.WriteLine($"Failed to send email. Status code: {response.StatusCode}");
                    return false;
                }

            }
            catch (SmtpException smtpEx)
            {
                Console.WriteLine($"SMTP exception: {smtpEx.Message}");
                throw;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                throw;
            }
        }


    }
}
