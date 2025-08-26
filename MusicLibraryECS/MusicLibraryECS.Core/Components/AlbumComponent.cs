namespace MusicLibraryECS.Core.Components;

public class AlbumComponent : Component
{
    public string Title { get; set; } = string.Empty;
    public DateTime ReleaseDate { get; set; }
    public Guid ArtistEntityId { get; set; }
}