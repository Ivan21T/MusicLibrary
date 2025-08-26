namespace MusicLibraryCleanArchitecture.Application.DTOs;

public record TrackDto(int TrackId, string Title, TimeSpan Duration, string Genre, int AlbumId);
public record CreateTrackDto(string Title, TimeSpan Duration, string Genre, int AlbumId, IReadOnlyList<int>? ArtistIds);
public record UpdateTrackDto(string Title, TimeSpan Duration, string Genre, int AlbumId, IReadOnlyList<int>? ArtistIds);

public record TrackWithDetailsDto(int TrackId, string Title, TimeSpan Duration, string Genre, int AlbumId, AlbumDto Album, IReadOnlyList<ArtistDto> Artists);


