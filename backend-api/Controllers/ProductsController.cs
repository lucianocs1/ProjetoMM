using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EcommerceMM.Api.Data;
using EcommerceMM.Api.DTOs;
using EcommerceMM.Api.Models;
using EcommerceMM.Api.Services;
using Microsoft.AspNetCore.Authorization;
using System.Globalization;
using System.ComponentModel.DataAnnotations;

namespace EcommerceMM.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly EcommerceDbContext _context;
        private readonly IImageService _imageService;

        public ProductsController(EcommerceDbContext context, IImageService imageService)
        {
            _context = context;
            _imageService = imageService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductDto>>> GetProducts(
            [FromQuery] int? categoryId = null,
            [FromQuery] string search = null,
            [FromQuery] bool? isNew = null,
            [FromQuery] bool? featured = null,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20)
        {
            try
            {
                IQueryable<Product> query = _context.Products
                    .Include(p => p.Category);

                if (categoryId.HasValue)
                    query = query.Where(p => p.CategoryId == categoryId.Value);

                if (!string.IsNullOrEmpty(search))
                    query = query.Where(p => p.Name.Contains(search) || p.Description.Contains(search));

                if (isNew.HasValue)
                {
                    // Filtrar produtos "novos" baseado na data de criação (60 dias)
                    var cutoffDate = DateTime.UtcNow.AddDays(-60);
                    if (isNew.Value)
                        query = query.Where(p => p.CreatedAt >= cutoffDate);
                    else
                        query = query.Where(p => p.CreatedAt < cutoffDate);
                }

                if (featured.HasValue)
                    query = query.Where(p => p.IsFeatured == featured.Value);

                var totalItems = await query.CountAsync();
                var products = await query
                    .OrderByDescending(p => p.CreatedAt)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                var productDtos = products.Select(p => new ProductDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Description = p.Description,
                    Price = p.Price.ToString("F2", CultureInfo.InvariantCulture),
                    OriginalPrice = p.OriginalPrice.HasValue ? p.OriginalPrice.Value.ToString("F2", CultureInfo.InvariantCulture) : null,
                    Image = p.Image,
                    Sizes = p.SizesList,
                    IsNew = (DateTime.UtcNow - p.CreatedAt).TotalDays <= 60, // Automático: novo por 60 dias
                    IsFeatured = p.IsFeatured,
                    Category = p.Category.Name,
                    CategoryId = p.CategoryId,
                    CreatedAt = p.CreatedAt
                }).ToList();

                Response.Headers.Append("X-Total-Count", totalItems.ToString());
                Response.Headers.Append("X-Page", page.ToString());
                Response.Headers.Append("X-Page-Size", pageSize.ToString());

                return Ok(productDtos);
            }
            catch (Exception)
            {
                return StatusCode(500, "Erro interno do servidor");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ProductDto>> GetProduct(int id)
        {
            try
            {
                var product = await _context.Products
                    .Include(p => p.Category)
                    .FirstOrDefaultAsync(p => p.Id == id);

                if (product == null)
                    return NotFound();

                var productDto = new ProductDto
                {
                    Id = product.Id,
                    Name = product.Name,
                    Description = product.Description,
                    Price = product.Price.ToString("F2", CultureInfo.InvariantCulture),
                    OriginalPrice = product.OriginalPrice.HasValue ? product.OriginalPrice.Value.ToString("F2", CultureInfo.InvariantCulture) : null,
                    Image = product.Image,
                    Sizes = product.SizesList,
                    IsNew = (DateTime.UtcNow - product.CreatedAt).TotalDays <= 60, // Automático: novo por 60 dias
                    IsFeatured = product.IsFeatured,
                    Category = product.Category.Name,
                    CategoryId = product.CategoryId,
                    CreatedAt = product.CreatedAt
                };

                return Ok(productDto);
            }
            catch (Exception)
            {
                return StatusCode(500, "Erro interno do servidor");
            }
        }

        [HttpGet("category/{categorySlug}")]
        public async Task<ActionResult<IEnumerable<ProductDto>>> GetProductsByCategory(string categorySlug)
        {
            try
            {
                var category = await _context.Categories
                    .FirstOrDefaultAsync(c => c.Slug == categorySlug && c.IsActive);

                if (category == null)
                    return NotFound();

            // Retornar todos os produtos ativos da categoria, sem paginação
            var products = await _context.Products
                .Include(p => p.Category)
                .Where(p => p.CategoryId == category.Id && p.IsActive)
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();

            // Não filtrar por Sizes/SizesList, garantir que todos ativos sejam retornados

                var productDtos = products.Select(p => new ProductDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Description = p.Description,
                    Price = p.Price.ToString("F2", CultureInfo.InvariantCulture),
                    OriginalPrice = p.OriginalPrice.HasValue ? p.OriginalPrice.Value.ToString("F2", CultureInfo.InvariantCulture) : null,
                    Image = p.Image,
                    Sizes = p.SizesList,
                    IsNew = p.IsNew,
                    IsFeatured = p.IsFeatured,
                    Category = p.Category.Name,
                    CategoryId = p.CategoryId,
                    CreatedAt = p.CreatedAt
                }).ToList();

                return Ok(productDtos);
            }
            catch (Exception)
            {
                return StatusCode(500, "Erro interno do servidor");
            }
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult<ProductDto>> CreateProduct([FromBody] CreateProductDto createProductDto)
        {
            try
            {
                // Debug: Log dos dados recebidos
                Console.WriteLine($"=== DEBUG CREATE PRODUCT ===");
                Console.WriteLine($"Name: {createProductDto.Name}");
                Console.WriteLine($"Description: {createProductDto.Description}");
                Console.WriteLine($"Price: {createProductDto.Price}");
                Console.WriteLine($"CategoryId: {createProductDto.CategoryId}");
                Console.WriteLine($"IsFeatured: {createProductDto.IsFeatured}");
                Console.WriteLine($"Sizes: {string.Join(", ", createProductDto.Sizes)}");
                
                var category = await _context.Categories.FindAsync(createProductDto.CategoryId);
                if (category == null)
                {
                    Console.WriteLine($"❌ Categoria {createProductDto.CategoryId} não encontrada");
                    return BadRequest("Categoria não encontrada");
                }

                var product = new Product
                {
                    Name = createProductDto.Name,
                    Description = createProductDto.Description,
                    Price = createProductDto.Price,
                    OriginalPrice = createProductDto.OriginalPrice,
                    Image = _imageService.GetImageUrl(createProductDto.Image),
                    SizesList = createProductDto.Sizes,
                    IsNew = false, // Campo ignorado - será calculado automaticamente pela lógica dos 60 dias
                    IsFeatured = createProductDto.IsFeatured,
                    CategoryId = createProductDto.CategoryId,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.Products.Add(product);
                await _context.SaveChangesAsync();

                // Recarregar com categoria
                await _context.Entry(product)
                    .Reference(p => p.Category)
                    .LoadAsync();

                var productDto = new ProductDto
                {
                    Id = product.Id,
                    Name = product.Name,
                    Description = product.Description,
                    Price = product.Price.ToString("F2", CultureInfo.InvariantCulture),
                    OriginalPrice = product.OriginalPrice.HasValue ? product.OriginalPrice.Value.ToString("F2", CultureInfo.InvariantCulture) : null,
                    Image = product.Image,
                    Sizes = product.SizesList,
                    IsNew = (DateTime.UtcNow - product.CreatedAt).TotalDays <= 60, // Usar lógica automática dos 60 dias
                    IsFeatured = product.IsFeatured,
                    Category = product.Category.Name,
                    CategoryId = product.CategoryId,
                    CreatedAt = product.CreatedAt
                };

                return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, productDto);
            }
            catch (Exception)
            {
                return StatusCode(500, "Erro interno do servidor");
            }
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateProduct(int id, [FromBody] UpdateProductDto updateProductDto)
        {
            try
            {
                var product = await _context.Products.FindAsync(id);
                if (product == null)
                    return NotFound();

                if (!string.IsNullOrEmpty(updateProductDto.Name))
                    product.Name = updateProductDto.Name;

                if (!string.IsNullOrEmpty(updateProductDto.Description))
                    product.Description = updateProductDto.Description;

                if (updateProductDto.Price.HasValue)
                    product.Price = updateProductDto.Price.Value;

                if (updateProductDto.OriginalPrice.HasValue)
                    product.OriginalPrice = updateProductDto.OriginalPrice.Value;

                if (!string.IsNullOrEmpty(updateProductDto.Image))
                    product.Image = _imageService.GetImageUrl(updateProductDto.Image);

                if (updateProductDto.Sizes != null)
                    product.SizesList = updateProductDto.Sizes;

                if (updateProductDto.IsNew.HasValue)
                    product.IsNew = updateProductDto.IsNew.Value;

                if (updateProductDto.IsFeatured.HasValue)
                    product.IsFeatured = updateProductDto.IsFeatured.Value;

                if (updateProductDto.CategoryId.HasValue)
                {
                    var category = await _context.Categories.FindAsync(updateProductDto.CategoryId.Value);
                    if (category == null)
                        return BadRequest("Categoria não encontrada");
                    product.CategoryId = updateProductDto.CategoryId.Value;
                }

                if (updateProductDto.IsActive.HasValue)
                    product.IsActive = updateProductDto.IsActive.Value;

                product.UpdatedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception)
            {
                return StatusCode(500, "Erro interno do servidor");
            }
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            try
            {
                Console.WriteLine($"=== DEBUG DELETE PRODUCT ===");
                Console.WriteLine($"Tentando excluir produto ID: {id}");
                
                var product = await _context.Products.FindAsync(id);
                if (product == null)
                {
                    Console.WriteLine($"❌ Produto {id} não encontrado");
                    return NotFound();
                }

                Console.WriteLine($"✅ Produto encontrado: {product.Name}");
                
                // Hard delete - remover completamente do banco
                _context.Products.Remove(product);
                await _context.SaveChangesAsync();

                Console.WriteLine($"✅ Produto {id} removido permanentemente do banco de dados");
                return NoContent();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Erro ao excluir produto: {ex.Message}");
                return StatusCode(500, "Erro interno do servidor");
            }
        }
    }
}
