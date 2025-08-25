using BusinessLayer;
using Microsoft.EntityFrameworkCore;

namespace DataLayer;

public class AlbumContext:IDb<Album,int>
{
    private readonly MusicLibraryDbContext _dbContext;

    public AlbumContext(MusicLibraryDbContext dbContext)
    {
        _dbContext = dbContext;
    }
    public async Task Create(Album album)
    {
        if (album.Artist != null)
        {
            var existingArtist = await _dbContext.Artists.FirstOrDefaultAsync(a => a.ArtistId == album.Artist.ArtistId);
            if (existingArtist != null)
            {
                album.Artist = existingArtist;
            }
            else
            {
                _dbContext.Entry(album.Artist).State = EntityState.Added;
            }
        }
        var attachedTracks= new List<Track>();
        foreach (var track in album.Tracks)
        {
            var existingTrack=await _dbContext.Tracks.FirstOrDefaultAsync(t => t.TrackId == track.TrackId);
            if (existingTrack != null)
            {
                attachedTracks.Add(existingTrack);
            }
            else
            {
                attachedTracks.Add(track);
            }
        }
        album.Tracks = attachedTracks;
        if (album.AddedBy != null)
        {
            var existingUser=await _dbContext.Users.FirstOrDefaultAsync(u => u.UserId == album.AddedBy.UserId);
            if (existingUser != null)
            {
                album.AddedBy = existingUser;
            }
            else
            {
                _dbContext.Entry(album.AddedBy).State = EntityState.Added;
            }
        }
        
        await _dbContext.Albums.AddAsync(album);
        await _dbContext.SaveChangesAsync();
    }

    public async Task<List<Album>> ReadAll(bool useNavigationProperties = false, bool isReadOnly = false)
    {
        IQueryable<Album> query = _dbContext.Albums;
        if (useNavigationProperties)
        {
            query = query.Include(a => a.AddedBy)
                .Include(a=>a.Tracks)
                .Include(a => a.Artist);
        }

        if (isReadOnly)
        {
            query = query.AsNoTrackingWithIdentityResolution();
        }
            
        return await query.ToListAsync();
    }

    public async Task<Album> Read(int id, bool useNavigationProperties = false, bool isReadOnly = false)
    {
        IQueryable<Album> query = _dbContext.Albums;
        if (useNavigationProperties)
        {
            query = query.Include(a => a.AddedBy)
                .Include(a=>a.Tracks)
                .Include(a => a.Artist);
        }
        if (isReadOnly)
        {
            query = query.AsNoTrackingWithIdentityResolution();
        }
        Album album = await query.FirstOrDefaultAsync(a => a.AlbumId == id);
        if (album == null)
        {
            throw new Exception("User not found");  
        }

        return album;
    }

    public async Task Update(Album album, bool useNavigationProperties = false)
    {
        var existingAlbum=await Read(album.AlbumId, useNavigationProperties);
        if (existingAlbum == null)
        {
            throw new Exception("Album not found");
        }
        existingAlbum.Title=album.Title;
        existingAlbum.ReleaseDate=album.ReleaseDate;
        if (useNavigationProperties)
        {
            List<Track> addedTracks = new List<Track>();
            for (int i = 0; i < album.Tracks.Count; i++)
            {
                Track track = _dbContext.Tracks.Find(album.Tracks[i]);
                if (track == null)
                {
                    addedTracks.Add(album.Tracks[i]);
                }
                else
                {
                    addedTracks.Add(track);
                }
            }
            album.Tracks = addedTracks;
        }
        await _dbContext.SaveChangesAsync();
    }

    public async Task Delete(int id)
    {
        var album = await _dbContext.Albums.FirstOrDefaultAsync(a => a.AlbumId == id);
        if (album != null)
        {
            _dbContext.Albums.Remove(album);
            await _dbContext.SaveChangesAsync();
        }
    }
}