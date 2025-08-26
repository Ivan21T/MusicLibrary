using Microsoft.EntityFrameworkCore;
using MusicLibraryCleanArchitecture.Domain.Entities;

namespace MusicLibraryCleanArchitecture.Infrastructure.Persistence;

public class MusicLibraryDbContext : DbContext
{
	public MusicLibraryDbContext(DbContextOptions<MusicLibraryDbContext> options) : base(options) {}

	public DbSet<Artist> Artists => Set<Artist>();
	public DbSet<Album> Albums => Set<Album>();
	public DbSet<Track> Tracks => Set<Track>();
	public DbSet<TrackArtist> TrackArtists => Set<TrackArtist>();

	protected override void OnModelCreating(ModelBuilder modelBuilder)
	{
		modelBuilder.Entity<Artist>(builder =>
		{
			builder.HasKey(a => a.ArtistId);
			builder.Property(a => a.FirstName).IsRequired().HasMaxLength(100);
			builder.Property(a => a.LastName).IsRequired().HasMaxLength(100);
			builder.Property(a => a.Pseudonym).HasMaxLength(150);
			builder.Property(a => a.Country).IsRequired().HasMaxLength(100);
		});

		modelBuilder.Entity<Album>(builder =>
		{
			builder.HasKey(a => a.AlbumId);
			builder.Property(a => a.Title).IsRequired().HasMaxLength(200);
			builder.Property(a => a.ReleaseDate).IsRequired();
			builder.HasOne(a => a.Artist)
				.WithMany(ar => ar.Albums)
				.HasForeignKey(a => a.ArtistId)
				.OnDelete(DeleteBehavior.Cascade);
		});

		modelBuilder.Entity<Track>(builder =>
		{
			builder.HasKey(t => t.TrackId);
			builder.Property(t => t.Title).IsRequired().HasMaxLength(200);
			builder.Property(t => t.Duration).IsRequired();
			builder.Property(t => t.Genre).IsRequired().HasMaxLength(100);
			builder.HasOne(t => t.Album)
				.WithMany(a => a.Tracks)
				.HasForeignKey(t => t.AlbumId)
				.OnDelete(DeleteBehavior.Cascade);
		});

		modelBuilder.Entity<TrackArtist>(builder =>
		{
			builder.HasKey(ta => new { ta.TrackId, ta.ArtistId });
			builder.HasOne(ta => ta.Track)
				.WithMany(t => t.TrackArtists)
				.HasForeignKey(ta => ta.TrackId);
			builder.HasOne(ta => ta.Artist)
				.WithMany(a => a.TrackArtists)
				.HasForeignKey(ta => ta.ArtistId);
		});
	}
}


