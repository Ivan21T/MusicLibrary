using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DataLayer.Migrations
{
    /// <inheritdoc />
    public partial class Update_v6 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Duration",
                table: "Tracks");

            migrationBuilder.AlterColumn<int>(
                name: "Genre",
                table: "Tracks",
                type: "INTEGER",
                maxLength: 30,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "TEXT",
                oldMaxLength: 30);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Genre",
                table: "Tracks",
                type: "TEXT",
                maxLength: 30,
                nullable: false,
                oldClrType: typeof(int),
                oldType: "INTEGER",
                oldMaxLength: 30);

            migrationBuilder.AddColumn<double>(
                name: "Duration",
                table: "Tracks",
                type: "REAL",
                nullable: false,
                defaultValue: 0.0);
        }
    }
}
