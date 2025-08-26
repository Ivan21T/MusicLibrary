using MusicLibraryECS.Core.Components;

namespace MusicLibraryECS.Core.Entities;

public class Entity
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public List<Component> Components { get; set; } = new List<Component>();
}