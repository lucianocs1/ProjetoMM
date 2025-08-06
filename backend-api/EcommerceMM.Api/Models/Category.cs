using System.ComponentModel.DataAnnotations;

namespace EcommerceMM.Api.Models
{
    public class Category
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        [StringLength(500)]
        public string Description { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string Slug { get; set; } = string.Empty; // Para URLs amigáveis

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public virtual ICollection<Product> Products { get; set; } = new List<Product>();
    }
}
