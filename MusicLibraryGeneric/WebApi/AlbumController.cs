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
}