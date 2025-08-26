namespace MusicLibraryECS.Core.Models;

public class AlbumInfo
{
    public Guid AlbumId { get; set; }
    public string Title { get; set; } = string.Empty;
    public DateTime ReleaseDate { get; set; }
}