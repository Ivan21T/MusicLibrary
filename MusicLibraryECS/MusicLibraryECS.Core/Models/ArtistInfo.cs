namespace MusicLibraryECS.Core.Models;

public class ArtistInfo
{
    public Guid ArtistId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Pseudonym { get; set; } = string.Empty;
    public string Country { get; set; } = string.Empty;
}