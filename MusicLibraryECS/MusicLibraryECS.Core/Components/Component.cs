namespace MusicLibraryECS.Core.Components;

public abstract class Component
{
    public Guid EntityId { get; set; }
    public Guid Id { get; set; } = Guid.NewGuid();
}