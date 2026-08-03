using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Models;
using Backend.Services;

namespace Backend.Controllers
{
    public class ContactoRequest
    {
        public string Nombre { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Mensaje { get; set; } = string.Empty;
    }

    [ApiController]
    [Route("api/[controller]")]
    public class ContactoController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IEmailService _emailService;

        public ContactoController(ApplicationDbContext context, IEmailService emailService)
        {
            _context = context;
            _emailService = emailService;
        }

        // GET: api/contacto
        // Lista de mensajes recibidos (para revisión manual, sin panel de admin todavía).
        [Authorize]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MensajeContacto>>> GetMensajes()
        {
            return await _context.MensajesContacto
                .OrderByDescending(m => m.CreadoEn)
                .AsNoTracking()
                .ToListAsync();
        }

        // POST: api/contacto
        [HttpPost]
        public async Task<ActionResult<MensajeContacto>> PostMensaje(ContactoRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Nombre) ||
                string.IsNullOrWhiteSpace(request.Email) ||
                string.IsNullOrWhiteSpace(request.Mensaje))
            {
                return BadRequest(new { error = "Nombre, email y mensaje son obligatorios." });
            }

            var mensaje = new MensajeContacto
            {
                Nombre = request.Nombre.Trim(),
                Email = request.Email.Trim(),
                Mensaje = request.Mensaje.Trim(),
                CreadoEn = DateTime.UtcNow,
            };

            _context.MensajesContacto.Add(mensaje);
            await _context.SaveChangesAsync();

            // El mensaje ya quedó guardado en la base; si el correo falla, no afecta la respuesta.
            await _emailService.EnviarNotificacionContactoAsync(mensaje);

            return CreatedAtAction(nameof(GetMensajes), new { id = mensaje.Id }, mensaje);
        }
    }
}
