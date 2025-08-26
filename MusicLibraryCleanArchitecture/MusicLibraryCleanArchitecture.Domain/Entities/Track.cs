namespace MusicLibraryCleanArchitecture.Domain.Entities;

public class Track
{
	public int TrackId { get; set; }
	public string Title { get; set; } = string.Empty;
	public TimeSpan Duration { get; set; }
	public string Genre { get; set; } = string.Empty;

	public int AlbumId { get; set; }
	public Album? Album { get; set; }

	public ICollection<TrackArtist> TrackArtists { get; set; } = new List<TrackArtist>();
}


