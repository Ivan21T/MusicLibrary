using MusicLibraryECS.Core.Entities;
using MusicLibraryECS.Core.Components;
using MusicLibraryECS.Core.Data;
using MusicLibraryECS.Core.Models;
namespace MusicLibraryECS.Core.Systems;

public class TrackArtistSystem : ISystem
{
    private readonly EcsDbContext _context;
    public TrackArtistSystem(EcsDbContext context) => _context = context;
    public void Update() { }

    public void AddArtistToTrack(Guid trackEntityId, Guid artistEntityId)
    {
        var entity = new Entity();
        var component = new TrackArtistComponent
        {
            EntityId = entity.Id,
            TrackEntityId = trackEntityId,
            ArtistEntityId = artistEntityId
        };
        entity.Components.Add(component);
        _context.Entities.Add(entity);
        _context.SaveChanges();
    }

    public List<Guid> GetArtistsForTrack(Guid trackEntityId) => _context.Components
        .OfType<TrackArtistComponent>()
        .Where(ta => ta.TrackEntityId == trackEntityId)
        .Select(ta => ta.ArtistEntityId)
        .ToList();

    public List<Guid> GetTracksForArtist(Guid artistEntityId) => _context.Components
        .OfType<TrackArtistComponent>()
        .Where(ta => ta.ArtistEntityId == artistEntityId)
        .Select(ta => ta.TrackEntityId)
        .ToList();
}