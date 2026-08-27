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
        [MaxLength(300)]
        public string Titulo { get; set; } = string.Empty;

        [MaxLength(4000)]
        public string? Descripcion { get; set; }

        public string? Ingredientes { get; set; }

        public string? Instrucciones { get; set; }

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
    }

    public class RecetaUpdateDto : RecetaCreateDto
    {
        public int? Id { get; set; }
    }
}
