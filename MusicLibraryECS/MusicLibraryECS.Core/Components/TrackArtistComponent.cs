namespace MusicLibraryECS.Core.Components;

public class TrackArtistComponent : Component
{
    public Guid TrackEntityId { get; set; }
    public Guid ArtistEntityId { get; set; }
}