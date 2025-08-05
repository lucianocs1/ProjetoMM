# 🔌 Guia de Integração Backend .NET Core

## 🏗️ **Estrutura da Integração**

```
Frontend (React)  ←→  Backend (.NET Core 8)  ←→  Database (SQLite)
    ↓                       ↓                         ↓
localhost:5173         localhost:5000              data/products.db
```

## 📡 **Endpoints Esperados**

### **🔐 Autenticação**
```csharp
[Route("api/auth")]
public class AuthController : ControllerBase
{
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        // Validar credenciais
        if (dto.Username == "admin" && dto.Password == "admin123") 
        {
            var token = _jwtService.GenerateToken(dto.Username);
            return Ok(new { success = true, data = new { token } });
        }
        return Unauthorized(new { success = false, message = "Credenciais inválidas" });
    }
}
```

### **📦 Produtos**
```csharp
[Route("api/products")]
[Authorize]
public class ProductsController : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetProducts(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string search = null,
        [FromQuery] string categoria = null)
    {
        var result = await _productService.GetProductsAsync(page, pageSize, search, categoria);
        return Ok(new { success = true, data = result });
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetProduct(int id)
    {
        var product = await _productService.GetByIdAsync(id);
        if (product == null)
            return NotFound(new { success = false, message = "Produto não encontrado" });
        
        return Ok(new { success = true, data = product });
    }

    [HttpPost]
    public async Task<IActionResult> CreateProduct([FromForm] CreateProductDto dto)
    {
        var product = await _productService.CreateAsync(dto);
        return Ok(new { success = true, data = product });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateProduct(int id, [FromForm] UpdateProductDto dto)
    {
        var product = await _productService.UpdateAsync(id, dto);
        if (product == null)
            return NotFound(new { success = false, message = "Produto não encontrado" });
        
        return Ok(new { success = true, data = product });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteProduct(int id)
    {
        var success = await _productService.DeleteAsync(id);
        if (!success)
            return NotFound(new { success = false, message = "Produto não encontrado" });
        
        return Ok(new { success = true, message = "Produto excluído com sucesso" });
    }

    [HttpGet("dashboard")]
    public async Task<IActionResult> GetDashboard()
    {
        var stats = await _productService.GetDashboardStatsAsync();
        return Ok(new { success = true, data = stats });
    }
}
```

## 🗃️ **Modelos de Dados**

### **DTOs (Data Transfer Objects):**
```csharp
public class LoginDto
{
    public string Username { get; set; }
    public string Password { get; set; }
}

public class CreateProductDto
{
    public string Nome { get; set; }
    public string Descricao { get; set; }
    public decimal Preco { get; set; }
    public decimal? PrecoPromocional { get; set; }
    public string Categoria { get; set; }
    public string Promocoes { get; set; }
    public List<string> Tags { get; set; } = new();
    public List<string> Tamanhos { get; set; } = new();
    public List<IFormFile> Imagens { get; set; } = new();
}

public class ProductDto
{
    public int Id { get; set; }
    public string Nome { get; set; }
    public string Descricao { get; set; }
    public decimal Preco { get; set; }
    public decimal? PrecoPromocional { get; set; }
    public string Categoria { get; set; }
    public string Promocoes { get; set; }
    public List<string> Tags { get; set; } = new();
    public List<string> Tamanhos { get; set; } = new();
    public List<string> Imagens { get; set; } = new();
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class DashboardDto
{
    public int Total { get; set; }
    public int Categories { get; set; }
    public decimal TotalValue { get; set; }
}
```

## 📦 **Configuração Backend**

### **Program.cs:**
```csharp
var builder = WebApplication.CreateBuilder(args);

// Database
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// CORS para React
builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// JWT Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:SecretKey"]))
        };
    });

// Services
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<IJwtService, JwtService>();

// Controllers
builder.Services.AddControllers();

var app = builder.Build();

// Middleware
app.UseCors("ReactApp");
app.UseAuthentication();
app.UseAuthorization();
app.UseStaticFiles(); // Para servir imagens

app.MapControllers();
app.Run();
```

### **appsettings.json:**
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=data/products.db"
  },
  "Jwt": {
    "SecretKey": "sua-chave-secreta-aqui-deve-ser-complexa",
    "Issuer": "EcommerceAdmin",
    "Audience": "AdminPanel",
    "ExpiryInHours": 24
  },
  "Upload": {
    "MaxFileSize": 5242880,
    "AllowedTypes": ["image/jpeg", "image/png", "image/gif", "image/webp"],
    "Path": "wwwroot/uploads/products"
  }
}
```

## 🔄 **Migração de localStorage para API**

### **No Frontend:**

**Antes (localStorage):**
```javascript
const products = JSON.parse(localStorage.getItem('admin_products') || '[]');
```

**Depois (API):**
```javascript
import { productService } from './services/productService';

const products = await productService.getProducts({
  page: 1,
  pageSize: 10,
  search: searchTerm
});
```

### **Sistema de Fallback:**
```javascript
// productService.js já implementa fallback automático
try {
  // Tenta usar API
  const response = await fetch('/api/products');
  return await response.json();
} catch (error) {
  // Se API falhar, usa localStorage
  console.warn('API indisponível, usando localStorage');
  return getProductsFromLocalStorage();
}
```

## 📸 **Upload de Imagens**

### **Backend (.NET):**
```csharp
[HttpPost("upload")]
public async Task<IActionResult> UploadImages(List<IFormFile> files)
{
    var uploadedFiles = new List<string>();
    
    foreach (var file in files)
    {
        if (file.Length > 0)
        {
            var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
            var filePath = Path.Combine("wwwroot/uploads/products", fileName);
            
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }
            
            uploadedFiles.Add($"/uploads/products/{fileName}");
        }
    }
    
    return Ok(new { success = true, data = uploadedFiles });
}
```

### **Frontend (React):**
```javascript
// O productService já trata upload via FormData
const formData = new FormData();
files.forEach(file => formData.append('imagens', file));

const result = await productService.createProduct(formData);
```

## 🔒 **Autenticação JWT**

### **Backend:**
```csharp
public class JwtService : IJwtService
{
    public string GenerateToken(string username)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(_secretKey);
        
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[] { new Claim("username", username) }),
            Expires = DateTime.UtcNow.AddHours(24),
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), 
                SecurityAlgorithms.HmacSha256Signature)
        };
        
        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }
}
```

### **Frontend:**
```javascript
// authService.js já implementa automaticamente
const token = localStorage.getItem('admin_token');
headers.Authorization = `Bearer ${token}`;
```

## 🚀 **Deploy Conjunto**

### **Estrutura Recomendada:**
```
EcommerceProject/
├── 📁 Backend/              ← API .NET Core
│   ├── Controllers/
│   ├── Models/
│   ├── Services/
│   └── wwwroot/
│       └── admin/           ← Frontend React (build)
└── 📁 Frontend/             ← Código fonte React
    └── dist/                ← Build para copiar
```

### **Script de Build Integrado:**
```bash
# build-all.bat
echo "Building Frontend..."
cd Frontend
npm run build:production
xcopy /E /Y dist\* ..\Backend\wwwroot\admin\

echo "Building Backend..."
cd ..\Backend
dotnet publish -c Release -o ./publish

echo "Build completo! Backend e Frontend integrados."
```

---

**✅ Integração completa entre React e .NET Core configurada!**
