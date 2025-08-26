using Microsoft.AspNetCore.Mvc;
using MusicLibraryECS.Core.Systems;
using MusicLibraryECS.API.DTOs;

namespace MusicLibraryECS.API.Controllers;
[ApiController]
[Route("api/[controller]")]
public class ArtistsController : ControllerBase
{
    private readonly ArtistSystem _artistSystem;
    private readonly AlbumSystem _albumSystem;
    private readonly TrackSystem _trackSystem;
    private readonly TrackArtistSystem _trackArtistSystem;

    public ArtistsController(ArtistSystem artistSystem, AlbumSystem albumSystem, TrackSystem trackSystem, TrackArtistSystem trackArtistSystem)
    {
        _artistSystem = artistSystem;
        _albumSystem = albumSystem;
        _trackSystem = trackSystem;
        _trackArtistSystem = trackArtistSystem;
    }

    [HttpGet]
    public IActionResult GetAllArtists()
    {
        var artists = _artistSystem.GetAllArtists();
        return Ok(artists);
    }

    [HttpGet("{id}")]
    public IActionResult GetArtist(Guid id)
    {
        var artist = _artistSystem.GetArtist(id);
        if (artist == null) return NotFound();
        return Ok(artist);
    }

    [HttpPost]
    public IActionResult CreateArtist([FromBody] ArtistCreateRequest request)
    {
        var artist = _artistSystem.CreateArtist(request.FirstName, request.LastName, request.Pseudonym, request.Country);
        return CreatedAtAction(nameof(GetArtist), new { id = artist.Id }, artist);
    }

    [HttpPut("{id}")]
    public IActionResult UpdateArtist(Guid id, [FromBody] ArtistCreateRequest request)
    {
        _artistSystem.UpdateArtist(id, request.FirstName, request.LastName, request.Pseudonym, request.Country);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public IActionResult DeleteArtist(Guid id)
    {
        _artistSystem.DeleteArtist(id);
        return NoContent();
    }

    [HttpGet("{id}/albums")]
    public IActionResult GetArtistAlbums(Guid id)
    {
        var albums = _albumSystem.GetAlbumsByArtist(id);
        return Ok(albums);
    }

    [HttpGet("{id}/albums-with-tracks")]
    public IActionResult GetArtistAlbumsWithTracks(Guid id)
    {
        var albumsWithTracks = _artistSystem.GetAlbumsWithTracksByArtist(id);
        return Ok(albumsWithTracks);
    }

    [HttpGet("{id}/tracks")]
    public IActionResult GetArtistTracks(Guid id)
    {
        var trackIds = _trackArtistSystem.GetTracksForArtist(id);
        var tracks = trackIds.Select(trackId => _trackSystem.GetTrack(trackId)).ToList();
        return Ok(tracks);
    }
}

