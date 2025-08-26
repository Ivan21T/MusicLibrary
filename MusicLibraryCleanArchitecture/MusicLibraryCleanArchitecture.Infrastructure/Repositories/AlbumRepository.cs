using Microsoft.EntityFrameworkCore;
using MusicLibraryCleanArchitecture.Application.Abstractions.Repositories;
using MusicLibraryCleanArchitecture.Domain.Entities;
using MusicLibraryCleanArchitecture.Infrastructure.Persistence;

namespace MusicLibraryCleanArchitecture.Infrastructure.Repositories;

public class AlbumRepository : IAlbumRepository
{
	private readonly MusicLibraryDbContext _dbContext;

	public AlbumRepository(MusicLibraryDbContext dbContext)
	{
		_dbContext = dbContext;
	}

	public async Task<Album?> GetByIdAsync(int albumId)
		=> await _dbContext.Albums.FindAsync(albumId);

	public async Task<IReadOnlyList<Album>> GetAllAsync()
		=> await _dbContext.Albums.AsNoTracking().ToListAsync();

	public async Task<Album> AddAsync(Album album)
	{
		_dbContext.Albums.Add(album);
		await _dbContext.SaveChangesAsync();
		return album;
	}

	public async Task UpdateAsync(Album album)
	{
		_dbContext.Albums.Update(album);
		await _dbContext.SaveChangesAsync();
	}

	public async Task DeleteAsync(int albumId)
	{
		var entity = await _dbContext.Albums.FindAsync(albumId);
		if (entity is null) return;
		_dbContext.Albums.Remove(entity);
		await _dbContext.SaveChangesAsync();
	}
}


