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

            // Seed inicial de recetas si la tabla está vacía
            if (!await db.Recetas.AnyAsync())
            {
                db.Recetas.AddRange(
                    new Receta
                    {
                        Titulo = "Pie de Limón Clásico con Merengue Suizo",
                        Descripcion = "Aprende el secreto para lograr una masa quebrada ultra crocante, un relleno cremoso de limón natural y un merengue suizo firme y brillante.",
                        Ingredientes = "250g de harina de trigo\n125g de mantequilla fría en cubos\n1 yema de huevo\n50ml de agua helada\n1 lata (395g) de leche condensada\n120ml de jugo de limón sutil recién exprimido\nRalladura de 2 limones\n3 claras de huevo\n180g de azúcar blanca",
                        Instrucciones = "1. Procesar la harina con la mantequilla fría hasta lograr una textura arenosa.\n2. Añadir la yema y el agua helada, unir sin amasar demasiado. Envolver en papel film y refrigerar 30 minutos.\n3. Estirar la masa, forrar un molde de tarta de 24cm y pinchar la base con un tenedor.\n4. Hornear a 180°C durante 15-18 minutos hasta que esté dorada y dejar enfriar.\n5. Para el relleno: mezclar la leche condensada con el jugo de limón y la ralladura hasta que espese naturalmente. Volcar sobre la masa horneada.\n6. Para el merengue: llevar las claras y el azúcar a baño maría revolviendo constantemente hasta disolver los granos de azúcar (60°C). Luego batir a velocidad máxima hasta obtener picos firmes y brillantes.\n7. Decorar el pie con manga pastelera y dorar con soplete de cocina o gratinador.",
                        TiempoPreparacionMinutos = 60,
                        Porciones = 8,
                        Dificultad = "Fácil",
                        ImagenUrl = "https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=800&q=80",
                        YoutubeUrl = "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                        Publicada = true,
                        Destacada = true,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow,
                    },
                    new Receta
                    {
                        Titulo = "Queque Tradicional Esponjoso de Vainilla",
                        Descripcion = "El clásico queque casero de la abuela, con miga ultra suave, aroma a vainilla y corteza dorada perfecta para el té de la tarde.",
                        Ingredientes = "3 tazas de harina leudante\n1 taza de mantequilla a temperatura ambiente\n1 y 1/2 tazas de azúcar\n4 huevos medianos\n1 taza de leche entera tibia\n1 cucharada de extracto de vainilla pura\n1 pizca de sal",
                        Instrucciones = "1. Precalentar el horno a 175°C y enmantequillar y enharinar un molde con chimenea.\n2. Batir la mantequilla con el azúcar durante 5 minutos hasta que la mezcla esté pálida y cremosa.\n3. Agregar los huevos uno a uno, batiendo bien después de cada adición.\n4. Incorporar la vainilla.\n5. Agregar la harina tamizada con la pizca de sal, alternando con la leche tibia en tres partes, mezclando a velocidad baja solo hasta integrar.\n6. Verter la masa en el molde y hornear durante 45-50 minutos o hasta que al insertar un palillo en el centro salga limpio.\n7. Dejar enfriar 15 minutos en el molde antes de desmoldar sobre una rejilla.",
                        TiempoPreparacionMinutos = 55,
                        Porciones = 10,
                        Dificultad = "Fácil",
                        ImagenUrl = "https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&w=800&q=80",
                        YoutubeUrl = "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                        Publicada = true,
                        Destacada = true,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow,
                    }
                );
            }

            await db.SaveChangesAsync();
        }
    }
}
