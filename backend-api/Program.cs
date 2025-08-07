using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using EcommerceMM.Api.Data;
using EcommerceMM.Api.Services;
using Microsoft.AspNetCore.RateLimiting;
using System.Threading.RateLimiting;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Rate Limiting para segurança
builder.Services.AddRateLimiter(options =>
{
    // Rate limit global
    options.GlobalLimiter = PartitionedRateLimiter.Create<HttpContext, string>(httpContext =>
        RateLimitPartition.GetFixedWindowLimiter(
            partitionKey: httpContext.User.Identity?.Name ?? httpContext.Request.Headers.Host.ToString(),
            factory: partition => new FixedWindowRateLimiterOptions
            {
                AutoReplenishment = true,
                PermitLimit = 100,
                Window = TimeSpan.FromMinutes(1)
            }));
    
    // Rate limit específico para autenticação (mais restritivo)
    options.AddPolicy("AuthPolicy", httpContext =>
        RateLimitPartition.GetFixedWindowLimiter(
            partitionKey: httpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown",
            factory: partition => new FixedWindowRateLimiterOptions
            {
                AutoReplenishment = true,
                PermitLimit = 10,
                Window = TimeSpan.FromMinutes(5)
            }));
    
    options.OnRejected = async (context, token) =>
    {
        context.HttpContext.Response.StatusCode = 429;
        await context.HttpContext.Response.WriteAsync("Too many requests. Please try again later.", token);
    };
});

// Entity Framework
builder.Services.AddDbContext<EcommerceDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection") ?? "Data Source=ecommerce.db"));

// JWT Service
builder.Services.AddScoped<IJwtService, JwtService>();

// Image Service
builder.Services.AddScoped<IImageService, ImageService>();

// Authentication
var jwtKey = builder.Configuration["Jwt:SecretKey"] ?? "your-super-secret-key-that-is-at-least-256-bits-long";
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"] ?? "EcommerceMM",
            ValidAudience = builder.Configuration["Jwt:Audience"] ?? "EcommerceMM",
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
            ClockSkew = TimeSpan.Zero
        };
    });

// CORS com configurações mais restritivas para produção
var allowedOrigins = builder.Configuration.GetSection("Security:AllowedOrigins").Get<string[]>() 
    ?? new[] { "http://localhost:3000", "http://localhost:5173" };

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy
            .WithOrigins(allowedOrigins)
            .WithMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
            .WithHeaders("Content-Type", "Authorization", "X-Requested-With")
            .AllowCredentials()
            .WithExposedHeaders("X-Total-Count", "X-Page", "X-Page-Size");
    });
});

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo 
    { 
        Title = "EcommerceMM API", 
        Version = "v1",
        Description = "API para e-commerce de moda feminina"
    });

    // JWT configuration for Swagger
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});

var app = builder.Build();

// Configurar pipeline de produção
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "EcommerceMM API v1");
    });
}
else
{
    // Produção: configurações de segurança
    app.UseHsts();
    app.Use(async (context, next) =>
    {
        context.Response.Headers.Add("X-Content-Type-Options", "nosniff");
        context.Response.Headers.Add("X-Frame-Options", "DENY");
        context.Response.Headers.Add("X-XSS-Protection", "1; mode=block");
        context.Response.Headers.Add("Referrer-Policy", "strict-origin-when-cross-origin");
        await next();
    });
}

// Inicializar banco de dados com configurações de produção
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<EcommerceDbContext>();
    var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
    
    try
    {
        context.Database.EnsureCreated();
        
        // Ativar categoria Roupas se ela existir
        var roupasCategory = context.Categories.FirstOrDefault(c => c.Id == 1);
        if (roupasCategory != null && !roupasCategory.IsActive)
        {
            roupasCategory.IsActive = true;
            context.SaveChanges();
            logger.LogInformation("Categoria Roupas ativada");
        }
        
        logger.LogInformation("Database initialized successfully");
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "Error occurred while initializing database");
        throw;
    }
}

// Para produção local: HTTP apenas (para domínio seria HTTPS)
// app.UseHttpsRedirection();

// Rate limiting
app.UseRateLimiter();

// Servir arquivos estáticos (imagens)
app.UseStaticFiles();

app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
