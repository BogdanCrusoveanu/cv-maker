using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CvMaker.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddPublicTokenToCv : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "PublicToken",
                table: "Cvs",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PublicToken",
                table: "Cvs");
        }
    }
}
