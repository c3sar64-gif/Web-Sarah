using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Services;
using Google.Apis.Auth;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IJwtService _jwtService;
        private readonly IConfiguration _configuration;

        public AuthController(ApplicationDbContext context, IJwtService jwtService, IConfiguration configuration)
        {
            _context = context;
            _jwtService = jwtService;
            _configuration = configuration;
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

        public record GoogleLoginRequest(string IdToken);

        [HttpPost("google")]
        public async Task<ActionResult<AuthResponse>> GoogleLogin(GoogleLoginRequest request)
        {
            var clientId = _configuration["Google:ClientId"];
            if (string.IsNullOrWhiteSpace(clientId))
                return StatusCode(503, new { message = "Login con Google no está configurado." });

            GoogleJsonWebSignature.Payload payload;
            try
            {
                payload = await GoogleJsonWebSignature.ValidateAsync(request.IdToken, new GoogleJsonWebSignature.ValidationSettings
                {
                    Audience = new[] { clientId },
                });
            }
            catch (InvalidJwtException)
            {
                return Unauthorized(new { message = "Token de Google inválido." });
            }

            var usuario = await _context.Usuarios.FirstOrDefaultAsync(u => u.Email == payload.Email);
            if (usuario == null)
                return StatusCode(403, new { message = "Esta cuenta no tiene acceso al panel." });

            // Login exitoso con Google desbloquea la cuenta (ver spec: auto-desbloqueo).
            usuario.IntentosFallidos = 0;
            usuario.Bloqueado = false;
            await _context.SaveChangesAsync();

            var token = _jwtService.GenerateToken(usuario);
            return new AuthResponse(token, usuario.Nombre, usuario.Email);
        }
    }
}
