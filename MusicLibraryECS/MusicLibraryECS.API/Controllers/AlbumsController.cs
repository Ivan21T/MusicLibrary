using Microsoft.AspNetCore.Mvc;
using MusicLibraryECS.Core.Systems;
using MusicLibraryECS.Core.Validators;
using MusicLibraryECS.Core.Components;
using MusicLibraryECS.API.DTOs;

namespace MusicLibraryECS.API.Controllers;
[ApiController]
[Route("api/[controller]")]
public class AlbumsController : ControllerBase
{
    private readonly AlbumSystem _albumSystem;
    private readonly TrackSystem _trackSystem;
    private readonly AlbumComponentValidator _validator;

    public AlbumsController(AlbumSystem albumSystem, TrackSystem trackSystem, AlbumComponentValidator validator)
    {
        _albumSystem = albumSystem;
        _trackSystem = trackSystem;
        _validator = validator;
    }

    [HttpGet]
    public IActionResult GetAllAlbums()
    {
        var albums = _albumSystem.GetAllAlbums();
        return Ok(albums);
    }

    [HttpGet("{id}")]
    public IActionResult GetAlbum(Guid id)
    {
        var album = _albumSystem.GetAlbum(id);
        if (album == null) return NotFound();
        return Ok(album);
    }

    [HttpPost]
    public IActionResult CreateAlbum([FromBody] AlbumCreateRequest request)
    {
        var albumComponent = new AlbumComponent
        {
            Title = request.Title,
            ReleaseDate = request.ReleaseDate,
            ArtistEntityId = request.ArtistId
        };

        var validationResult = _validator.Validate(albumComponent);
        if (!validationResult.IsValid)
            return BadRequest(validationResult.Errors);

        var album = _albumSystem.CreateAlbum(request.Title, request.ReleaseDate, request.ArtistId);
        return CreatedAtAction(nameof(GetAlbum), new { id = album.Id }, album);
    }

    [HttpPut("{id}")]
    public IActionResult UpdateAlbum(Guid id, [FromBody] AlbumCreateRequest request)
    {
        _albumSystem.UpdateAlbum(id, request.Title, request.ReleaseDate, request.ArtistId);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public IActionResult DeleteAlbum(Guid id)
    {
        _albumSystem.DeleteAlbum(id);
        return NoContent();
    }

    [HttpGet("{id}/tracks")]
    public IActionResult GetAlbumTracks(Guid id)
    {
        var allTracks = _trackSystem.GetAllTracks();
        var albumTracks = allTracks.Where(t =>
            t.Components.OfType<TrackComponent>().Any(tc => tc.AlbumEntityId == id)).ToList();
        return Ok(albumTracks);
    }
}

