using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Backend.Models
{
    [Table("orden_detalles")]
    public class OrdenDetalle
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public Guid OrdenId { get; set; }

        [JsonIgnore]
        public Orden? Orden { get; set; }

        public int? ProductoId { get; set; }

        [Required]
        [MaxLength(150)]
        public string NombreProducto { get; set; } = string.Empty;

        [Required]
        public int Cantidad { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal PrecioUnitario { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Subtotal { get; set; }
    }
}
