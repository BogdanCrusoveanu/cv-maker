using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CvMaker.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddPhotoToCv : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<byte[]>(
                name: "Photo",
                table: "Cvs",
                type: "longblob",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Photo",
                table: "Cvs");
        }
    }
}
