using Microsoft.AspNetCore.StaticFiles;

namespace EcommerceMM.Api.Services
{
    public interface IImageService
    {
        Task<string> SaveImageAsync(IFormFile file, string folder = "products");
        Task<bool> DeleteImageAsync(string imagePath);
        bool IsValidImage(IFormFile file);
        string GetImageUrl(string imagePath);
    }

    public class ImageService : IImageService
    {
        private readonly IWebHostEnvironment _environment;
        private readonly IConfiguration _configuration;
        private readonly string[] _allowedExtensions = { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
        private const long MaxFileSize = 5 * 1024 * 1024; // 5MB

        public ImageService(IWebHostEnvironment environment, IConfiguration configuration)
        {
            _environment = environment;
            _configuration = configuration;
        }

        public async Task<string> SaveImageAsync(IFormFile file, string folder = "products")
        {
            if (!IsValidImage(file))
                throw new ArgumentException("Arquivo de imagem inválido");

            // Criar diretório se não existir
            var uploadsPath = Path.Combine(_environment.WebRootPath ?? _environment.ContentRootPath, "uploads", folder);
            Directory.CreateDirectory(uploadsPath);

            // Gerar nome único para o arquivo
            var fileExtension = Path.GetExtension(file.FileName).ToLowerInvariant();
            var fileName = $"{Guid.NewGuid()}{fileExtension}";
            var filePath = Path.Combine(uploadsPath, fileName);

            // Salvar arquivo
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // Retornar o caminho relativo
            return $"/uploads/{folder}/{fileName}";
        }

        public async Task<bool> DeleteImageAsync(string imagePath)
        {
            try
            {
                if (string.IsNullOrEmpty(imagePath))
                    return false;

                // Remover a barra inicial se existir
                var relativePath = imagePath.TrimStart('/');
                var fullPath = Path.Combine(_environment.WebRootPath ?? _environment.ContentRootPath, relativePath);

                if (File.Exists(fullPath))
                {
                    File.Delete(fullPath);
                    return true;
                }

                return false;
            }
            catch
            {
                return false;
            }
        }

        public bool IsValidImage(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return false;

            // Verificar tamanho
            if (file.Length > MaxFileSize)
                return false;

            // Verificar extensão
            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (!_allowedExtensions.Contains(extension))
                return false;

            // Verificar content type
            var provider = new FileExtensionContentTypeProvider();
            if (provider.TryGetContentType(file.FileName, out var contentType))
            {
                return contentType.StartsWith("image/");
            }

            return false;
        }

        public string GetImageUrl(string imagePath)
        {
            if (string.IsNullOrEmpty(imagePath))
                return string.Empty;

            // Se já é uma URL completa, retorna como está
            if (imagePath.StartsWith("http"))
                return imagePath;

            // Se é um caminho local, constrói a URL
            var baseUrl = _configuration["BaseUrl"] ?? "http://localhost:5000";
            return $"{baseUrl.TrimEnd('/')}{imagePath}";
        }
    }
}
