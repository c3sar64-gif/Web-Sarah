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
    public class CategoriasController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMemoryCache _cache;
        private const string CategoriasCacheKey = "categorias_all";

        public CategoriasController(ApplicationDbContext context, IMemoryCache cache)
        {
            _context = context;
            _cache = cache;
        }

        private static CategoriaResponseDto MapToDto(Categoria c) => new(c.Id, c.Nombre, c.Descripcion);

        // GET: api/categorias
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CategoriaResponseDto>>> GetCategorias()
        {
            if (_cache.TryGetValue(CategoriasCacheKey, out List<CategoriaResponseDto>? categoriasCached) && categoriasCached != null)
            {
                return categoriasCached;
            }

            var categorias = await _context.Categorias
                .AsNoTracking()
                .Select(c => MapToDto(c))
                .ToListAsync();

            var cacheOptions = new MemoryCacheEntryOptions()
                .SetSlidingExpiration(TimeSpan.FromMinutes(5))
                .SetAbsoluteExpiration(TimeSpan.FromMinutes(10));

            _cache.Set(CategoriasCacheKey, categorias, cacheOptions);

            return categorias;
        }

        // GET: api/categorias/5
        [HttpGet("{id:int}")]
        public async Task<ActionResult<CategoriaResponseDto>> GetCategoria(int id)
        {
            var categoria = await _context.Categorias.FindAsync(id);

            if (categoria == null)
                return NotFound();

            return MapToDto(categoria);
        }

        // POST: api/categorias
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<CategoriaResponseDto>> PostCategoria(CreateCategoriaDto dto)
        {
            var existeNombre = await _context.Categorias.AnyAsync(c => c.Nombre.ToLower() == dto.Nombre.Trim().ToLower());
            if (existeNombre)
                return BadRequest(new { message = "Ya existe una categoría con ese nombre." });

            var categoria = new Categoria
            {
                Nombre = dto.Nombre.Trim(),
                Descripcion = dto.Descripcion?.Trim()
            };

            _context.Categorias.Add(categoria);
            await _context.SaveChangesAsync();

            _cache.Remove(CategoriasCacheKey);

            return CreatedAtAction(nameof(GetCategoria), new { id = categoria.Id }, MapToDto(categoria));
        }

        // PUT: api/categorias/5
        [Authorize]
        [HttpPut("{id:int}")]
        public async Task<IActionResult> PutCategoria(int id, UpdateCategoriaDto dto)
        {
            if (id != dto.Id)
                return BadRequest(new { message = "El ID del parámetro no coincide con el cuerpo." });

            var categoria = await _context.Categorias.FindAsync(id);
            if (categoria == null)
                return NotFound();

            categoria.Nombre = dto.Nombre.Trim();
            categoria.Descripcion = dto.Descripcion?.Trim();

            await _context.SaveChangesAsync();
            _cache.Remove(CategoriasCacheKey);

            return NoContent();
        }

        // DELETE: api/categorias/5
        [Authorize]
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteCategoria(int id)
        {
            var categoria = await _context.Categorias.FindAsync(id);
            if (categoria == null)
                return NotFound();

            _context.Categorias.Remove(categoria);
            await _context.SaveChangesAsync();

            _cache.Remove(CategoriasCacheKey);

            return NoContent();
        }
    }
}
