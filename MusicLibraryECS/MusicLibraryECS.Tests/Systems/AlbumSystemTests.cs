using System;
using System.Linq;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using MusicLibraryECS.Core.Components;
using MusicLibraryECS.Core.Data;
using MusicLibraryECS.Core.Systems;
using Xunit;

namespace MusicLibraryECS.Tests.Systems;

public class AlbumSystemTests
{
    private static EcsDbContext CreateInMemoryContext()
    {
        var options = new DbContextOptionsBuilder<EcsDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        return new EcsDbContext(options);
    }

    [Fact]
    public void Create_And_Get_Album()
    {
        using var context = CreateInMemoryContext();
        var system = new AlbumSystem(context);

        var artistEntityId = Guid.NewGuid();
        var album = system.CreateAlbum("Test Album", DateTime.UtcNow.AddDays(-1), artistEntityId);

        var fetched = system.GetAlbum(album.Id);
        fetched.Should().NotBeNull();
        fetched!.Components.OfType<AlbumComponent>().Single().Title.Should().Be("Test Album");
    }

    [Fact]
    public void Update_Album_Modifies_Component()
    {
        using var context = CreateInMemoryContext();
        var system = new AlbumSystem(context);
        var artistId = Guid.NewGuid();
        var album = system.CreateAlbum("Old", DateTime.UtcNow.AddYears(-1), artistId);

        system.UpdateAlbum(album.Id, "New", DateTime.UtcNow.AddYears(-2), artistId);

        var updated = context.Components.OfType<AlbumComponent>().Single(a => a.EntityId == album.Id);
        updated.Title.Should().Be("New");
    }

    [Fact]
    public void Delete_Album_Removes_Entity()
    {
        using var context = CreateInMemoryContext();
        var system = new AlbumSystem(context);
        var album = system.CreateAlbum("ToDelete", DateTime.UtcNow.AddDays(-5), Guid.NewGuid());

        system.DeleteAlbum(album.Id);

        context.Entities.Any(e => e.Id == album.Id).Should().BeFalse();
    }
}



