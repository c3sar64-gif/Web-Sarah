using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.Data;
using Backend.DTOs;
using Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdenesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public OrdenesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Genera un código de orden único legible (Ej: SRH-2026-8492)
        private string GenerarCodigoOrden()
        {
            var random = new Random();
            var numero = random.Next(1000, 9999);
            return $"SRH-{DateTime.UtcNow.Year}-{numero}";
        }

        // POST: api/ordenes (Crear nuevo pedido desde Checkout)
        [HttpPost]
        public async Task<ActionResult<Orden>> CrearOrden([FromBody] CrearOrdenDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (dto.Detalles == null || dto.Detalles.Count == 0)
            {
                return BadRequest(new { mensaje = "El pedido debe contener al menos un producto." });
            }

            // Genera código único libre de colisiones
            string codigoOrden;
            do
            {
                codigoOrden = GenerarCodigoOrden();
            } while (await _context.Ordenes.AnyAsync(o => o.CodigoOrden == codigoOrden));

            // Calcula subtotal de ítems
            decimal total = 0;
            var detallesList = new List<OrdenDetalle>();

            foreach (var d in dto.Detalles)
            {
                var subtotal = d.Cantidad * d.PrecioUnitario;
                total += subtotal;

                detallesList.Add(new OrdenDetalle
                {
                    ProductoId = d.ProductoId,
                    NombreProducto = d.NombreProducto,
                    Cantidad = d.Cantidad,
                    PrecioUnitario = d.PrecioUnitario,
                    Subtotal = subtotal
                });
            }

            var orden = new Orden
            {
                Id = Guid.NewGuid(),
                CodigoOrden = codigoOrden,
                ClienteNombre = dto.ClienteNombre.Trim(),
                ClienteTelefono = dto.ClienteTelefono.Trim(),
                ClienteEmail = dto.ClienteEmail.Trim().ToLower(),
                Zona = dto.Zona.Trim(),
                Direccion = dto.Direccion.Trim(),
                Referencias = dto.Referencias?.Trim(),
                Lat = dto.Lat,
                Lng = dto.Lng,
                FechaEntrega = DateTime.SpecifyKind(dto.FechaEntrega, DateTimeKind.Utc),
                HoraEntrega = dto.HoraEntrega.Trim(),
                MontoTotal = total,
                Estado = "PendientePago",
                CreatedAt = DateTime.UtcNow,
                Detalles = detallesList
            };

            _context.Ordenes.Add(orden);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetOrdenPorId), new { id = orden.Id }, orden);
        }

        // GET: api/ordenes/{id}
        [HttpGet("{id:guid}")]
        public async Task<ActionResult<Orden>> GetOrdenPorId(Guid id)
        {
            var orden = await _context.Ordenes
                .Include(o => o.Detalles)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (orden == null)
            {
                return NotFound(new { mensaje = "Orden de pedido no encontrada." });
            }

            return Ok(orden);
        }

        // GET: api/ordenes/codigo/{codigo}
        [HttpGet("codigo/{codigo}")]
        public async Task<ActionResult<Orden>> GetOrdenPorCodigo(string codigo)
        {
            var orden = await _context.Ordenes
                .Include(o => o.Detalles)
                .FirstOrDefaultAsync(o => o.CodigoOrden == codigo.ToUpper());

            if (orden == null)
            {
                return NotFound(new { mensaje = "Código de orden no encontrado." });
            }

            return Ok(orden);
        }

        // POST: api/ordenes/{id}/confirmar-pago
        [HttpPost("{id:guid}/confirmar-pago")]
        public async Task<IActionResult> ConfirmarPago(Guid id, [FromBody] ConfirmarPagoDto dto)
        {
            var orden = await _context.Ordenes.FindAsync(id);
            if (orden == null)
            {
                return NotFound(new { mensaje = "Orden de pedido no encontrada." });
            }

            orden.Estado = "Pagado";
            if (!string.IsNullOrWhiteSpace(dto.NumeroTransaccion))
            {
                orden.NumeroTransaccion = dto.NumeroTransaccion.Trim();
            }
            if (!string.IsNullOrWhiteSpace(dto.ComprobanteUrl))
            {
                orden.ComprobanteUrl = dto.ComprobanteUrl.Trim();
            }

            await _context.SaveChangesAsync();

            return Ok(new { mensaje = "Pago de la orden confirmado exitosamente.", orden });
        }

        // GET: api/ordenes (Panel de Administración)
        [HttpGet]
        [Authorize]
        public async Task<ActionResult<IEnumerable<Orden>>> ListarOrdenes()
        {
            var ordenes = await _context.Ordenes
                .Include(o => o.Detalles)
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync();

            return Ok(ordenes);
        }

        // PUT: api/ordenes/{id}/estado (Cambio de estado desde el Panel Admin)
        [HttpPut("{id:guid}/estado")]
        [Authorize]
        public async Task<IActionResult> CambiarEstado(Guid id, [FromBody] CambiarEstadoDto dto)
        {
            var orden = await _context.Ordenes
                .Include(o => o.Detalles)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (orden == null)
            {
                return NotFound(new { mensaje = "Orden no encontrada." });
            }

            orden.Estado = dto.Estado.Trim();
            await _context.SaveChangesAsync();

            return Ok(new { mensaje = "Estado de la orden actualizado exitosamente.", orden });
        }
    }
}
