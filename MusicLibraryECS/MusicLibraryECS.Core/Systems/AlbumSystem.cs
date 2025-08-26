using Microsoft.EntityFrameworkCore;
using MusicLibraryECS.Core.Entities;
using MusicLibraryECS.Core.Components;
using MusicLibraryECS.Core.Models;
using MusicLibraryECS.Core.Data;
namespace MusicLibraryECS.Core.Systems;

public class AlbumSystem : ISystem
{
    private readonly EcsDbContext _context;
    public AlbumSystem(EcsDbContext context) => _context = context;
    public void Update() { }

    public Entity CreateAlbum(string title, DateTime releaseDate, Guid artistEntityId)
    {
        var entity = new Entity();
        var component = new AlbumComponent
        {
            EntityId = entity.Id,
            Title = title,
            ReleaseDate = releaseDate,
            ArtistEntityId = artistEntityId
        };
        entity.Components.Add(component);
        _context.Entities.Add(entity);
        _context.SaveChanges();
        return entity;
    }

    public Entity? GetAlbum(Guid id) => _context.Entities
        .Include(e => e.Components)            
        .FirstOrDefault(e => e.Id == id &&e.Components.OfType<AlbumComponent>().Any()); 

    public List<Entity> GetAllAlbums()
    {
        var entitiesWithComponents = _context.Entities
            .Include(e => e.Components)
            .ToList();
        
        var albums = entitiesWithComponents
            .Where(e => e.Components.OfType<AlbumComponent>().Any())
            .ToList();

        return albums;
    }

    public void UpdateAlbum(Guid id, string title, DateTime releaseDate, Guid artistEntityId)
    {
        var albumComponent = _context.Components.OfType<AlbumComponent>()
            .FirstOrDefault(c => c.EntityId == id);
        if (albumComponent != null)
        {
            albumComponent.Title = title;
            albumComponent.ReleaseDate = releaseDate;
            albumComponent.ArtistEntityId = artistEntityId;
            _context.SaveChanges();
        }
    }

    public void DeleteAlbum(Guid id)
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
        .Where(e => e.Components.OfType<AlbumComponent>().Any(a => a.ArtistEntityId == artistId))
        .ToList();

}