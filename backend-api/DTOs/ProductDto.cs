namespace EcommerceMM.Api.DTOs
{
    public class ProductDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Price { get; set; } = string.Empty; // Formatted as string for frontend
        public string OriginalPrice { get; set; }
        public string Image { get; set; } = string.Empty;
        public List<string> Sizes { get; set; } = new List<string>();
        public bool IsNew { get; set; }
        public bool IsFeatured { get; set; } // Campo para produtos em destaque
        public string Category { get; set; } = string.Empty;
        public int CategoryId { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class CreateProductDto
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public decimal? OriginalPrice { get; set; }
        public string Image { get; set; } = string.Empty;
        public List<string> Sizes { get; set; } = new List<string>();
        public bool IsNew { get; set; }
        public bool IsFeatured { get; set; } = false; // Campo para produtos em destaque
        public int CategoryId { get; set; }
    }

    public class UpdateProductDto
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal? Price { get; set; }
        public decimal? OriginalPrice { get; set; }
        public string Image { get; set; }
        public List<string> Sizes { get; set; }
        public bool? IsNew { get; set; }
        public bool? IsFeatured { get; set; } // Campo para produtos em destaque
        public int? CategoryId { get; set; }
        public bool? IsActive { get; set; }
    }
}
