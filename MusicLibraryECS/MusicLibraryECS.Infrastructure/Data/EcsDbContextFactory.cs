using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using MusicLibraryECS.Core.Data;

namespace MusicLibraryECS.Infrastructure.Data;
public class EcsDbContextFactory : IDesignTimeDbContextFactory<EcsDbContext>
{
    public EcsDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<EcsDbContext>();
        optionsBuilder.UseSqlite("Data source=music_library_ecs");
        return new EcsDbContext(optionsBuilder.Options);
    }
}