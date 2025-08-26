using Microsoft.EntityFrameworkCore;
using MusicLibraryECS.Core.Entities;
using MusicLibraryECS.Core.Components;
using MusicLibraryECS.Core.Data;
using MusicLibraryECS.Core.Models;
namespace MusicLibraryECS.Core.Systems;

public class TrackSystem : ISystem
{
    private readonly EcsDbContext _context;
    public TrackSystem(EcsDbContext context) => _context = context;
    public void Update() { }

    public Entity CreateTrack(string title, TimeSpan duration, Guid albumEntityId, string genre)
    {
        var entity = new Entity();
        var component = new TrackComponent
        {
            EntityId = entity.Id,
            Title = title,
            Duration = duration,
            AlbumEntityId = albumEntityId,
            Genre = genre
        };
        entity.Components.Add(component);
        _context.Entities.Add(entity);
        _context.SaveChanges();
        return entity;
    }

    public Entity? GetTrack(Guid id) =>
        _context.Entities
            .FirstOrDefault(e => e.Id == id && e.Components.Any(c => c is TrackComponent));


    public List<Entity> GetAllTracks() => _context.Entities
        .Include(e => e.Components)  
        .Where(e => e.Components.OfType<TrackComponent>().Any())  
        .ToList();

    public void UpdateTrack(Guid id, string title, TimeSpan duration, Guid albumEntityId, string genre)
    {
        var trackComponent = _context.Components.OfType<TrackComponent>()
            .FirstOrDefault(c => c.EntityId == id);
        if (trackComponent != null)
        {
            trackComponent.Title = title;
            trackComponent.Duration = duration;
            trackComponent.AlbumEntityId = albumEntityId;
            trackComponent.Genre = genre;
            _context.SaveChanges();
        }
    }

    public void DeleteTrack(Guid id)
    {
        var entity = _context.Entities
            .Include(e => e.Components)
            .FirstOrDefault(e => e.Id == id);
        if (entity != null)
        {
            _context.Entities.Remove(entity);
            _context.SaveChanges();
        }
    }

    public List<Entity> GetTracksByGenre(string genre) => _context.Entities
        .Include(e => e.Components)  
        .Where(e => e.Components.OfType<TrackComponent>().Any(t => t.Genre == genre))
        .ToList();


    public List<TrackWithDetails> GetTracksWithDetailsByGenre(string genre)
    {
        var tracks = _context.Components.OfType<TrackComponent>()
            .Where(t => t.Genre == genre)
            .ToList();

        var result = new List<TrackWithDetails>();

        foreach (var track in tracks)
        {
            var album = _context.Components.OfType<AlbumComponent>()
                .FirstOrDefault(a => a.EntityId == track.AlbumEntityId);
            
            var albumArtist = album != null ? _context.Components.OfType<ArtistComponent>()
                .FirstOrDefault(a => a.EntityId == album.ArtistEntityId) : null;

            var trackArtists = _context.Components.OfType<TrackArtistComponent>()
                .Where(ta => ta.TrackEntityId == track.EntityId)
                .ToList();

            var artists = new List<ArtistInfo>();
            
            foreach (var trackArtist in trackArtists)
            {
                var artist = _context.Components.OfType<ArtistComponent>()
                    .FirstOrDefault(a => a.EntityId == trackArtist.ArtistEntityId);
                
                if (artist != null)
                {
                    artists.Add(new ArtistInfo
                    {
                        ArtistId = artist.EntityId,
                        Name = $"{artist.FirstName} {artist.LastName}",
                        Pseudonym = artist.Pseudonym,
                        Country = artist.Country
                    });
                }
            }

            var trackWithDetails = new TrackWithDetails
            {
                TrackId = track.EntityId,
                Title = track.Title,
                Duration = track.Duration,
                Genre = track.Genre,
                Album = album != null ? new AlbumInfo
                {
                    AlbumId = album.EntityId,
                    Title = album.Title,
                    ReleaseDate = album.ReleaseDate
                } : new AlbumInfo(),
                Artists = artists
            };

            result.Add(trackWithDetails);
        }

        return result;
    }
}
