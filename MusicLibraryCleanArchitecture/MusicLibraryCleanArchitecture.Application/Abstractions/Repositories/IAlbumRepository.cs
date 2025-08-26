using MusicLibraryCleanArchitecture.Domain.Entities;

namespace MusicLibraryCleanArchitecture.Application.Abstractions.Repositories;

public interface IAlbumRepository
{
	Task<Album?> GetByIdAsync(int albumId);
	Task<IReadOnlyList<Album>> GetAllAsync();
	Task<Album> AddAsync(Album album);
	Task UpdateAsync(Album album);
	Task DeleteAsync(int albumId);
}


