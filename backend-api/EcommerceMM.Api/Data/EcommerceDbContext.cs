using Microsoft.EntityFrameworkCore;
using EcommerceMM.Api.Models;

namespace EcommerceMM.Api.Data
{
    public class EcommerceDbContext : DbContext
    {
        public EcommerceDbContext(DbContextOptions<EcommerceDbContext> options) : base(options)
        {
        }

        public DbSet<Product> Products { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Admin> Admins { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configurações do Product
            modelBuilder.Entity<Product>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
                entity.Property(e => e.Price).HasColumnType("decimal(10,2)");
                entity.Property(e => e.OriginalPrice).HasColumnType("decimal(10,2)");
                entity.Property(e => e.Sizes).HasDefaultValue("[]");
                
                entity.HasOne(e => e.Category)
                      .WithMany(c => c.Products)
                      .HasForeignKey(e => e.CategoryId)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasIndex(e => e.Name);
                entity.HasIndex(e => e.CategoryId);
                entity.HasIndex(e => e.IsActive);
            });

            // Configurações da Category
            modelBuilder.Entity<Category>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Slug).IsRequired().HasMaxLength(50);
                
                entity.HasIndex(e => e.Slug).IsUnique();
                entity.HasIndex(e => e.IsActive);
            });

            // Configurações do Admin
            modelBuilder.Entity<Admin>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Username).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Email).IsRequired().HasMaxLength(200);
                entity.Property(e => e.PasswordHash).IsRequired();
                
                entity.HasIndex(e => e.Username).IsUnique();
                entity.HasIndex(e => e.Email).IsUnique();
            });

            // Dados iniciais
            SeedData(modelBuilder);
        }

        private void SeedData(ModelBuilder modelBuilder)
        {
            // Categorias iniciais
            modelBuilder.Entity<Category>().HasData(
                new Category { Id = 1, Name = "Roupas", Description = "Roupas femininas", Slug = "roupas", IsActive = true },
                new Category { Id = 2, Name = "Blusas", Description = "Blusas e tops", Slug = "blusas", IsActive = true },
                new Category { Id = 3, Name = "Bolsas", Description = "Bolsas e acessórios", Slug = "bolsas", IsActive = true },
                new Category { Id = 4, Name = "Sapatos", Description = "Calçados femininos", Slug = "sapatos", IsActive = true },
                new Category { Id = 5, Name = "Saias e Calças", Description = "Saias e calças", Slug = "saia-calca", IsActive = true }
            );

            // Admin padrão
            var passwordHash = BCrypt.Net.BCrypt.HashPassword("admin123");
            modelBuilder.Entity<Admin>().HasData(
                new Admin
                {
                    Id = 1,
                    Username = "admin",
                    Email = "admin@ecommercemm.com",
                    PasswordHash = passwordHash,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                }
            );

            // Produtos de exemplo
            modelBuilder.Entity<Product>().HasData(
                new Product
                {
                    Id = 1,
                    Name = "Vestido Floral Midi",
                    Description = "Vestido midi com estampa floral delicada, perfeito para o verão",
                    Price = 89.90m,
                    OriginalPrice = 119.90m,
                    Image = "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=300&h=300&fit=crop&crop=center",
                    Sizes = "[\"P\", \"M\", \"G\", \"GG\"]",
                    IsNew = true,
                    CategoryId = 1,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                },
                new Product
                {
                    Id = 2,
                    Name = "Blusa Básica Cotton",
                    Description = "Blusa básica em algodão, confortável para o dia a dia",
                    Price = 49.90m,
                    Image = "https://images.unsplash.com/photo-1564557287817-3785e38ec1f5?w=300&h=300&fit=crop&crop=center",
                    Sizes = "[\"P\", \"M\", \"G\"]",
                    IsNew = false,
                    CategoryId = 2,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                },
                new Product
                {
                    Id = 3,
                    Name = "Bolsa Tote Grande",
                    Description = "Bolsa tote espaçosa em couro sintético, ideal para o dia a dia",
                    Price = 159.90m,
                    OriginalPrice = 199.90m,
                    Image = "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop&crop=center",
                    Sizes = "[\"Único\"]",
                    IsNew = true,
                    CategoryId = 3,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                }
            );
        }
    }
}
