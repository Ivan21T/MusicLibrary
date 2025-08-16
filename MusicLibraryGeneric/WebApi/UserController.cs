using Microsoft.AspNetCore.Mvc;
using BusinessLayer;
using DataLayer;
using Microsoft.EntityFrameworkCore;
using BCrypt.Net;

[Route("users")]
[ApiController]
public class UsersController : ControllerBase
{
    private readonly IDb<User,int> _userContext;

    public UsersController(IDb<User,int> userContext)
    {
        _userContext = userContext;
    }
    
    [HttpGet]
    public async Task<ActionResult<List<User>>> GetAll(bool useNavigationalProperties = false)
    {
        try
        {
            var users = await _userContext.ReadAll(useNavigationalProperties);
            return Ok(users);
        }
        catch
        {
            return StatusCode(500, "Cannot get users!");
        }
    }
    [HttpPost]
    [Route("login")]
    public async Task<ActionResult<User>> Login([FromBody] LoginDTO loginDTO)
    {
        try
        {
            var users = await _userContext.ReadAll(true, false);
            var user=users.FirstOrDefault(u => u.Email == loginDTO.Email);

            if (user == null || !BCrypt.Net.BCrypt.Verify(loginDTO.Password, user.Password))
            {
                return BadRequest("Invalid email or password");
            }

            return Ok(user);
        }
        catch (Exception)
        {
            return StatusCode(500, "Cannot process login request");
        }
    }
    [HttpGet("{id}")]
    public async Task<ActionResult<User>> GetById(int id, bool useNavigationalProperties = false)
    {
        try
        {
            var user = await _userContext.Read(id,useNavigationalProperties);
            if (user == null) return NotFound();
            return Ok(user);
        }
        catch
        {
            return StatusCode(500, "Cannot get the user!");
        }
    }
    
    [HttpPost]
    public async Task<ActionResult> Register([FromBody] User user)
    {
        var existingUsers = await _userContext.ReadAll();
        var checkUser = existingUsers.FirstOrDefault(u => u.Email == user.Email);
        if (checkUser != null)
        {
            return BadRequest("There is already a user with that email! ");
        }
        try
        {
            await _userContext.Create(user);
            return Created($"/api/users/{user.UserId}", user);
        }
        catch
        {
            return StatusCode(500, "Cannot create user!");
        }
    }
    [HttpPut("{id}")]
    public async Task<ActionResult> Update(int id, [FromBody] User user, bool useNavigationalProperties = false)
    {
        try
        {
            if (id != user.UserId) return BadRequest("ID mismatch!");
            await _userContext.Update(user, useNavigationalProperties);
            return NoContent();
        }
        catch
        {
            return StatusCode(500, "Cannot update user!");
        }
    }
    
    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(int id)
    {
        try
        {
            await _userContext.Delete(id);
            return NoContent();
        }
        catch
        {
            return StatusCode(500, "Cannot delete user!");
        }
    }
}