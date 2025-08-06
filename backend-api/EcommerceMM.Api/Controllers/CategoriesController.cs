using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EcommerceMM.Api.Data;
using EcommerceMM.Api.DTOs;
using EcommerceMM.Api.Models;
using Microsoft.AspNetCore.Authorization;

namespace EcommerceMM.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoriesController : ControllerBase
    {
        private readonly EcommerceDbContext _context;

        public CategoriesController(EcommerceDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CategoryDto>>> GetCategories()
        {
            try
            {
                var categories = await _context.Categories
                    .Where(c => c.IsActive)
                    .Select(c => new CategoryDto
                    {
                        Id = c.Id,
                        Name = c.Name,
                        Description = c.Description,
                        Slug = c.Slug,
                        ProductCount = c.Products.Count(p => p.IsActive)
                    })
                    .OrderBy(c => c.Name)
                    .ToListAsync();

                return Ok(categories);
            }
            catch (Exception)
            {
                return StatusCode(500, "Erro interno do servidor");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CategoryDto>> GetCategory(int id)
        {
            try
            {
                var category = await _context.Categories
                    .Where(c => c.Id == id && c.IsActive)
                    .Select(c => new CategoryDto
                    {
                        Id = c.Id,
                        Name = c.Name,
                        Description = c.Description,
                        Slug = c.Slug,
                        ProductCount = c.Products.Count(p => p.IsActive)
                    })
                    .FirstOrDefaultAsync();

                if (category == null)
                    return NotFound();

                return Ok(category);
            }
            catch (Exception)
            {
                return StatusCode(500, "Erro interno do servidor");
            }
        }

        [HttpGet("slug/{slug}")]
        public async Task<ActionResult<CategoryDto>> GetCategoryBySlug(string slug)
        {
            try
            {
                var category = await _context.Categories
                    .Where(c => c.Slug == slug && c.IsActive)
                    .Select(c => new CategoryDto
                    {
                        Id = c.Id,
                        Name = c.Name,
                        Description = c.Description,
                        Slug = c.Slug,
                        ProductCount = c.Products.Count(p => p.IsActive)
                    })
                    .FirstOrDefaultAsync();

                if (category == null)
                    return NotFound();

                return Ok(category);
            }
            catch (Exception)
            {
                return StatusCode(500, "Erro interno do servidor");
            }
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult<CategoryDto>> CreateCategory([FromBody] CreateCategoryDto createCategoryDto)
        {
            try
            {
                // Verificar se o slug já existe
                var existingCategory = await _context.Categories
                    .AnyAsync(c => c.Slug == createCategoryDto.Slug);

                if (existingCategory)
                    return BadRequest("Já existe uma categoria com este slug");

                var category = new Category
                {
                    Name = createCategoryDto.Name,
                    Description = createCategoryDto.Description,
                    Slug = createCategoryDto.Slug,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                };

                _context.Categories.Add(category);
                await _context.SaveChangesAsync();

                var categoryDto = new CategoryDto
                {
                    Id = category.Id,
                    Name = category.Name,
                    Description = category.Description,
                    Slug = category.Slug,
                    ProductCount = 0
                };

                return CreatedAtAction(nameof(GetCategory), new { id = category.Id }, categoryDto);
            }
            catch (Exception)
            {
                return StatusCode(500, "Erro interno do servidor");
            }
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateCategory(int id, [FromBody] UpdateCategoryDto updateCategoryDto)
        {
            try
            {
                var category = await _context.Categories.FindAsync(id);
                if (category == null)
                    return NotFound();

                if (!string.IsNullOrEmpty(updateCategoryDto.Name))
                    category.Name = updateCategoryDto.Name;

                if (!string.IsNullOrEmpty(updateCategoryDto.Description))
                    category.Description = updateCategoryDto.Description;

                if (!string.IsNullOrEmpty(updateCategoryDto.Slug))
                {
                    // Verificar se o novo slug já existe
                    var existingCategory = await _context.Categories
                        .AnyAsync(c => c.Slug == updateCategoryDto.Slug && c.Id != id);

                    if (existingCategory)
                        return BadRequest("Já existe uma categoria com este slug");

                    category.Slug = updateCategoryDto.Slug;
                }

                if (updateCategoryDto.IsActive.HasValue)
                    category.IsActive = updateCategoryDto.IsActive.Value;

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
        public async Task<IActionResult> DeleteCategory(int id)
        {
            try
            {
                var category = await _context.Categories
                    .Include(c => c.Products)
                    .FirstOrDefaultAsync(c => c.Id == id);

                if (category == null)
                    return NotFound();

                // Verificar se há produtos ativos nesta categoria
                var hasActiveProducts = category.Products.Any(p => p.IsActive);
                if (hasActiveProducts)
                    return BadRequest("Não é possível excluir categoria com produtos ativos");

                // Soft delete
                category.IsActive = false;
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception)
            {
                return StatusCode(500, "Erro interno do servidor");
            }
        }

        // Endpoint temporário para ativar categoria
        [HttpPost("activate/{id}")]
        public async Task<IActionResult> ActivateCategory(int id)
        {
            try
            {
                var category = await _context.Categories.FindAsync(id);
                if (category == null)
                    return NotFound();

                category.IsActive = true;
                await _context.SaveChangesAsync();

                return Ok(new { message = "Categoria ativada com sucesso" });
            }
            catch (Exception)
            {
                return StatusCode(500, "Erro interno do servidor");
            }
        }
    }
}
