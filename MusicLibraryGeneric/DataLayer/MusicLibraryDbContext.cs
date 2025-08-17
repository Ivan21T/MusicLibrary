using Microsoft.EntityFrameworkCore;
using BusinessLayer;
namespace DataLayer;

public class MusicLibraryDbContext:DbContext
{
    public DbSet<User> Users { get; set; }
    public DbSet<Album> Albums { get; set; }
    public DbSet<Artist> Artists { get; set; }
    public DbSet<Track> Tracks { get; set; } 
    public DbSet<OTPCode> OTPCodes { get; set; }
    
    public MusicLibraryDbContext() : base()
    {
    }

    public MusicLibraryDbContext(DbContextOptions<MusicLibraryDbContext> options) : base(options)
    {
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        if (!optionsBuilder.IsConfigured)
        {
            optionsBuilder.UseSqlite("Data Source=MusicLibrary.db");
        }
        base.OnConfiguring(optionsBuilder);
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Track>()
            .HasOne(t => t.AddedBy) 
            .WithMany(u => u.AddedTracks)
            .OnDelete(DeleteBehavior.SetNull);
        
        modelBuilder.Entity<Album>()
            .HasOne(a => a.AddedBy) 
            .WithMany(u => u.AddedAlbums)
            .OnDelete(DeleteBehavior.SetNull);
    }
}