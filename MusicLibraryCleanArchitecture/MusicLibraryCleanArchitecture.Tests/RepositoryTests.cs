using System.Data.Common;
using FluentAssertions;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using MusicLibraryCleanArchitecture.Application.Abstractions.Repositories;
using MusicLibraryCleanArchitecture.Application.DTOs;
using MusicLibraryCleanArchitecture.Application.Validation;
using MusicLibraryCleanArchitecture.Domain.Entities;
using MusicLibraryCleanArchitecture.Infrastructure.Persistence;
using MusicLibraryCleanArchitecture.Infrastructure.Repositories;

namespace MusicLibraryCleanArchitecture.Tests;

public class RepositoryTests : IDisposable
{
	private readonly DbConnection _connection;
	private readonly MusicLibraryDbContext _dbContext;
	private readonly IArtistRepository _artistRepo;
	private readonly IAlbumRepository _albumRepo;
	private readonly ITrackRepository _trackRepo;

	public RepositoryTests()
	{
		_connection = new SqliteConnection("DataSource=:memory:");
		_connection.Open();

		var options = new DbContextOptionsBuilder<MusicLibraryDbContext>()
			.UseSqlite(_connection)
			.Options;

		_dbContext = new MusicLibraryDbContext(options);
		_dbContext.Database.EnsureCreated();

		_artistRepo = new ArtistRepository(_dbContext);
		_albumRepo = new AlbumRepository(_dbContext);
		_trackRepo = new TrackRepository(_dbContext);
	}

	[Fact]
	public async Task AlbumsByArtist_WithTracks_Returns_Data()
	{
		var artist = await _artistRepo.AddAsync(new Artist { FirstName = "John", LastName = "Doe", Country = "US" });
		var album = await _albumRepo.AddAsync(new Album { Title = "Debut", ReleaseDate = DateTime.UtcNow, ArtistId = artist.ArtistId });
		await _trackRepo.AddAsync(new Track { Title = "Intro", Duration = TimeSpan.FromSeconds(120), Genre = "Pop", AlbumId = album.AlbumId });

		var albums = await _artistRepo.GetAlbumsWithTracksAsync(artist.ArtistId);
		albums.Should().HaveCount(1);
		albums[0].Tracks.Should().HaveCount(1);
	}

	[Fact]
	public async Task FindTracksByGenre_Returns_With_Details()
	{
		var artist = await _artistRepo.AddAsync(new Artist { FirstName = "Jane", LastName = "Roe", Country = "UK" });
		var album = await _albumRepo.AddAsync(new Album { Title = "Sounds", ReleaseDate = DateTime.UtcNow, ArtistId = artist.ArtistId });
		var track = await _trackRepo.AddAsync(new Track { Title = "Beat", Duration = TimeSpan.FromSeconds(200), Genre = "EDM", AlbumId = album.AlbumId });
		await _trackRepo.SetTrackArtistsAsync(track.TrackId, new List<int> { artist.ArtistId });

		var tracks = await _trackRepo.FindByGenreWithDetailsAsync("EDM");
		tracks.Should().ContainSingle();
		var t = tracks.Single();
		t.Album!.Title.Should().Be("Sounds");
		t.TrackArtists.Should().HaveCount(1);
	}

	[Fact]
	public void Validators_Work_As_Expected()
	{
		var trackValidator = new CreateTrackDtoValidator();
		trackValidator.Validate(new CreateTrackDto("ok", TimeSpan.Zero, "g", 1, null)).IsValid.Should().BeFalse();
		trackValidator.Validate(new CreateTrackDto("ok", TimeSpan.FromSeconds(1), "g", 1, null)).IsValid.Should().BeTrue();

		var albumValidator = new CreateAlbumDtoValidator();
		var future = DateTime.UtcNow.AddDays(1);
		albumValidator.Validate(new CreateAlbumDto("a", future, 1)).IsValid.Should().BeFalse();
	}

	public void Dispose()
	{
		_dbContext.Dispose();
		_connection.Dispose();
	}
}
