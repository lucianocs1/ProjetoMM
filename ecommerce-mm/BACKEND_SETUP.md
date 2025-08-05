# Backend Setup Guide - E-commerce API

## Estrutura do Projeto Backend

### 1. Criar o Projeto .NET
```bash
# Criar nova pasta para o backend
mkdir ecommerce-backend
cd ecommerce-backend

# Criar API Web
dotnet new webapi -n EcommerceApi
cd EcommerceApi

# Adicionar pacotes necessários
dotnet add package Microsoft.EntityFrameworkCore.Sqlite
dotnet add package Microsoft.EntityFrameworkCore.Design
dotnet add package Microsoft.EntityFrameworkCore.Tools
dotnet add package Swashbuckle.AspNetCore
dotnet add package Microsoft.AspNetCore.Cors
```

### 2. Modelos de Dados (Models)

#### Product.cs
```csharp
using System.ComponentModel.DataAnnotations;

namespace EcommerceApi.Models
{
    public class Product
    {
        public int Id { get; set; }
        
        [Required]
        [StringLength(200)]
        public string Name { get; set; } = string.Empty;
        
        [StringLength(1000)]
        public string Description { get; set; } = string.Empty;
        
        [Required]
        public decimal Price { get; set; }
        
        [StringLength(500)]
        public string ImageUrl { get; set; } = string.Empty;
        
        [Required]
        [StringLength(100)]
        public string Category { get; set; } = string.Empty;
        
        public List<string> Sizes { get; set; } = new();
        
        public List<string> Colors { get; set; } = new();
        
        public bool IsNew { get; set; } = false;
        
        public bool IsOnSale { get; set; } = false;
        
        public decimal? SalePrice { get; set; }
        
        public int Stock { get; set; } = 0;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
```

#### Category.cs
```csharp
using System.ComponentModel.DataAnnotations;

namespace EcommerceApi.Models
{
    public class Category
    {
        public int Id { get; set; }
        
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;
        
        [StringLength(500)]
        public string Description { get; set; } = string.Empty;
        
        [StringLength(200)]
        public string ImageUrl { get; set; } = string.Empty;
        
        public bool IsActive { get; set; } = true;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        // Navigation property
        public virtual ICollection<Product> Products { get; set; } = new List<Product>();
    }
}
```

### 3. DTOs (Data Transfer Objects)

#### ProductDto.cs
```csharp
namespace EcommerceApi.DTOs
{
    public class ProductDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public List<string> Sizes { get; set; } = new();
        public List<string> Colors { get; set; } = new();
        public bool IsNew { get; set; }
        public bool IsOnSale { get; set; }
        public decimal? SalePrice { get; set; }
        public int Stock { get; set; }
    }
    
    public class CreateProductDto
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public List<string> Sizes { get; set; } = new();
        public List<string> Colors { get; set; } = new();
        public bool IsNew { get; set; }
        public bool IsOnSale { get; set; }
        public decimal? SalePrice { get; set; }
        public int Stock { get; set; }
    }
    
    public class UpdateProductDto
    {
        public string? Name { get; set; }
        public string? Description { get; set; }
        public decimal? Price { get; set; }
        public string? ImageUrl { get; set; }
        public string? Category { get; set; }
        public List<string>? Sizes { get; set; }
        public List<string>? Colors { get; set; }
        public bool? IsNew { get; set; }
        public bool? IsOnSale { get; set; }
        public decimal? SalePrice { get; set; }
        public int? Stock { get; set; }
    }
}
```

### 4. DbContext

