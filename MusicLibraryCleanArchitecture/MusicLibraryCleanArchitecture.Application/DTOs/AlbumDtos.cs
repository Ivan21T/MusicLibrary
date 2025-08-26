namespace MusicLibraryCleanArchitecture.Application.DTOs;

public record AlbumDto(int AlbumId, string Title, DateTime ReleaseDate, int ArtistId);
public record CreateAlbumDto(string Title, DateTime ReleaseDate, int ArtistId);
public record UpdateAlbumDto(string Title, DateTime ReleaseDate);

public record AlbumWithTracksDto(int AlbumId, string Title, DateTime ReleaseDate, int ArtistId, IReadOnlyList<TrackDto> Tracks);


