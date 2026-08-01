using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Models;

namespace Backend.Services
{
    public static class AdminSeeder
    {
        public class AdminSeedEntry
        {
            public string Nombre { get; set; } = string.Empty;
            public string Email { get; set; } = string.Empty;
            public string Password { get; set; } = string.Empty;
        }

        public static async Task SeedAsync(ApplicationDbContext db, IConfiguration configuration)
        {
            var entries = configuration.GetSection("AdminSeed").Get<List<AdminSeedEntry>>() ?? new();

            foreach (var entry in entries)
            {
                if (string.IsNullOrWhiteSpace(entry.Email) || string.IsNullOrWhiteSpace(entry.Password))
                    continue;

                var hash = BCrypt.Net.BCrypt.HashPassword(entry.Password);
                var usuario = await db.Usuarios.FirstOrDefaultAsync(u => u.Email == entry.Email);

                if (usuario == null)
                {
                    db.Usuarios.Add(new Usuario
                    {
                        Nombre = entry.Nombre,
                        Email = entry.Email,
                        PasswordHash = hash,
                        IntentosFallidos = 0,
                        Bloqueado = false,
                        CreadoEn = DateTime.UtcNow,
                    });
                }
                else
                {
                    // Actualiza nombre/contraseña si cambiaron en la config, pero NO toca
                    // IntentosFallidos/Bloqueado — eso es estado de runtime, no de seed.
                    usuario.Nombre = entry.Nombre;
                    usuario.PasswordHash = hash;
                }
            }

            await db.SaveChangesAsync();
        }
    }
}
