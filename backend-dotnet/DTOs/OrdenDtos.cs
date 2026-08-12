using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs
{
    public class CrearOrdenDetalleDto
    {
        public int? ProductoId { get; set; }

        [Required(ErrorMessage = "El nombre del producto es obligatorio")]
        public string NombreProducto { get; set; } = string.Empty;

        [Range(1, 100, ErrorMessage = "La cantidad debe ser al menos 1")]
        public int Cantidad { get; set; }

        [Range(0.01, 10000.0, ErrorMessage = "El precio debe ser mayor a 0")]
        public decimal PrecioUnitario { get; set; }
    }

    public class CrearOrdenDto
    {
        [Required(ErrorMessage = "El nombre del cliente es obligatorio")]
        public string ClienteNombre { get; set; } = string.Empty;

        [Required(ErrorMessage = "El teléfono celular es obligatorio")]
        public string ClienteTelefono { get; set; } = string.Empty;

        [Required(ErrorMessage = "El correo electrónico es obligatorio")]
        [EmailAddress(ErrorMessage = "Formato de correo no válido")]
        public string ClienteEmail { get; set; } = string.Empty;

        [Required(ErrorMessage = "La zona de Cochabamba es obligatoria")]
        public string Zona { get; set; } = string.Empty;

        [Required(ErrorMessage = "La dirección de entrega es obligatoria")]
        public string Direccion { get; set; } = string.Empty;

        public string? Referencias { get; set; }

        public double? Lat { get; set; }

        public double? Lng { get; set; }

        [Required(ErrorMessage = "La fecha de entrega es obligatoria")]
        public DateTime FechaEntrega { get; set; }

        [Required(ErrorMessage = "El horario de entrega es obligatorio")]
        public string HoraEntrega { get; set; } = string.Empty;

        [Required(ErrorMessage = "Debe haber al menos un ítem en el pedido")]
        public List<CrearOrdenDetalleDto> Detalles { get; set; } = new List<CrearOrdenDetalleDto>();
    }

    public class ConfirmarPagoDto
    {
        public string? NumeroTransaccion { get; set; }
        public string? ComprobanteUrl { get; set; }
    }

    public class CambiarEstadoDto
    {
        [Required(ErrorMessage = "El estado es obligatorio")]
        public string Estado { get; set; } = string.Empty;
    }
}
