namespace MusicLibraryECS.API.DTOs;

public class TrackCreateRequest
{
    public string Title { get; set; } = string.Empty;
    public TimeSpan Duration { get; set; }
    public Guid AlbumId { get; set; }
    public string Genre { get; set; } = string.Empty;
}