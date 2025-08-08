using BusinessLayer;
using Microsoft.EntityFrameworkCore;

namespace DataLayer;

public class UserContext:IDb<User,int>
{
    private readonly MusicLibraryDbContext _dbContext;

    public UserContext(MusicLibraryDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task Create(User user)
    {
        user.Password=BCrypt.Net.BCrypt.HashPassword(user.Password);
        await _dbContext.AddAsync(user);
        await _dbContext.SaveChangesAsync();
    }

    public async Task<User> Read(int id, bool useNavigationProperties=false, bool isReadOnly=false)
    {
        return await _dbContext.Users.FirstOrDefaultAsync(u => u.UserId == id);
    }

    public async Task<List<User>> ReadAll(bool useNavigationProperties = false, bool isReadOnly = false)
    {
        return await _dbContext.Users.ToListAsync();
    }

    public async Task Update(User user,bool useNavigationProperties=false)
    {
        var existingUser = await Read(user.UserId, false, false);
        if (existingUser == null)
        {
            throw new InvalidOperationException("User not found");
        }
        existingUser.Username = user.Username;
        await _dbContext.SaveChangesAsync();
    }

    public async Task Delete(int id)
    {
        var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.UserId == id);
        if (user != null)
        {
            _dbContext.Users.Remove(user);
            await _dbContext.SaveChangesAsync();
        }
    }
}