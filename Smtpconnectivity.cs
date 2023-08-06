using System;
using System.Net;
using System.Net.Mail;

namespace LeaveApplicationPortal
{
    public class SmtpConnectivity
    {
        public void SendEmail(Emaildata data)
        {
            try
            {
                MailMessage message = new MailMessage();
                message.From = new MailAddress("deepakbhatt7060@gmail.com");
                message.To.Add(data.Email);
                message.Subject = "Email Verification";
                message.Body = "Your Email Verification code is : "+data.Otp;

                SmtpClient smtpClient = new SmtpClient("smtp.gmail.com", 587);
                smtpClient.Credentials = new NetworkCredential("deepakbhatt7060@gmail.com", "xhfrpozxvjjyuerh");
                smtpClient.EnableSsl = true;

                smtpClient.Send(message);

                Console.WriteLine("Email sent successfully!");
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error sending email: " + ex.Message);
            }
        }
    }
}
