using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Models;
using Backend.DTOs;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductosController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMemoryCache _cache;
        private const string ProductosCacheKey = "productos_all";

        public ProductosController(ApplicationDbContext context, IMemoryCache cache)
        {
            _context = context;
            _cache = cache;
        }

        private static ProductoResponseDto MapToDto(Producto p) => new(
            p.Id,
            p.Nombre,
            p.Descripcion,
            p.Precio,
            p.CategoriaId,
            p.Categoria?.Nombre,
            p.ImagenUrl,
            p.Disponible
        );

        // GET: api/productos
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductoResponseDto>>> GetProductos()
        {
            if (_cache.TryGetValue(ProductosCacheKey, out List<ProductoResponseDto>? productosCached) && productosCached != null)
            {
                return productosCached;
            }

            var productos = await _context.Productos
                .Include(p => p.Categoria)
                .AsNoTracking()
                .Select(p => MapToDto(p))
                .ToListAsync();

            var cacheEntryOptions = new MemoryCacheEntryOptions()
                .SetSlidingExpiration(TimeSpan.FromMinutes(5))
                .SetAbsoluteExpiration(TimeSpan.FromMinutes(10));

            _cache.Set(ProductosCacheKey, productos, cacheEntryOptions);

            return productos;
        }

        // GET: api/productos/5
        [HttpGet("{id:int}")]
        public async Task<ActionResult<ProductoResponseDto>> GetProducto(int id)
        {
            var producto = await _context.Productos
                .Include(p => p.Categoria)
                .AsNoTracking()
                .FirstOrDefaultAsync(p => p.Id == id);

            if (producto == null)
                return NotFound();

            return MapToDto(producto);
        }

        // POST: api/productos
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<ProductoResponseDto>> PostProducto(CreateProductoDto dto)
        {
            if (dto.CategoriaId.HasValue)
            {
                var categoriaExiste = await _context.Categorias.AnyAsync(c => c.Id == dto.CategoriaId.Value);
                if (!categoriaExiste)
                    return BadRequest(new { message = "La categoría especificada no existe." });
            }

            var producto = new Producto
            {
                Nombre = dto.Nombre.Trim(),
                Descripcion = dto.Descripcion?.Trim(),
                Precio = dto.Precio,
                CategoriaId = dto.CategoriaId,
                ImagenUrl = dto.ImagenUrl,
                Disponible = dto.Disponible
            };

            _context.Productos.Add(producto);
            await _context.SaveChangesAsync();

            _cache.Remove(ProductosCacheKey);

            var createdProducto = await _context.Productos
                .Include(p => p.Categoria)
                .FirstAsync(p => p.Id == producto.Id);

            return CreatedAtAction(nameof(GetProducto), new { id = producto.Id }, MapToDto(createdProducto));
        }

        // PUT: api/productos/5
        [Authorize]
        [HttpPut("{id:int}")]
        public async Task<IActionResult> PutProducto(int id, UpdateProductoDto dto)
        {
            if (id != dto.Id)
                return BadRequest(new { message = "El ID del parámetro no coincide con el cuerpo." });

            var producto = await _context.Productos.FindAsync(id);
            if (producto == null)
                return NotFound();

            if (dto.CategoriaId.HasValue && dto.CategoriaId != producto.CategoriaId)
            {
                var categoriaExiste = await _context.Categorias.AnyAsync(c => c.Id == dto.CategoriaId.Value);
                if (!categoriaExiste)
                    return BadRequest(new { message = "La categoría especificada no existe." });
            }

            producto.Nombre = dto.Nombre.Trim();
            producto.Descripcion = dto.Descripcion?.Trim();
            producto.Precio = dto.Precio;
            producto.CategoriaId = dto.CategoriaId;
            producto.ImagenUrl = dto.ImagenUrl;
            producto.Disponible = dto.Disponible;

            await _context.SaveChangesAsync();
            _cache.Remove(ProductosCacheKey);

            return NoContent();
        }

        // DELETE: api/productos/5
        [Authorize]
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteProducto(int id)
        {
            var producto = await _context.Productos.FindAsync(id);
            if (producto == null)
                return NotFound();

            _context.Productos.Remove(producto);
            await _context.SaveChangesAsync();

            _cache.Remove(ProductosCacheKey);

            return NoContent();
        }
    }
}