#### EcommerceDbContext.cs
```csharp
using Microsoft.EntityFrameworkCore;
using EcommerceApi.Models;
using System.Text.Json;

namespace EcommerceApi.Data
{
    public class EcommerceDbContext : DbContext
    {
        public EcommerceDbContext(DbContextOptions<EcommerceDbContext> options) : base(options) { }
        
        public DbSet<Product> Products { get; set; }
        public DbSet<Category> Categories { get; set; }
        
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            // Product configuration
            modelBuilder.Entity<Product>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Price).HasPrecision(18, 2);
                entity.Property(e => e.SalePrice).HasPrecision(18, 2);
                
                // Convert List<string> to JSON for SQLite
                entity.Property(e => e.Sizes)
                    .HasConversion(
                        v => JsonSerializer.Serialize(v, (JsonSerializerOptions?)null),
                        v => JsonSerializer.Deserialize<List<string>>(v, (JsonSerializerOptions?)null) ?? new List<string>()
                    );
                    
                entity.Property(e => e.Colors)
                    .HasConversion(
                        v => JsonSerializer.Serialize(v, (JsonSerializerOptions?)null),
                        v => JsonSerializer.Deserialize<List<string>>(v, (JsonSerializerOptions?)null) ?? new List<string>()
                    );
            });
            
            // Category configuration
            modelBuilder.Entity<Category>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.Name).IsUnique();
            });
            
            // Seed data
            SeedData(modelBuilder);
        }
        
        private void SeedData(ModelBuilder modelBuilder)
        {
            // Seed Categories
            modelBuilder.Entity<Category>().HasData(
                new Category { Id = 1, Name = "Blusas", Description = "Blusas femininas", IsActive = true },
                new Category { Id = 2, Name = "Bolsas", Description = "Bolsas e acessórios", IsActive = true },
                new Category { Id = 3, Name = "Roupas", Description = "Roupas em geral", IsActive = true },
                new Category { Id = 4, Name = "Saia/Calça", Description = "Saias e calças", IsActive = true },
                new Category { Id = 5, Name = "Sapatos", Description = "Calçados femininos", IsActive = true }
            );
            
            // Seed Products (alguns exemplos)
            modelBuilder.Entity<Product>().HasData(
                new Product
                {
                    Id = 1,
                    Name = "Blusa Floral Elegante",
                    Description = "Linda blusa com estampa floral",
                    Price = 89.90m,
                    ImageUrl = "/images/blusa-floral.jpg",
                    Category = "Blusas",
                    IsNew = true,
                    Stock = 10,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                },
                new Product
                {
                    Id = 2,
                    Name = "Bolsa de Couro Premium",
                    Description = "Bolsa de couro legítimo",
                    Price = 199.90m,
                    ImageUrl = "/images/bolsa-couro.jpg",
                    Category = "Bolsas",
                    IsOnSale = true,
                    SalePrice = 149.90m,
                    Stock = 5,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                }
            );
        }
    }
}
```

### 5. Controller

