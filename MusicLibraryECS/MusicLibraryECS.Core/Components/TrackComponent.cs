namespace MusicLibraryECS.Core.Components;

public class TrackComponent : Component
{
    public string Title { get; set; } = string.Empty;
    public TimeSpan Duration { get; set; }
    public Guid AlbumEntityId { get; set; }
    public string Genre { get; set; } = string.Empty;
}   