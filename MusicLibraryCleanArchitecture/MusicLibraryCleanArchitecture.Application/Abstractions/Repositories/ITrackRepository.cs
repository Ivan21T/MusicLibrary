using MusicLibraryCleanArchitecture.Domain.Entities;

namespace MusicLibraryCleanArchitecture.Application.Abstractions.Repositories;

public interface ITrackRepository
{
	Task<Track?> GetByIdAsync(int trackId);
	Task<IReadOnlyList<Track>> GetAllAsync();
	Task<Track> AddAsync(Track track);
	Task UpdateAsync(Track track);
	Task DeleteAsync(int trackId);

	Task<IReadOnlyList<Track>> FindByGenreWithDetailsAsync(string genre);

	Task SetTrackArtistsAsync(int trackId, IReadOnlyList<int> artistIds);
}


