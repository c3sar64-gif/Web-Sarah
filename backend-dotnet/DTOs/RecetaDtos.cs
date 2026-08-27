using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs
{
    public class RecetaDto
    {
        public int Id { get; set; }
        public string Titulo { get; set; } = string.Empty;
        public string? Descripcion { get; set; }
        public string Ingredientes { get; set; } = string.Empty;
        public string Instrucciones { get; set; } = string.Empty;
        public int? TiempoPreparacionMinutos { get; set; }
        public int? Porciones { get; set; }
        public string Dificultad { get; set; } = "Fácil";
        public string? ImagenUrl { get; set; }
        public string? VideoUrl { get; set; }
        public string? YoutubeUrl { get; set; }
        public bool Publicada { get; set; }
        public bool Destacada { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }

    public class RecetaCreateDto
    {
        [Required(ErrorMessage = "El título de la receta es obligatorio.")]
        [MaxLength(200)]
        public string Titulo { get; set; } = string.Empty;

        [MaxLength(1000)]
        public string? Descripcion { get; set; }

        [Required(ErrorMessage = "Los ingredientes son obligatorios.")]
        public string Ingredientes { get; set; } = string.Empty;

        [Required(ErrorMessage = "Las instrucciones de preparación son obligatorias.")]
        public string Instrucciones { get; set; } = string.Empty;

        public int? TiempoPreparacionMinutos { get; set; }

        public int? Porciones { get; set; }

        [MaxLength(50)]
        public string Dificultad { get; set; } = "Fácil";

        [MaxLength(500)]
        public string? ImagenUrl { get; set; }

        [MaxLength(500)]
        public string? VideoUrl { get; set; }

        [MaxLength(500)]
        public string? YoutubeUrl { get; set; }

        public bool Publicada { get; set; } = true;

        public bool Destacada { get; set; } = false;
    }

    public class RecetaUpdateDto : RecetaCreateDto
    {
    }
}
