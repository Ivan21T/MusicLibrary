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
            user.Created = DateTime.Now;
            await _dbContext.AddAsync(user);
            await _dbContext.SaveChangesAsync();
        }

        public async Task<User> Read(int id, bool useNavigationProperties=false, bool isReadOnly=false)
        {
            IQueryable<User> query = _dbContext.Users;
            if (useNavigationProperties)
            {
                query = query.Include(u => u.AddedTracks)
                    .Include(u=>u.AddedAlbums);
            }
            if (isReadOnly)
            {
                query = query.AsNoTrackingWithIdentityResolution();
            }
            User user = await query.FirstOrDefaultAsync(u => u.UserId == id);
            if (user == null)
            {
                throw new Exception("User not found");  
            }

            return user;
        }

        public async Task<List<User>> ReadAll(bool useNavigationProperties = false, bool isReadOnly = false)
        {
            IQueryable<User> query = _dbContext.Users;
            if (useNavigationProperties)
            {
                query = query.Include(u => u.AddedTracks)
                    .Include(u=>u.AddedAlbums);
            }

            if (isReadOnly)
            {
                query = query.AsNoTrackingWithIdentityResolution();
            }
            
            return await query.ToListAsync();
        }

        public async Task Update(User user,bool useNavigationProperties=false)
        {
            var existingUser = await Read(user.UserId, false, false);
            if (existingUser == null)
            {
                throw new Exception("User not found");
            }
            existingUser.Username = user.Username;
            if (!string.IsNullOrEmpty(user.Password) && 
                !BCrypt.Net.BCrypt.Verify(user.Password, existingUser.Password))
            {
                existingUser.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);
            }

            if (useNavigationProperties)
            {
                List<Track> addedTracks = new List<Track>();
                List<Album> addedAlbums = new List<Album>();
                for (int i = 0; i<user.AddedTracks.Count; i++)
                {
                    Track  track = _dbContext.Tracks.Find(user.AddedTracks[i]);
                    if (track == null)
                    {
                        addedTracks.Add(track);
                    }
                    else
                    {
                        addedTracks.Add(user.AddedTracks[i]);
                    }
                }

                for (int j = 0; j < user.AddedAlbums.Count; j++)
                {
                    Album album = _dbContext.Albums.Find(user.AddedAlbums[j]);
                    if (album == null)
                    {
                        addedAlbums.Add(album);
                    }
                    else
                    {
                        addedAlbums.Add(user.AddedAlbums[j]);
                    }
                }
                existingUser.AddedTracks = addedTracks;
                existingUser.AddedAlbums = addedAlbums;
            }
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