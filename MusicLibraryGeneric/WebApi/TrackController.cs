using Microsoft.AspNetCore.Mvc;
using BusinessLayer;
using DataLayer;
namespace WebApi;

[Route("tracks")]
[ApiController]
public class TrackController : ControllerBase
{
    private readonly IDb<Track, int> _tracksContext;
    private readonly MusicLibraryDbContext _musicLibraryDbContext;

    public TrackController(IDb<Track, int> tracksContext, MusicLibraryDbContext musicLibraryDbContext)
    {
        _tracksContext = tracksContext;
        _musicLibraryDbContext = musicLibraryDbContext;
    }

    [HttpGet]
    public async Task<ActionResult<List<Track>>> GetAll(bool useNavigationalProperties = false)
    {
        try
        {
            var tracks = await _tracksContext.ReadAll(useNavigationalProperties);
            return Ok(tracks);
        }
        catch
        {
            return StatusCode(500,"Cannot read all tracks!");
        }
    }

}