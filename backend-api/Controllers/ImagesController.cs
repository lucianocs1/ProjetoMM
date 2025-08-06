using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using EcommerceMM.Api.Services;

namespace EcommerceMM.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ImagesController : ControllerBase
    {
        private readonly IImageService _imageService;

        public ImagesController(IImageService imageService)
        {
            _imageService = imageService;
        }

        [HttpPost("upload")]
        public async Task<ActionResult<object>> UploadImage([FromForm] IFormFile file, [FromForm] string folder = "products")
        {
            try
            {
                if (file == null || file.Length == 0)
                    return BadRequest(new { message = "Nenhum arquivo foi enviado" });

                if (!_imageService.IsValidImage(file))
                    return BadRequest(new { message = "Arquivo deve ser uma imagem válida (JPG, PNG, GIF, WEBP) com até 5MB" });

                var imagePath = await _imageService.SaveImageAsync(file, folder);
                var imageUrl = _imageService.GetImageUrl(imagePath);

                return Ok(new
                {
                    success = true,
                    message = "Imagem enviada com sucesso",
                    imagePath = imagePath,
                    imageUrl = imageUrl,
                    fileName = file.FileName
                });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception)
            {
                return StatusCode(500, new { message = "Erro interno do servidor ao salvar a imagem" });
            }
        }

        [HttpDelete("{*imagePath}")]
        public ActionResult DeleteImage(string imagePath)
        {
            try
            {
                if (string.IsNullOrEmpty(imagePath))
                    return BadRequest(new { message = "Caminho da imagem é obrigatório" });

                // Decodificar o caminho se necessário
                imagePath = Uri.UnescapeDataString(imagePath);

                var deleted = _imageService.DeleteImage(imagePath);

                if (deleted)
                    return Ok(new { message = "Imagem excluída com sucesso" });
                else
                    return NotFound(new { message = "Imagem não encontrada" });
            }
            catch (Exception)
            {
                return StatusCode(500, new { message = "Erro interno do servidor ao excluir a imagem" });
            }
        }

        [HttpGet("validate")]
        public ActionResult ValidateImageUrl([FromQuery] string url)
        {
            try
            {
                if (string.IsNullOrEmpty(url))
                    return BadRequest(new { valid = false, message = "URL é obrigatória" });

                // Verificar se é uma URL externa válida
                if (url.StartsWith("http"))
                {
                    if (Uri.TryCreate(url, UriKind.Absolute, out var uri))
                    {
                        return Ok(new { valid = true, message = "URL externa válida", url = url });
                    }
                    else
                    {
                        return Ok(new { valid = false, message = "URL externa inválida" });
                    }
                }

                // Verificar se é um caminho local
                var imageUrl = _imageService.GetImageUrl(url);
                return Ok(new { valid = true, message = "Caminho local válido", url = imageUrl });
            }
            catch (Exception)
            {
                return StatusCode(500, new { message = "Erro interno do servidor" });
            }
        }
    }
}
