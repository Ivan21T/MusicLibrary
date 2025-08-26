namespace MusicLibraryCleanArchitecture.Domain.Entities;

public class Artist
{
	public int ArtistId { get; set; }
	public string FirstName { get; set; } = string.Empty;
	public string LastName { get; set; } = string.Empty;
	public string? Pseudonym { get; set; }
	public string Country { get; set; } = string.Empty;

	public ICollection<Album> Albums { get; set; } = new List<Album>();
	public ICollection<TrackArtist> TrackArtists { get; set; } = new List<TrackArtist>();
}


