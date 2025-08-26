namespace MusicLibraryCleanArchitecture.Application.DTOs;

public record ArtistDto(int ArtistId, string FirstName, string LastName, string? Pseudonym, string Country);
public record CreateArtistDto(string FirstName, string LastName, string? Pseudonym, string Country);
public record UpdateArtistDto(string FirstName, string LastName, string? Pseudonym, string Country);


