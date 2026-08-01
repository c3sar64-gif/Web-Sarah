using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Services;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IJwtService _jwtService;

        public AuthController(ApplicationDbContext context, IJwtService jwtService)
        {
            _context = context;
            _jwtService = jwtService;
        }

        public record LoginRequest(string Email, string Password);
        public record AuthResponse(string Token, string Nombre, string Email);

        private const int MaxIntentosFallidos = 3;

        [HttpPost("login")]
        public async Task<ActionResult<AuthResponse>> Login(LoginRequest request)
        {
            var usuario = await _context.Usuarios.FirstOrDefaultAsync(u => u.Email == request.Email);
            if (usuario == null)
                return Unauthorized(new { message = "Credenciales inválidas." });

            if (usuario.Bloqueado)
            {
                return Unauthorized(new
                {
                    message = "Esta cuenta está bloqueada por intentos fallidos. Iniciá sesión con Google para desbloquearla."
                });
            }

            if (!BCrypt.Net.BCrypt.Verify(request.Password, usuario.PasswordHash))
            {
                usuario.IntentosFallidos++;
                if (usuario.IntentosFallidos >= MaxIntentosFallidos)
                    usuario.Bloqueado = true;

                await _context.SaveChangesAsync();
                return Unauthorized(new { message = "Credenciales inválidas." });
            }

            usuario.IntentosFallidos = 0;
            await _context.SaveChangesAsync();

            var token = _jwtService.GenerateToken(usuario);
            return new AuthResponse(token, usuario.Nombre, usuario.Email);
        }
    }
}
