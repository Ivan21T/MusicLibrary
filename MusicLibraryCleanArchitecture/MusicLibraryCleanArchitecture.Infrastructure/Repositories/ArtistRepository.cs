using Microsoft.EntityFrameworkCore;
using MusicLibraryCleanArchitecture.Application.Abstractions.Repositories;
using MusicLibraryCleanArchitecture.Domain.Entities;
using MusicLibraryCleanArchitecture.Infrastructure.Persistence;

namespace MusicLibraryCleanArchitecture.Infrastructure.Repositories;

public class ArtistRepository : IArtistRepository
{
	private readonly MusicLibraryDbContext _dbContext;

	public ArtistRepository(MusicLibraryDbContext dbContext)
	{
		_dbContext = dbContext;
	}

	public async Task<Artist?> GetByIdAsync(int artistId)
		=> await _dbContext.Artists.FindAsync(artistId);

	public async Task<IReadOnlyList<Artist>> GetAllAsync()
		=> await _dbContext.Artists.AsNoTracking().ToListAsync();

	public async Task<Artist> AddAsync(Artist artist)
	{
		_dbContext.Artists.Add(artist);
		await _dbContext.SaveChangesAsync();
		return artist;
	}

	public async Task UpdateAsync(Artist artist)
	{
		_dbContext.Artists.Update(artist);
		await _dbContext.SaveChangesAsync();
	}

	public async Task DeleteAsync(int artistId)
	{
		var entity = await _dbContext.Artists.FindAsync(artistId);
		if (entity is null) return;
		_dbContext.Artists.Remove(entity);
		await _dbContext.SaveChangesAsync();
	}

	public async Task<IReadOnlyList<Album>> GetAlbumsWithTracksAsync(int artistId)
		=> await _dbContext.Albums
			.Where(a => a.ArtistId == artistId)
			.Include(a => a.Tracks)
			.AsNoTracking()
			.ToListAsync();
}


