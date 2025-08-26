using Microsoft.EntityFrameworkCore;
using MusicLibraryCleanArchitecture.Application.Abstractions.Repositories;
using MusicLibraryCleanArchitecture.Domain.Entities;
using MusicLibraryCleanArchitecture.Infrastructure.Persistence;

namespace MusicLibraryCleanArchitecture.Infrastructure.Repositories;

public class TrackRepository : ITrackRepository
{
	private readonly MusicLibraryDbContext _dbContext;

	public TrackRepository(MusicLibraryDbContext dbContext)
	{
		_dbContext = dbContext;
	}

	public async Task<Track?> GetByIdAsync(int trackId)
		=> await _dbContext.Tracks
			.Include(t => t.Album)
			.Include(t => t.TrackArtists).ThenInclude(ta => ta.Artist)
			.FirstOrDefaultAsync(t => t.TrackId == trackId);

	public async Task<IReadOnlyList<Track>> GetAllAsync()
		=> await _dbContext.Tracks.AsNoTracking().ToListAsync();

	public async Task<Track> AddAsync(Track track)
	{
		_dbContext.Tracks.Add(track);
		await _dbContext.SaveChangesAsync();
		return track;
	}

	public async Task UpdateAsync(Track track)
	{
		_dbContext.Tracks.Update(track);
		await _dbContext.SaveChangesAsync();
	}

	public async Task DeleteAsync(int trackId)
	{
		var entity = await _dbContext.Tracks.FindAsync(trackId);
		if (entity is null) return;
		_dbContext.Tracks.Remove(entity);
		await _dbContext.SaveChangesAsync();
	}

	public async Task<IReadOnlyList<Track>> FindByGenreWithDetailsAsync(string genre)
		=> await _dbContext.Tracks
			.Where(t => t.Genre == genre)
			.Include(t => t.Album)
			.Include(t => t.TrackArtists).ThenInclude(ta => ta.Artist)
			.AsNoTracking()
			.ToListAsync();

	public async Task SetTrackArtistsAsync(int trackId, IReadOnlyList<int> artistIds)
	{
		var existing = await _dbContext.TrackArtists.Where(ta => ta.TrackId == trackId).ToListAsync();
		_dbContext.TrackArtists.RemoveRange(existing);
		var newLinks = artistIds.Distinct().Select(artistId => new TrackArtist { TrackId = trackId, ArtistId = artistId });
		await _dbContext.TrackArtists.AddRangeAsync(newLinks);
		await _dbContext.SaveChangesAsync();
	}
}


