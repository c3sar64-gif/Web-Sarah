using Backend.Models;

namespace Backend.Services
{
    public interface IEmailService
    {
        Task EnviarNotificacionContactoAsync(MensajeContacto mensaje);
    }
}
