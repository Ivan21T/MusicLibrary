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
    private readonly MusicLibraryDbContext _dbContext;
    public UsersController(IDb<User,int> userContext,MusicLibraryDbContext dbContext)
    {
        _userContext = userContext;
        _dbContext = dbContext;
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
            var user = await _dbContext.Users
                .FirstOrDefaultAsync(u => u.Email == loginDTO.Email);

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
    [HttpPut]
    public async Task<ActionResult> Update([FromBody] User user, bool useNavigationalProperties = false)
    {
        try
        {
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
    [HttpPost("send-otp")]
    public async Task<IActionResult> SendOTP([FromBody] string email)
    {
        var user = await _dbContext.Users
            .FirstOrDefaultAsync(u => u.Email == email);
        if (user == null)
        {
            return BadRequest("User with that email doesn't exist!");
        }
        var otp = new Random().Next(100000, 999999).ToString();
        var expiryTime = DateTime.Now.AddMinutes(15);
        
        var existingOtps = await _dbContext.OTPCodes
            .Where(o => o.Email == email)
            .ToListAsync();
        _dbContext.OTPCodes.RemoveRange(existingOtps);
        
        await _dbContext.OTPCodes.AddAsync(new OTPCode
        {
            Email = email,
            Code = otp,
            ExpiryTime = expiryTime
        });
        await _dbContext.SaveChangesAsync();

        return Ok(new { email,otp, expiryTime });
    }
    [HttpPost("check-otp")]
    public async Task<IActionResult> CheckOtp([FromBody] CheckOtpDTO request)
    {
        var otpObject = _dbContext.OTPCodes.FirstOrDefault(o => o.Email == request.Email);

        if (otpObject == null)
            return BadRequest("Please resend!");

        if (DateTime.Now > otpObject.ExpiryTime)
        {
            _dbContext.OTPCodes.Remove(otpObject);
            await _dbContext.SaveChangesAsync();
            return BadRequest("OTP expired! Get new code!");
        }
        
        if (otpObject.Code == request.Code)
        {
            _dbContext.OTPCodes.Remove(otpObject);
            await _dbContext.SaveChangesAsync();
            return Ok();
        }

        return BadRequest("OTP code doesn't match!");
    }
    
    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDTO request)
    {
        var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
        if (user == null) 
            return BadRequest("User not found");

        user.Password = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
        await _dbContext.SaveChangesAsync();

        return Ok("Password reset successful");
    }
}