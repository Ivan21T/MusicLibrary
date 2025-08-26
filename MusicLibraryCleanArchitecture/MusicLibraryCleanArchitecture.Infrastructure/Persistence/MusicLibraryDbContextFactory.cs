using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using System.IO;

namespace MusicLibraryCleanArchitecture.Infrastructure.Persistence
{
    public class MusicLibraryDbContextFactory : IDesignTimeDbContextFactory<MusicLibraryDbContext>
    {
        public MusicLibraryDbContext CreateDbContext(string[] args)
        {
            var basePath = Path.Combine(Directory.GetCurrentDirectory(), "../MusicLibraryCleanArchitecture.API");

            var configuration = new ConfigurationBuilder()
                .SetBasePath(basePath)
                .AddJsonFile("appsettings.json", optional: false)
                .Build();


            var optionsBuilder = new DbContextOptionsBuilder<MusicLibraryDbContext>();
            
            var connectionString = configuration.GetConnectionString("DefaultConnection");
            optionsBuilder.UseSqlite<MusicLibraryDbContext>(connectionString);

            return new MusicLibraryDbContext(optionsBuilder.Options);
        }
    }
}