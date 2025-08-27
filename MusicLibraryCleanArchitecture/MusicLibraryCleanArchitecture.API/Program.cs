using AutoMapper;
using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.EntityFrameworkCore;
using MusicLibraryCleanArchitecture.Application.Abstractions.Repositories;
using MusicLibraryCleanArchitecture.Application.Mapping;
using MusicLibraryCleanArchitecture.Application.Validation;
using MusicLibraryCleanArchitecture.Infrastructure.Persistence;
using MusicLibraryCleanArchitecture.Infrastructure.Repositories;

var builder = WebApplication.CreateBuilder(args);


builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


builder.Services.AddDbContext<MusicLibraryDbContext>(options =>
{
	var cs = builder.Configuration.GetConnectionString("DefaultConnection");
	options.UseSqlite(cs);
});


builder.Services.AddScoped<IArtistRepository, ArtistRepository>();
builder.Services.AddScoped<IAlbumRepository, AlbumRepository>();
builder.Services.AddScoped<ITrackRepository, TrackRepository>();


var mapperConfig = new MapperConfiguration(cfg => cfg.AddProfile<MappingProfile>());
builder.Services.AddSingleton(mapperConfig.CreateMapper());


builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddValidatorsFromAssemblyContaining<CreateTrackDtoValidator>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
	app.UseSwagger();
	app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.MapControllers();
app.Run();
