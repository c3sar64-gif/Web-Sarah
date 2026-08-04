using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class Usuario
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(200)]
        public string Nombre { get; set; } = string.Empty;

        [Required]
        [MaxLength(200)]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string PasswordHash { get; set; } = string.Empty;

        public int IntentosFallidos { get; set; } = 0;

        public bool Bloqueado { get; set; } = false;

        public string? RefreshToken { get; set; }

        public DateTime? RefreshTokenExpiryTime { get; set; }

        public DateTime CreadoEn { get; set; } = DateTime.UtcNow;
    }
}
