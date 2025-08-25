using Microsoft.AspNetCore.Mvc;
using BusinessLayer;
using DataLayer;
namespace WebApi;

[Route("artists")]
[ApiController]
public class ArtistController:ControllerBase
{
    private readonly IDb<Artist, int> _artistContext;

    public ArtistController( IDb<Artist, int> artistContext)
    {
        _artistContext=artistContext;
    }

    [HttpPost]
    public async Task<ActionResult<Artist>> Create([FromBody]Artist artist)
    {
        try
        {
            await _artistContext.Create(artist);
            return Created($"/api/artists/{artist.ArtistId}", artist);
        }
        catch
        {
            return StatusCode(500, "Can not create artist!");
        }
    }

    [HttpGet]
    public async Task<ActionResult<List<Artist>>> GetAll(bool useNavigationalProperties=false,bool isReadOnly=false)
    {
        try
        {
            var artists = await _artistContext.ReadAll(useNavigationalProperties,isReadOnly);
            return Ok(artists);
        }
        catch
        {
            return StatusCode(500, "Cannot get artists!");
        }
    }
 
    [HttpGet("{id}")]
    public async Task<ActionResult<Artist>> Get(int id, bool useNavigationalProperties = false, bool isReadOnly = false)
    {
        try
        {
            var artist = await _artistContext.Read(id, useNavigationalProperties, isReadOnly);
            return Ok(artist);
        }
        catch
        {
            return StatusCode(500, "Cannot get artist!");
        }
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(int id)
    {
        try
        {
            await _artistContext.Delete(id);
            return NoContent();
        }
        catch
        {
            return StatusCode(500, "Cannot delete artist!");
        }
    }
    [HttpPut("{id}")]
    public async Task<ActionResult> Update([FromBody] Artist artist,bool useNavigationalProperties=false)
    {
        try
        {
            await _artistContext.Update(artist, useNavigationalProperties);
            return NoContent();
        }
        catch
        {
            return StatusCode(500, "Cannot update artist!");
        }
    }
}