using Microsoft.AspNetCore.Mvc;
using BusinessLayer;
using DataLayer;
namespace WebApi;

[Route("tracks")]
[ApiController]
public class TrackController : ControllerBase
{
    private readonly IDb<Track, int> _tracksContext;

    public TrackController(IDb<Track, int> tracksContext, MusicLibraryDbContext musicLibraryDbContext)
    {
        _tracksContext = tracksContext;
    }

    [HttpGet]
    public async Task<ActionResult<List<Track>>> GetAll(bool useNavigationalProperties = false, bool isReadOnly = false,
        bool importantData = false)
    {
        try
        {
            var tracks = await _tracksContext.ReadAll(useNavigationalProperties,isReadOnly);
            {
                var reducedTracks = tracks.Select(t => new 
                {
                    t.TrackId,
                    t.Title
                }).ToList();

                return Ok(reducedTracks);
            }
            return Ok(tracks);
        }
        catch
        {
            return StatusCode(500,"Cannot read all tracks!");
        }
    }
    [HttpPost]
    public async Task<ActionResult> Create([FromBody] Track track)
    {
        try
        {
            await _tracksContext.Create(track);
            return Ok();
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Cannot create track: {ex.Message}");
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Track>> Get(int id, bool useNavigationalProperties = false,bool isReadOnly = false)
    {
        try
        {
            var track = await _tracksContext.Read(id, useNavigationalProperties,isReadOnly);
            return Ok(track);
        }
        catch
        {
            return StatusCode(500,"Cannot read track!");
        }
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> Update([FromBody] Track track, bool useNavigationalProperties = false)
    {
        try
        {
            await _tracksContext.Update(track);
            return Ok();
        }
        catch
        {
            return StatusCode(500,"Cannot update track!");
        }
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(int id)
    {
        try
        {
            await _tracksContext.Delete(id);
            return NoContent();
        }
        catch
        {
            return StatusCode(500,"Cannot delete track!");
        }
    }

}