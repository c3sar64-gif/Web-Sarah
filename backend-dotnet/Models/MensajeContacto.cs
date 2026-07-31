using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class MensajeContacto
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(150)]
        public string Nombre { get; set; } = string.Empty;

        [Required]
        [MaxLength(200)]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        [MaxLength(2000)]
        public string Mensaje { get; set; } = string.Empty;

        public DateTime CreadoEn { get; set; } = DateTime.UtcNow;

        public bool Atendido { get; set; } = false;
    }
}
