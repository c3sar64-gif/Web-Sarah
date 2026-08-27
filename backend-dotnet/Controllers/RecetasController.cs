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
    public class RecetasController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMemoryCache _cache;
        private const string RecetasPublicCacheKey = "recetas_public_all";

        public RecetasController(ApplicationDbContext context, IMemoryCache cache)
        {
            _context = context;
            _cache = cache;
        }

        private static RecetaDto MapToDto(Receta r) => new()
        {
            Id = r.Id,
            Titulo = r.Titulo,
            Descripcion = r.Descripcion,
            Ingredientes = r.Ingredientes,
            Instrucciones = r.Instrucciones,
            TiempoPreparacionMinutos = r.TiempoPreparacionMinutos,
            Porciones = r.Porciones,
            Dificultad = r.Dificultad,
            ImagenUrl = r.ImagenUrl,
            VideoUrl = r.VideoUrl,
            YoutubeUrl = r.YoutubeUrl,
            Publicada = r.Publicada,
            Destacada = r.Destacada,
            CreatedAt = r.CreatedAt,
            UpdatedAt = r.UpdatedAt
        };

        // GET: api/recetas
        [HttpGet]
        public async Task<ActionResult<IEnumerable<RecetaDto>>> GetRecetas([FromQuery] bool? todas = false)
        {
            if (todas != true && _cache.TryGetValue(RecetasPublicCacheKey, out List<RecetaDto>? cached) && cached != null)
            {
                return cached;
            }

            var query = _context.Recetas.AsNoTracking().AsQueryable();

            if (todas != true)
            {
                query = query.Where(r => r.Publicada);
            }

            var recetas = await query
                .OrderByDescending(r => r.Destacada)
                .ThenByDescending(r => r.CreatedAt)
                .Select(r => MapToDto(r))
                .ToListAsync();

            if (todas != true)
            {
                var cacheEntryOptions = new MemoryCacheEntryOptions()
                    .SetSlidingExpiration(TimeSpan.FromMinutes(5))
                    .SetAbsoluteExpiration(TimeSpan.FromMinutes(10));

                _cache.Set(RecetasPublicCacheKey, recetas, cacheEntryOptions);
            }

            return recetas;
        }

        // GET: api/recetas/5
        [HttpGet("{id:int}")]
        public async Task<ActionResult<RecetaDto>> GetReceta(int id)
        {
            var receta = await _context.Recetas
                .AsNoTracking()
                .FirstOrDefaultAsync(r => r.Id == id);

            if (receta == null)
                return NotFound(new { message = "La receta no existe." });

            return MapToDto(receta);
        }

        // POST: api/recetas
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<RecetaDto>> PostReceta(RecetaCreateDto dto)
        {
            try
            {
                var receta = new Receta
                {
                    Titulo = dto.Titulo.Trim(),
                    Descripcion = string.IsNullOrWhiteSpace(dto.Descripcion) ? null : dto.Descripcion.Trim(),
                    Ingredientes = dto.Ingredientes.Trim(),
                    Instrucciones = dto.Instrucciones.Trim(),
                    TiempoPreparacionMinutos = dto.TiempoPreparacionMinutos,
                    Porciones = dto.Porciones,
                    Dificultad = string.IsNullOrWhiteSpace(dto.Dificultad) ? "Fácil" : dto.Dificultad.Trim(),
                    ImagenUrl = string.IsNullOrWhiteSpace(dto.ImagenUrl) ? null : dto.ImagenUrl.Trim(),
                    VideoUrl = string.IsNullOrWhiteSpace(dto.VideoUrl) ? null : dto.VideoUrl.Trim(),
                    YoutubeUrl = string.IsNullOrWhiteSpace(dto.YoutubeUrl) ? null : dto.YoutubeUrl.Trim(),
                    Publicada = dto.Publicada,
                    Destacada = dto.Destacada,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.Recetas.Add(receta);
                await _context.SaveChangesAsync();

                _cache.Remove(RecetasPublicCacheKey);

                return CreatedAtAction(nameof(GetReceta), new { id = receta.Id }, MapToDto(receta));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error al crear la receta: " + ex.Message });
            }
        }

        // PUT: api/recetas/5
        [Authorize]
        [HttpPut("{id:int}")]
        public async Task<ActionResult<RecetaDto>> PutReceta(int id, RecetaUpdateDto dto)
        {
            try
            {
                var receta = await _context.Recetas.FindAsync(id);
                if (receta == null)
                    return NotFound(new { message = $"La receta con ID {id} no existe." });

                receta.Titulo = dto.Titulo.Trim();
                receta.Descripcion = string.IsNullOrWhiteSpace(dto.Descripcion) ? null : dto.Descripcion.Trim();
                receta.Ingredientes = dto.Ingredientes.Trim();
                receta.Instrucciones = dto.Instrucciones.Trim();
                receta.TiempoPreparacionMinutos = dto.TiempoPreparacionMinutos;
                receta.Porciones = dto.Porciones;
                receta.Dificultad = string.IsNullOrWhiteSpace(dto.Dificultad) ? "Fácil" : dto.Dificultad.Trim();
                receta.ImagenUrl = string.IsNullOrWhiteSpace(dto.ImagenUrl) ? null : dto.ImagenUrl.Trim();
                receta.VideoUrl = string.IsNullOrWhiteSpace(dto.VideoUrl) ? null : dto.VideoUrl.Trim();
                receta.YoutubeUrl = string.IsNullOrWhiteSpace(dto.YoutubeUrl) ? null : dto.YoutubeUrl.Trim();
                receta.Publicada = dto.Publicada;
                receta.Destacada = dto.Destacada;
                receta.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();
                _cache.Remove(RecetasPublicCacheKey);

                return Ok(MapToDto(receta));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error al actualizar la receta: " + ex.Message });
            }
        }

        // DELETE: api/recetas/5
        [Authorize]
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteReceta(int id)
        {
            try
            {
                var receta = await _context.Recetas.FindAsync(id);
                if (receta == null)
                    return NotFound(new { message = "La receta no existe." });

                _context.Recetas.Remove(receta);
                await _context.SaveChangesAsync();

                _cache.Remove(RecetasPublicCacheKey);

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error al eliminar la receta: " + ex.Message });
            }
        }
    }
}
