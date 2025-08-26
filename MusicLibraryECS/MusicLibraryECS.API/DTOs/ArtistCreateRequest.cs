namespace MusicLibraryECS.API.DTOs;

public class ArtistCreateRequest
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Pseudonym { get; set; } = string.Empty;
    public string Country { get; set; } = string.Empty;
}