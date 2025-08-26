using Microsoft.EntityFrameworkCore;
using MusicLibraryECS.Core.Models;
using MusicLibraryECS.Core.Components;
using MusicLibraryECS.Core.Entities;

namespace MusicLibraryECS.Core.Data;
public class EcsDbContext : DbContext
{
    public EcsDbContext(DbContextOptions<EcsDbContext> options) : base(options) { }
    public DbSet<Entity> Entities { get; set; }
    public DbSet<Component> Components { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Entity>().HasKey(e => e.Id);
        modelBuilder.Entity<Component>().HasKey(c => c.Id);
        modelBuilder.Entity<Component>()
            .HasOne<Entity>()
            .WithMany(e => e.Components)
            .HasForeignKey(c => c.EntityId);
        modelBuilder.Entity<Component>()
            .HasDiscriminator<string>("ComponentType")
            .HasValue<ArtistComponent>("Artist")
            .HasValue<AlbumComponent>("Album")
            .HasValue<TrackComponent>("Track")
            .HasValue<TrackArtistComponent>("TrackArtist");
    }
}