using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    [Table("ordenes")]
    public class Orden
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [MaxLength(30)]
        public string CodigoOrden { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string ClienteNombre { get; set; } = string.Empty;

        [Required]
        [MaxLength(30)]
        public string ClienteTelefono { get; set; } = string.Empty;

        [Required]
        [MaxLength(120)]
        public string ClienteEmail { get; set; } = string.Empty;

        [Required]
        [MaxLength(80)]
        public string Zona { get; set; } = string.Empty;

        [Required]
        public string Direccion { get; set; } = string.Empty;

        public string? Referencias { get; set; }

        public double? Lat { get; set; }

        public double? Lng { get; set; }

        [Required]
        public DateTime FechaEntrega { get; set; }

        [Required]
        [MaxLength(50)]
        public string HoraEntrega { get; set; } = string.Empty;

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal MontoTotal { get; set; }

        [Required]
        [MaxLength(40)]
        public string Estado { get; set; } = "PendientePago"; // PendientePago, Pagado, EnPreparacion, Entregado, Cancelado

        public string? NumeroTransaccion { get; set; }

        public string? ComprobanteUrl { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public List<OrdenDetalle> Detalles { get; set; } = new List<OrdenDetalle>();
    }
}
