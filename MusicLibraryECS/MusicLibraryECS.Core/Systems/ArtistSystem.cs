using Microsoft.EntityFrameworkCore;
using MusicLibraryECS.Core.Entities;
using MusicLibraryECS.Core.Components;
using MusicLibraryECS.Core.Data;
using MusicLibraryECS.Core.Models;
namespace MusicLibraryECS.Core.Systems;

public class ArtistSystem : ISystem
{
    private readonly EcsDbContext _context;
    public ArtistSystem(EcsDbContext context) => _context = context;
    public void Update() { }
    
    public Entity CreateArtist(string firstName, string lastName, string pseudonym, string country)
    {
        var entity = new Entity();
        var component = new ArtistComponent
        {
            EntityId = entity.Id,
            FirstName = firstName,
            LastName = lastName,
            Pseudonym = pseudonym,
            Country = country
        };
        entity.Components.Add(component);
        _context.Entities.Add(entity);
        _context.SaveChanges();
        return entity;
    }

    public Entity? GetArtist(Guid id) => _context.Entities
        .Include(e => e.Components.OfType<ArtistComponent>())
        .FirstOrDefault(e => e.Id == id);

    public List<Entity> GetAllArtists() => _context.Entities
        .Include(e => e.Components.OfType<ArtistComponent>())
        .Where(e => e.Components.OfType<ArtistComponent>().Any())
        .ToList();

    public void UpdateArtist(Guid id, string firstName, string lastName, string pseudonym, string country)
    {
        var artistComponent = _context.Components.OfType<ArtistComponent>()
            .FirstOrDefault(c => c.EntityId == id);
        if (artistComponent != null)
        {
            artistComponent.FirstName = firstName;
            artistComponent.LastName = lastName;
            artistComponent.Pseudonym = pseudonym;
            artistComponent.Country = country;
            _context.SaveChanges();
        }
    }

    public void DeleteArtist(Guid id)
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

    public List<Entity> GetAlbumsByArtist(Guid artistId) => _context.Entities
        .Include(e => e.Components.OfType<AlbumComponent>())
        .Where(e => e.Components.OfType<AlbumComponent>().Any(a => a.ArtistEntityId == artistId))
        .ToList();

    public List<AlbumWithTracks> GetAlbumsWithTracksByArtist(Guid artistId)
    {
        var artist = _context.Components.OfType<ArtistComponent>()
            .FirstOrDefault(a => a.EntityId == artistId);
        
        if (artist == null) return new List<AlbumWithTracks>();

        var albums = _context.Components.OfType<AlbumComponent>()
            .Where(a => a.ArtistEntityId == artistId)
            .ToList();

        var result = new List<AlbumWithTracks>();

        foreach (var album in albums)
        {
            var tracks = _context.Components.OfType<TrackComponent>()
                .Where(t => t.AlbumEntityId == album.EntityId)
                .Select(t => new TrackInfo
                {
                    TrackId = t.EntityId,
                    Title = t.Title,
                    Duration = t.Duration,
                    Genre = t.Genre
                })
                .ToList();

            var albumWithTracks = new AlbumWithTracks
            {
                AlbumId = album.EntityId,
                Title = album.Title,
                ReleaseDate = album.ReleaseDate,
                Artist = new ArtistInfo
                {
                    ArtistId = artist.EntityId,
                    Name = $"{artist.FirstName} {artist.LastName}",
                    Pseudonym = artist.Pseudonym,
                    Country = artist.Country
                },
                Tracks = tracks
            };

            result.Add(albumWithTracks);
        }

        return result;
    }
}
