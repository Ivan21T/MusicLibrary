using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DataLayer.Migrations
{
    /// <inheritdoc />
    public partial class Update_v2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Albums_Users_AddedByUserId",
                table: "Albums");

            migrationBuilder.DropForeignKey(
                name: "FK_Tracks_Users_AddedByUserId",
                table: "Tracks");

            migrationBuilder.AddForeignKey(
                name: "FK_Albums_Users_AddedByUserId",
                table: "Albums",
                column: "AddedByUserId",
                principalTable: "Users",
                principalColumn: "UserId",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_Tracks_Users_AddedByUserId",
                table: "Tracks",
                column: "AddedByUserId",
                principalTable: "Users",
                principalColumn: "UserId",
                onDelete: ReferentialAction.SetNull);
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
    }
}
