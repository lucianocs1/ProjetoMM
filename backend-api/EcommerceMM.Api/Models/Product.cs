using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EcommerceMM.Api.Models
{
    public class Product
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(200)]
        public string Name { get; set; } = string.Empty;

        [StringLength(1000)]
        public string Description { get; set; } = string.Empty;

        [Required]
        [Column(TypeName = "decimal(10,2)")]
        public decimal Price { get; set; }

        [Column(TypeName = "decimal(10,2)")]
        public decimal? OriginalPrice { get; set; }

        [StringLength(500)]
        public string Image { get; set; } = string.Empty;

        public string Sizes { get; set; } = string.Empty; // JSON array as string

        public bool IsNew { get; set; } = false;

        public bool IsFeatured { get; set; } = false; // Campo para produtos em destaque

        public bool IsActive { get; set; } = true;

        [Required]
        public int CategoryId { get; set; }

        [ForeignKey("CategoryId")]
        public virtual Category Category { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Propriedades para facilitar o frontend
        public List<string> SizesList
        {
            get
            {
                if (string.IsNullOrEmpty(Sizes))
                    return new List<string>();
                
                try
                {
                    return System.Text.Json.JsonSerializer.Deserialize<List<string>>(Sizes) ?? new List<string>();
                }
                catch
                {
                    return new List<string>();
                }
            }
            set
            {
                Sizes = System.Text.Json.JsonSerializer.Serialize(value);
            }
        }
    }
}
