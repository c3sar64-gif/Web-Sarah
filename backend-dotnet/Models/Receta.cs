using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class Receta
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(300)]
        public string Titulo { get; set; } = string.Empty;

        [MaxLength(4000)]
        public string? Descripcion { get; set; }

        public string Ingredientes { get; set; } = string.Empty;

        public string Instrucciones { get; set; } = string.Empty;

        public int? TiempoPreparacionMinutos { get; set; }

        public int? Porciones { get; set; }

        [MaxLength(50)]
        public string Dificultad { get; set; } = "Fácil";

        [MaxLength(2000)]
        public string? ImagenUrl { get; set; }

        [MaxLength(2000)]
        public string? VideoUrl { get; set; }

        [MaxLength(2000)]
        public string? YoutubeUrl { get; set; }

        public bool Publicada { get; set; } = true;

        public bool Destacada { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
