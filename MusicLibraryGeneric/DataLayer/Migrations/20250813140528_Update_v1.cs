using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DataLayer.Migrations
{
    /// <inheritdoc />
    public partial class Update_v1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "AddedByUserId",
                table: "Tracks",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<byte[]>(
                name: "ImageData",
                table: "Tracks",
                type: "BLOB",
                nullable: false,
                defaultValue: new byte[0]);

            migrationBuilder.AddColumn<byte[]>(
                name: "MusicData",
                table: "Tracks",
                type: "BLOB",
                nullable: false,
                defaultValue: new byte[0]);

            migrationBuilder.AddColumn<int>(
                name: "AddedByUserId",
                table: "Albums",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Tracks_AddedByUserId",
                table: "Tracks",
                column: "AddedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Albums_AddedByUserId",
                table: "Albums",
                column: "AddedByUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Albums_Users_AddedByUserId",
                table: "Albums",
                column: "AddedByUserId",
                principalTable: "Users",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Tracks_Users_AddedByUserId",
                table: "Tracks",
                column: "AddedByUserId",
                principalTable: "Users",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Albums_Users_AddedByUserId",
                table: "Albums");

            migrationBuilder.DropForeignKey(
                name: "FK_Tracks_Users_AddedByUserId",
                table: "Tracks");

            migrationBuilder.DropIndex(
                name: "IX_Tracks_AddedByUserId",
                table: "Tracks");

            migrationBuilder.DropIndex(
                name: "IX_Albums_AddedByUserId",
                table: "Albums");

            migrationBuilder.DropColumn(
                name: "AddedByUserId",
                table: "Tracks");

            migrationBuilder.DropColumn(
                name: "ImageData",
                table: "Tracks");

            migrationBuilder.DropColumn(
                name: "MusicData",
                table: "Tracks");

            migrationBuilder.DropColumn(
                name: "AddedByUserId",
                table: "Albums");
        }
    }
}
