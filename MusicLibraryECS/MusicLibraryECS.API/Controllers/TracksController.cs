using Microsoft.AspNetCore.Mvc;
using MusicLibraryECS.Core.Systems;
using MusicLibraryECS.Core.Validators;
using MusicLibraryECS.Core.Components;
using MusicLibraryECS.API.DTOs;

namespace MusicLibraryECS.API.Controllers;
[ApiController]
[Route("api/[controller]")]
public class TracksController : ControllerBase
{
    private readonly TrackSystem _trackSystem;
    private readonly TrackArtistSystem _trackArtistSystem;
    private readonly TrackComponentValidator _validator;

    public TracksController(TrackSystem trackSystem, TrackArtistSystem trackArtistSystem, TrackComponentValidator validator)
    {
        _trackSystem = trackSystem;
        _trackArtistSystem = trackArtistSystem;
        _validator = validator;
    }

    [HttpGet]
    public IActionResult GetAllTracks()
    {
        var tracks = _trackSystem.GetAllTracks();
        return Ok(tracks);
    }

    [HttpGet("{id}")]
    public IActionResult GetTrack(Guid id)
    {
        var track = _trackSystem.GetTrack(id);
        if (track == null) return NotFound();
        return Ok(track);
    }

    [HttpPost]
    public IActionResult CreateTrack([FromBody] TrackCreateRequest request)
    {
        var trackComponent = new TrackComponent
        {
            Title = request.Title,
            Duration = request.Duration,
            AlbumEntityId = request.AlbumId,
            Genre = request.Genre
        };

        var validationResult = _validator.Validate(trackComponent);
        if (!validationResult.IsValid)
            return BadRequest(validationResult.Errors);

        var track = _trackSystem.CreateTrack(request.Title, request.Duration, request.AlbumId, request.Genre);
        return CreatedAtAction(nameof(GetTrack), new { id = track.Id }, track);
    }

    [HttpPut("{id}")]
    public IActionResult UpdateTrack(Guid id, [FromBody] TrackCreateRequest request)
    {
        _trackSystem.UpdateTrack(id, request.Title, request.Duration, request.AlbumId, request.Genre);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public IActionResult DeleteTrack(Guid id)
    {
        _trackSystem.DeleteTrack(id);
        return NoContent();
    }

    [HttpGet("genre/{genre}")]
    public IActionResult GetTracksByGenre(string genre)
    {
        var tracks = _trackSystem.GetTracksByGenre(genre);
        return Ok(tracks);
    }

    [HttpGet("genre/{genre}/with-details")]
    public IActionResult GetTracksWithDetailsByGenre(string genre)
    {
        var tracksWithDetails = _trackSystem.GetTracksWithDetailsByGenre(genre);
        return Ok(tracksWithDetails);
    }

    [HttpPost("{trackId}/artists/{artistId}")]
    public IActionResult AddArtistToTrack(Guid trackId, Guid artistId)
    {
        _trackArtistSystem.AddArtistToTrack(trackId, artistId);
        return NoContent();
    }

    [HttpGet("{id}/artists")]
    public IActionResult GetTrackArtists(Guid id)
    {
        var artistIds = _trackArtistSystem.GetArtistsForTrack(id);
        return Ok(artistIds);
    }
}

