using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class Receta
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(200)]
        public string Titulo { get; set; } = string.Empty;

        [MaxLength(1000)]
        public string? Descripcion { get; set; }

        [Required]
        public string Ingredientes { get; set; } = string.Empty; // Texto o lista separada por saltos de línea / JSON

        [Required]
        public string Instrucciones { get; set; } = string.Empty; // Pasos de preparación

        public int? TiempoPreparacionMinutos { get; set; }

        public int? Porciones { get; set; }

        [MaxLength(50)]
        public string Dificultad { get; set; } = "Fácil"; // Fácil, Intermedio, Avanzado

        [MaxLength(500)]
        public string? ImagenUrl { get; set; }

        [MaxLength(500)]
        public string? VideoUrl { get; set; } // Archivo de video directo / MP4

        [MaxLength(500)]
        public string? YoutubeUrl { get; set; } // Enlace de YouTube

        public bool Publicada { get; set; } = true;

        public bool Destacada { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
