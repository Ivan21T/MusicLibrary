using BusinessLayer;
using Microsoft.EntityFrameworkCore;

namespace DataLayer;

public class TrackContext:IDb<Track,int>
{
    private readonly MusicLibraryDbContext _dbContext;
    public TrackContext(MusicLibraryDbContext dbContext)
    {
        _dbContext = dbContext;
    }
    public async Task Create(Track track)
    {
        if (track.Album != null)
        {
            var existingAlbum = await _dbContext.Albums
                .FirstOrDefaultAsync(a => a.AlbumId == track.Album.AlbumId);

            if (existingAlbum != null)
            {
                track.Album = existingAlbum; 
            }
            else
            {
                _dbContext.Entry(track.Album).State = EntityState.Added; 
            }
        }
        var attachedArtists = new List<Artist>();
        foreach (var artist in track.Artists)
        {
            var existingArtist = await _dbContext.Artists
                .FirstOrDefaultAsync(a => a.ArtistId == artist.ArtistId);

            if (existingArtist != null)
            {
                attachedArtists.Add(existingArtist);
            }
            else
            {
                attachedArtists.Add(artist); 
            }
        }
        track.Artists = attachedArtists;
        
        if (track.AddedBy != null)
        {
            var existingUser = await _dbContext.Users
                .FirstOrDefaultAsync(u => u.UserId == track.AddedBy.UserId);

            if (existingUser != null)
            {
                track.AddedBy = existingUser;
            }
            else
            {
                _dbContext.Entry(track.AddedBy).State = EntityState.Added;
            }
        }
        
        await _dbContext.Tracks.AddAsync(track);
        await _dbContext.SaveChangesAsync();
    }


    public async Task<Track> Read(int id, bool useNavigationalProperties = false, bool isReadOnly = false)
    {
        IQueryable<Track> query = _dbContext.Tracks.AsNoTracking();
        if (isReadOnly)
        {
            query = query.AsNoTracking();
        }

        if (useNavigationalProperties)
        {
            query=query.Include(track => track.Album)
                .Include(track => track.Artists)
                .Include(track=>track.AddedBy);
        }
        Track track=await query.FirstOrDefaultAsync(t=>t.TrackId==id);
        if (track == null)
        {
            throw new Exception("Track not found");
        }
        return track;
    }

    public async Task<List<Track>> ReadAll(bool useNavigationProperties = false, bool isReadOnly = false)
    {
        IQueryable<Track> query = _dbContext.Tracks.AsQueryable();
        if (useNavigationProperties)
        {
            query = query.Include(t => t.Album)
                .Include(t => t.Artists)
                .Include(t => t.AddedBy);
        }
        if (isReadOnly)
        {
            query = query.AsNoTrackingWithIdentityResolution();
        }
        return  await query.ToListAsync();
    }

    public async Task Update(Track track,bool useNavigationalProperties = false)
    {
        Track trackFromDb = await Read(track.TrackId, false, false);
        if (trackFromDb == null)
        {
            throw new Exception("Track not found");
            
        }
        trackFromDb.Title=track.Title;
        trackFromDb.Genre=track.Genre;
        if (useNavigationalProperties)
        {
            List<Artist> artists = new List<Artist>();
            for (int i = 0; i < trackFromDb.Artists.Count; i++)
            {
                Artist artist=_dbContext.Artists.Find(trackFromDb.Artists[i]);
                if (artist == null)
                {
                    artists.Add(trackFromDb.Artists[i]);
                }
                else
                {
                    artists.Add(artist);
                }
            }
            trackFromDb.Artists = artists;
        }
        await _dbContext.SaveChangesAsync();
    }

    public async Task Delete(int id)
    {
        var track = await Read(id, false, false);
        if (track == null)
        {
            throw new Exception("Track not found");
        }
        _dbContext.Tracks.Remove(track);
        await _dbContext.SaveChangesAsync();
    }
}