namespace MusicLibraryECS.Core.Models;

public class TrackWithDetails
{
    public Guid TrackId { get; set; }
    public string Title { get; set; } = string.Empty;
    public TimeSpan Duration { get; set; }
    public string Genre { get; set; } = string.Empty;
    public AlbumInfo Album { get; set; } = new AlbumInfo();
    public List<ArtistInfo> Artists { get; set; } = new List<ArtistInfo>();
}