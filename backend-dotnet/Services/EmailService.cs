using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Options;
using Backend.Models;

namespace Backend.Services
{
    public class EmailService : IEmailService
    {
        private readonly EmailSettings _settings;
        private readonly ILogger<EmailService> _logger;

        public EmailService(IOptions<EmailSettings> settings, ILogger<EmailService> logger)
        {
            _settings = settings.Value;
            _logger = logger;
        }

        public async Task EnviarNotificacionContactoAsync(MensajeContacto mensaje)
        {
            if (string.IsNullOrWhiteSpace(_settings.SenderEmail) ||
                string.IsNullOrWhiteSpace(_settings.SenderPassword) ||
                string.IsNullOrWhiteSpace(_settings.RecipientEmail))
            {
                _logger.LogWarning(
                    "Envío de correo omitido: faltan credenciales de Email en la configuración (SenderEmail/SenderPassword/RecipientEmail).");
                return;
            }

            using var client = new SmtpClient(_settings.SmtpHost, _settings.SmtpPort)
            {
                Credentials = new NetworkCredential(_settings.SenderEmail, _settings.SenderPassword),
                EnableSsl = true,
            };

            using var mail = new MailMessage
            {
                From = new MailAddress(_settings.SenderEmail, _settings.SenderName),
                Subject = $"Nuevo mensaje de contacto — {mensaje.Nombre}",
                Body =
                    $"Nombre: {mensaje.Nombre}\n" +
                    $"Email: {mensaje.Email}\n" +
                    $"Fecha: {mensaje.CreadoEn:yyyy-MM-dd HH:mm} UTC\n\n" +
                    $"Mensaje:\n{mensaje.Mensaje}",
                IsBodyHtml = false,
            };
            mail.To.Add(_settings.RecipientEmail);
            mail.ReplyToList.Add(new MailAddress(mensaje.Email, mensaje.Nombre));

            try
            {
                await client.SendMailAsync(mail);
            }
            catch (Exception ex)
            {
                // No queremos que un fallo de correo tumbe el guardado del mensaje en la base de datos.
                _logger.LogError(ex, "Falló el envío del correo de notificación de contacto.");
            }
        }
    }
}
