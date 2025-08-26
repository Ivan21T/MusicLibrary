namespace MusicLibraryECS.Core.Models;

public class TrackInfo
{
    public Guid TrackId { get; set; }
    public string Title { get; set; } = string.Empty;
    public TimeSpan Duration { get; set; }
    public string Genre { get; set; } = string.Empty;
}