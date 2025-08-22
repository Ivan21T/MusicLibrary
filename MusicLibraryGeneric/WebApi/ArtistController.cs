using Microsoft.AspNetCore.Mvc;
using BusinessLayer;
using DataLayer;
namespace WebApi;

[Route("artists")]
[ApiController]
public class ArtistController:ControllerBase
{
    private readonly IDb<Artist, int> _artistContext;
    private readonly MusicLibraryDbContext _dbContext;

    public ArtistController(MusicLibraryDbContext dbContext, IDb<Artist, int> artistContext)
    {
        _dbContext=dbContext;
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
    public async Task<ActionResult<List<Artist>>> GetAll(bool useNavigationalProperties=false)
    {
        try
        {
            var artists = await _artistContext.ReadAll(useNavigationalProperties);
            return Ok(artists);
        }
        catch
        {
            return StatusCode(500, "Cannot get artists!");
        }
    }
}