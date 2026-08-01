namespace Backend.Services
{
    public interface IStorageService
    {
        Task<string> SubirImagenAsync(IFormFile archivo, string carpeta);
    }
}
