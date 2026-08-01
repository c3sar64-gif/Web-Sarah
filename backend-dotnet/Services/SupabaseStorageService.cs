using Amazon.S3;
using Amazon.S3.Model;

namespace Backend.Services
{
    public class SupabaseStorageService : IStorageService
    {
        private readonly IAmazonS3 _s3;
        private readonly string _bucket;
        private readonly string _publicBaseUrl;

        public SupabaseStorageService(IAmazonS3 s3, IConfiguration configuration)
        {
            _s3 = s3;
            _bucket = configuration["Supabase:S3:Bucket"] ?? "media";
            _publicBaseUrl = configuration["Supabase:PublicUrlBase"]
                ?? throw new InvalidOperationException("Falta configurar Supabase:PublicUrlBase.");
        }

        public async Task<string> SubirImagenAsync(IFormFile archivo, string carpeta)
        {
            var extension = Path.GetExtension(archivo.FileName);
            var key = $"{carpeta}/{Guid.NewGuid()}{extension}";

            using var stream = archivo.OpenReadStream();
            await _s3.PutObjectAsync(new PutObjectRequest
            {
                BucketName = _bucket,
                Key = key,
                InputStream = stream,
                ContentType = archivo.ContentType,
            });

            return $"{_publicBaseUrl}/{_bucket}/{key}";
        }
    }
}
