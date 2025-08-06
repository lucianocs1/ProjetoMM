using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace EcommerceMM.Api.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Admins",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Username = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    Email = table.Column<string>(type: "TEXT", maxLength: 200, nullable: false),
                    PasswordHash = table.Column<string>(type: "TEXT", nullable: false),
                    IsActive = table.Column<bool>(type: "INTEGER", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    LastLogin = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Admins", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Categories",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "TEXT", maxLength: 500, nullable: true),
                    Slug = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    IsActive = table.Column<bool>(type: "INTEGER", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Categories", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Products",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "TEXT", maxLength: 1000, nullable: true),
                    Price = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    OriginalPrice = table.Column<decimal>(type: "decimal(10,2)", nullable: true),
                    Image = table.Column<string>(type: "TEXT", maxLength: 500, nullable: true),
                    Sizes = table.Column<string>(type: "TEXT", nullable: true, defaultValue: "[]"),
                    IsNew = table.Column<bool>(type: "INTEGER", nullable: false),
                    IsFeatured = table.Column<bool>(type: "INTEGER", nullable: false),
                    IsActive = table.Column<bool>(type: "INTEGER", nullable: false),
                    CategoryId = table.Column<int>(type: "INTEGER", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    SizesList = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Products", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Products_Categories_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "Categories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.InsertData(
                table: "Admins",
                columns: new[] { "Id", "CreatedAt", "Email", "IsActive", "LastLogin", "PasswordHash", "Username" },
                values: new object[] { 1, new DateTime(2025, 8, 6, 12, 48, 58, 176, DateTimeKind.Utc).AddTicks(8269), "admin@ecommercemm.com", true, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "$2a$11$1HLr5CmUzq/BQyK.1By2YeAC5k5sDSr4NCN5Kd63qaEqGaZK7nVMG", "admin" });

            migrationBuilder.InsertData(
                table: "Categories",
                columns: new[] { "Id", "CreatedAt", "Description", "IsActive", "Name", "Slug" },
                values: new object[,]
                {
                    { 1, new DateTime(2025, 8, 6, 12, 48, 58, 69, DateTimeKind.Utc).AddTicks(8353), "Roupas femininas", true, "Roupas", "roupas" },
                    { 2, new DateTime(2025, 8, 6, 12, 48, 58, 69, DateTimeKind.Utc).AddTicks(8358), "Blusas e tops", true, "Blusas", "blusas" },
                    { 3, new DateTime(2025, 8, 6, 12, 48, 58, 69, DateTimeKind.Utc).AddTicks(8359), "Bolsas e acessórios", true, "Bolsas", "bolsas" },
                    { 4, new DateTime(2025, 8, 6, 12, 48, 58, 69, DateTimeKind.Utc).AddTicks(8360), "Calçados femininos", true, "Sapatos", "sapatos" },
                    { 5, new DateTime(2025, 8, 6, 12, 48, 58, 69, DateTimeKind.Utc).AddTicks(8361), "Saias e calças", true, "Saias e Calças", "saia-calca" }
                });

            migrationBuilder.InsertData(
                table: "Products",
                columns: new[] { "Id", "CategoryId", "CreatedAt", "Description", "Image", "IsActive", "IsFeatured", "IsNew", "Name", "OriginalPrice", "Price", "Sizes", "SizesList", "UpdatedAt" },
                values: new object[,]
                {
                    { 1, 1, new DateTime(2025, 8, 6, 12, 48, 58, 176, DateTimeKind.Utc).AddTicks(8442), "Vestido midi com estampa floral delicada, perfeito para o verão", "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=300&h=300&fit=crop&crop=center", true, false, true, "Vestido Floral Midi", 119.90m, 89.90m, "[\"P\", \"M\", \"G\", \"GG\"]", "[\"P\",\"M\",\"G\",\"GG\"]", new DateTime(2025, 8, 6, 12, 48, 58, 176, DateTimeKind.Utc).AddTicks(8442) },
                    { 2, 2, new DateTime(2025, 8, 6, 12, 48, 58, 176, DateTimeKind.Utc).AddTicks(8445), "Blusa básica em algodão, confortável para o dia a dia", "https://images.unsplash.com/photo-1564557287817-3785e38ec1f5?w=300&h=300&fit=crop&crop=center", true, false, false, "Blusa Básica Cotton", null, 49.90m, "[\"P\", \"M\", \"G\"]", "[\"P\",\"M\",\"G\"]", new DateTime(2025, 8, 6, 12, 48, 58, 176, DateTimeKind.Utc).AddTicks(8445) },
                    { 3, 3, new DateTime(2025, 8, 6, 12, 48, 58, 176, DateTimeKind.Utc).AddTicks(8447), "Bolsa tote espaçosa em couro sintético, ideal para o dia a dia", "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop&crop=center", true, false, true, "Bolsa Tote Grande", 199.90m, 159.90m, "[\"Único\"]", "[\"\\u00DAnico\"]", new DateTime(2025, 8, 6, 12, 48, 58, 176, DateTimeKind.Utc).AddTicks(8448) }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Admins_Email",
                table: "Admins",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Admins_Username",
                table: "Admins",
                column: "Username",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Categories_IsActive",
                table: "Categories",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_Categories_Slug",
                table: "Categories",
                column: "Slug",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Products_CategoryId",
                table: "Products",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_Products_IsActive",
                table: "Products",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_Products_Name",
                table: "Products",
                column: "Name");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Admins");

            migrationBuilder.DropTable(
                name: "Products");

            migrationBuilder.DropTable(
                name: "Categories");
        }
    }
}
