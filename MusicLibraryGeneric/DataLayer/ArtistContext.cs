using BusinessLayer;
using Microsoft.EntityFrameworkCore;

namespace DataLayer;

public class ArtistContext:IDb<Artist,int>
{
    private readonly MusicLibraryDbContext _dbContext;

    public ArtistContext(MusicLibraryDbContext dbContext)
    {
        _dbContext = dbContext;
    }
    public async Task Create(Artist artist)
    {
        await _dbContext.AddAsync(artist);
        await _dbContext.SaveChangesAsync();
    }
    public async Task<Artist> Read(int id, bool useNavigationProperties = false, bool isReadOnly = false)
    {
        IQueryable<Artist> query = _dbContext.Artists;
        if (isReadOnly)
        {
            query = query.AsNoTrackingWithIdentityResolution();
        }

        if (useNavigationProperties)
        {
            query = query.Include(a => a.Tracks)
                .Include(a => a.Albums);
        }
        Artist artist = await query.FirstOrDefaultAsync(a => a.ArtistId == id);
        if (artist == null)
        {
            throw new Exception("Artist not found");  
        }
        return artist;
    }

    public async Task<List<Artist>> ReadAll(bool useNavigationProperties = false, bool isReadOnly = false)
    {
        IQueryable<Artist> query = _dbContext.Artists;
        if (isReadOnly)
        {
            query = query.AsNoTrackingWithIdentityResolution();
        }

        if (useNavigationProperties)
        {
            query = query.Include(a => a.Tracks)
                .Include(a => a.Albums);
        }
        return await query.ToListAsync();
    }
    public async Task Update(Artist artist,bool useNavigationProperties=false)
    {
        var artistFromDb = await Read(artist.ArtistId);
        if (artistFromDb == null)
        {
            throw new Exception("Artist not found");
        }
        artistFromDb.FirstName = artist.FirstName;
        artistFromDb.LastName = artist.LastName;
        artistFromDb.Pseudonim = artist.Pseudonim;
        artistFromDb.Country = artist.Country;
        if (useNavigationProperties)
        {
            List<Track> tracks = new  List<Track>();
            List<Album> albums = new  List<Album>();
            for (int i = 0; i < artistFromDb.Tracks.Count; i++)
            {
                Track track = _dbContext.Tracks.Find(artistFromDb.Tracks[i]);
                if (track != null)
                {
                    tracks.Add(track);
                }
                else
                {
                    tracks.Add(artistFromDb.Tracks[i]);
                }
            }

            for (int i = 0; i < artistFromDb.Albums.Count; i++)
            {
                Album album = _dbContext.Albums.Find(artistFromDb.Albums[i]);
                if (album != null)
                {
                    albums.Add(album);
                }
                else
                {
                    albums.Add(artistFromDb.Albums[i]);
                }
            }
            artistFromDb.Tracks = tracks;
            artistFromDb.Albums = albums;
        }
        
    }

    public async Task Delete(int id)
    {
        var artist = await _dbContext.Artists.FirstOrDefaultAsync(a => a.ArtistId == id);
        if (artist!=null)
        {
            _dbContext.Artists.Remove(artist);
            await _dbContext.SaveChangesAsync();
        }
    }
}