#### ProductsController.cs
```csharp
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EcommerceApi.Data;
using EcommerceApi.Models;
using EcommerceApi.DTOs;

namespace EcommerceApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly EcommerceDbContext _context;
        
        public ProductsController(EcommerceDbContext context)
        {
            _context = context;
        }
        
        // GET: api/products
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductDto>>> GetProducts(
            [FromQuery] string? category = null,
            [FromQuery] string? search = null,
            [FromQuery] decimal? minPrice = null,
            [FromQuery] decimal? maxPrice = null,
            [FromQuery] bool? isNew = null,
            [FromQuery] bool? isOnSale = null)
        {
            var query = _context.Products.AsQueryable();
            
            if (!string.IsNullOrEmpty(category))
                query = query.Where(p => p.Category.ToLower() == category.ToLower());
                
            if (!string.IsNullOrEmpty(search))
                query = query.Where(p => p.Name.Contains(search) || p.Description.Contains(search));
                
            if (minPrice.HasValue)
                query = query.Where(p => p.Price >= minPrice.Value);
                
            if (maxPrice.HasValue)
                query = query.Where(p => p.Price <= maxPrice.Value);
                
            if (isNew.HasValue)
                query = query.Where(p => p.IsNew == isNew.Value);
                
            if (isOnSale.HasValue)
                query = query.Where(p => p.IsOnSale == isOnSale.Value);
            
            var products = await query.ToListAsync();
            
            return Ok(products.Select(p => new ProductDto
            {
                Id = p.Id,
                Name = p.Name,
                Description = p.Description,
                Price = p.Price,
                ImageUrl = p.ImageUrl,
                Category = p.Category,
                Sizes = p.Sizes,
                Colors = p.Colors,
                IsNew = p.IsNew,
                IsOnSale = p.IsOnSale,
                SalePrice = p.SalePrice,
                Stock = p.Stock
            }));
        }
        
        // GET: api/products/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<ProductDto>> GetProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);
            
            if (product == null)
                return NotFound();
                
            return Ok(new ProductDto
            {
                Id = product.Id,
                Name = product.Name,
                Description = product.Description,
                Price = product.Price,
                ImageUrl = product.ImageUrl,
                Category = product.Category,
                Sizes = product.Sizes,
                Colors = product.Colors,
                IsNew = product.IsNew,
                IsOnSale = product.IsOnSale,
                SalePrice = product.SalePrice,
                Stock = product.Stock
            });
        }
        
        // POST: api/products
        [HttpPost]
        public async Task<ActionResult<ProductDto>> CreateProduct(CreateProductDto dto)
        {
            var product = new Product
            {
                Name = dto.Name,
                Description = dto.Description,
                Price = dto.Price,
                ImageUrl = dto.ImageUrl,
                Category = dto.Category,
                Sizes = dto.Sizes,
                Colors = dto.Colors,
                IsNew = dto.IsNew,
                IsOnSale = dto.IsOnSale,
                SalePrice = dto.SalePrice,
                Stock = dto.Stock,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            
            _context.Products.Add(product);
            await _context.SaveChangesAsync();
            
            var productDto = new ProductDto
            {
                Id = product.Id,
                Name = product.Name,
                Description = product.Description,
                Price = product.Price,
                ImageUrl = product.ImageUrl,
                Category = product.Category,
                Sizes = product.Sizes,
                Colors = product.Colors,
                IsNew = product.IsNew,
                IsOnSale = product.IsOnSale,
                SalePrice = product.SalePrice,
                Stock = product.Stock
            };
            
            return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, productDto);
        }
        
        // PUT: api/products/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProduct(int id, UpdateProductDto dto)
        {
            var product = await _context.Products.FindAsync(id);
            
            if (product == null)
                return NotFound();
                
            if (!string.IsNullOrEmpty(dto.Name))
                product.Name = dto.Name;
            if (!string.IsNullOrEmpty(dto.Description))
                product.Description = dto.Description;
            if (dto.Price.HasValue)
                product.Price = dto.Price.Value;
            if (!string.IsNullOrEmpty(dto.ImageUrl))
                product.ImageUrl = dto.ImageUrl;
            if (!string.IsNullOrEmpty(dto.Category))
                product.Category = dto.Category;
            if (dto.Sizes != null)
                product.Sizes = dto.Sizes;
            if (dto.Colors != null)
                product.Colors = dto.Colors;
            if (dto.IsNew.HasValue)
                product.IsNew = dto.IsNew.Value;
            if (dto.IsOnSale.HasValue)
                product.IsOnSale = dto.IsOnSale.Value;
            if (dto.SalePrice.HasValue)
                product.SalePrice = dto.SalePrice.Value;
            if (dto.Stock.HasValue)
                product.Stock = dto.Stock.Value;
                
            product.UpdatedAt = DateTime.UtcNow;
            
            await _context.SaveChangesAsync();
            
            return NoContent();
        }
        
        // DELETE: api/products/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);
            
            if (product == null)
                return NotFound();
                
            _context.Products.Remove(product);
            await _context.SaveChangesAsync();
            
            return NoContent();
        }
        
        // GET: api/products/categories
        [HttpGet("categories")]
        public async Task<ActionResult<IEnumerable<string>>> GetCategories()
        {
            var categories = await _context.Products
                .Select(p => p.Category)
                .Distinct()
                .ToListAsync();
                
            return Ok(categories);
        }
    }
}
```

### 6. Program.cs Configuration

```csharp
using Microsoft.EntityFrameworkCore;
using EcommerceApi.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add Entity Framework
builder.Services.AddDbContext<EcommerceDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", builder =>
    {
        builder.WithOrigins("http://localhost:3000", "http://localhost:5173")
               .AllowAnyMethod()
               .AllowAnyHeader();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowFrontend");

app.UseAuthorization();

app.MapControllers();

// Ensure database is created
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<EcommerceDbContext>();
    context.Database.EnsureCreated();
}

app.Run();
```

### 7. appsettings.json

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=ecommerce.db"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*"
}
```

### 8. Comandos para Executar

```bash
# Restaurar dependências
dotnet restore

# Executar migrations (se necessário)
dotnet ef migrations add InitialCreate
dotnet ef database update

# Executar a API
dotnet run
```

### 9. URLs da API

- API Base: `https://localhost:7001` ou `http://localhost:5001`
- Swagger: `https://localhost:7001/swagger`
- Produtos: `https://localhost:7001/api/products`
- Categorias: `https://localhost:7001/api/products/categories`

### 10. Integração com Frontend

No frontend, você já tem o arquivo `src/services/api.js` configurado. Apenas certifique-se de que a `API_BASE_URL` aponta para a URL correta do backend.

```javascript
// .env no frontend
VITE_API_BASE_URL=https://localhost:7001/api
```

Agora você pode executar ambos os projetos:
- Frontend: `npm run dev` (porta 5173)
- Backend: `dotnet run` (porta 7001)

E eles se comunicarão perfeitamente! 🚀
