using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Backend.Services;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/uploads")]
    [Authorize]
    public class UploadsController : ControllerBase
    {
        private static readonly string[] TiposPermitidos = { "image/jpeg", "image/png", "image/webp" };
        private const long TamanoMaximoBytes = 5 * 1024 * 1024;

        private readonly IStorageService _storageService;

        public UploadsController(IStorageService storageService)
        {
            _storageService = storageService;
        }

        public record UploadResponse(string Url);

        [HttpPost("imagen")]
        public async Task<ActionResult<UploadResponse>> SubirImagen([FromForm] IFormFile archivo)
        {
            if (archivo == null || archivo.Length == 0)
                return BadRequest(new { message = "No se recibió ningún archivo." });

            if (!TiposPermitidos.Contains(archivo.ContentType))
                return StatusCode(415, new { message = "Formato no soportado. Usá JPG, PNG o WEBP." });

            if (archivo.Length > TamanoMaximoBytes)
                return StatusCode(413, new { message = "La imagen no puede pesar más de 5MB." });

            try
            {
                var url = await _storageService.SubirImagenAsync(archivo, "fotos/productos");
                return new UploadResponse(url);
            }
            catch (Exception)
            {
                return StatusCode(502, new { message = "No se pudo subir la imagen. Probá de nuevo." });
            }
        }
    }
}
