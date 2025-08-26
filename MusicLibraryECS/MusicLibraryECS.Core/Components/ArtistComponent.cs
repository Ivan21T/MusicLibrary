namespace MusicLibraryECS.Core.Components;

public class ArtistComponent : Component
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Pseudonym { get; set; } = string.Empty;
    public string Country { get; set; } = string.Empty;
}