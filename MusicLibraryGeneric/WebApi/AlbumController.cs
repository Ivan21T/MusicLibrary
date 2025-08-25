using Microsoft.AspNetCore.Mvc;
using BusinessLayer;
using DataLayer;
namespace WebApi;

[Route("albums")]
[ApiController]
public class AlbumController:ControllerBase
{
    private readonly IDb<Album,int> _albumContext;

    public AlbumController( IDb<Album, int> albumContext)
    {
        _albumContext=albumContext;
    }

    [HttpPost]
    public async Task<ActionResult<Album>> Create(Album album)
    {
        try
        {
            _albumContext.Create(album);
            return Ok();
        }
        catch
        {
            return BadRequest("Album could not be created");
        }
    }

    [HttpGet]
    public async Task<ActionResult<List<Album>>> GetAll(bool useNavigationalProperties = false, bool isReadOnly = false)
    {
        try
        {
            var albums = await _albumContext.ReadAll(useNavigationalProperties, isReadOnly);
            return Ok(albums);
        }
        catch
        {
            return BadRequest("Album could not be read");
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Album>> GetByID(int id, bool useNavigationalProperties = false,
        bool isReadOnly = false)
    {
        try
        {
            var album = await _albumContext.Read(id, useNavigationalProperties, isReadOnly);
            return Ok(album);
        }
        catch
        {
            return BadRequest("Album could not be read");
        }
    }

    [HttpPut]
    public async Task<ActionResult<Album>> Update(Album album)
    {
        try
        {
            await _albumContext.Update(album);
            return Ok();
        }
        catch
        {
            return BadRequest("Album could not be updated");
        }
    }

    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            await _albumContext.Delete(id);
            return Ok();
        }
        catch
        {
            return BadRequest("Album could not be deleted");
        }
    }
}