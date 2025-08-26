namespace MusicLibraryECS.Core.Models;

public class AlbumWithTracks
{
    public Guid AlbumId { get; set; }
    public string Title { get; set; } = string.Empty;
    public DateTime ReleaseDate { get; set; }
    public ArtistInfo Artist { get; set; } = new ArtistInfo();
    public List<TrackInfo> Tracks { get; set; } = new List<TrackInfo>();
}   