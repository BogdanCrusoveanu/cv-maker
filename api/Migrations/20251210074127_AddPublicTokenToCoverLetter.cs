using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CvMaker.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddPublicTokenToCoverLetter : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "PublicToken",
                table: "CoverLetters",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PublicToken",
                table: "CoverLetters");
        }
    }
}
