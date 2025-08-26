namespace MusicLibraryECS.API.DTOs;

public class AlbumCreateRequest
{
    public string Title { get; set; } = string.Empty;
    public DateTime ReleaseDate { get; set; }
    public Guid ArtistId { get; set; }
}