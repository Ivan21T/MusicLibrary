using MusicLibraryCleanArchitecture.Domain.Entities;

namespace MusicLibraryCleanArchitecture.Application.Abstractions.Repositories;

public interface IArtistRepository
{
	Task<Artist?> GetByIdAsync(int artistId);
	Task<IReadOnlyList<Artist>> GetAllAsync();
	Task<Artist> AddAsync(Artist artist);
	Task UpdateAsync(Artist artist);
	Task DeleteAsync(int artistId);

	Task<IReadOnlyList<Album>> GetAlbumsWithTracksAsync(int artistId);
}


