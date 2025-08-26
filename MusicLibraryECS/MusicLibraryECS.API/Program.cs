using Microsoft.EntityFrameworkCore;
using MusicLibraryECS.Core.Data;
using MusicLibraryECS.Core.Systems;
using MusicLibraryECS.Core.Validators;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<EcsDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddScoped<ArtistSystem>();
builder.Services.AddScoped<AlbumSystem>();
builder.Services.AddScoped<TrackSystem>();
builder.Services.AddScoped<TrackArtistSystem>();
builder.Services.AddScoped<AlbumComponentValidator>();
builder.Services.AddScoped<TrackComponentValidator>();
var app = builder.Build();
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.Run();