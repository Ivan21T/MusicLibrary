using System;
using System.Linq;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using MusicLibraryECS.Core.Components;
using MusicLibraryECS.Core.Data;
using MusicLibraryECS.Core.Entities;
using MusicLibraryECS.Core.Systems;
using Xunit;

namespace MusicLibraryECS.Tests.Systems;

public class TrackSystemTests
{
    private static EcsDbContext CreateInMemoryContext()
    {
        var options = new DbContextOptionsBuilder<EcsDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        return new EcsDbContext(options);
    }

    [Fact]
    public void Create_And_Get_Track_With_Details_Pipeline()
    {
        using var context = CreateInMemoryContext();
        var albumSystem = new AlbumSystem(context);
        var trackSystem = new TrackSystem(context);
        var trackArtistSystem = new TrackArtistSystem(context);

        var artist = new Entity();
        var artistComponent = new ArtistComponent
        {
            EntityId = artist.Id,
            FirstName = "John",
            LastName = "Doe",
            Pseudonym = "JD",
            Country = "US"
        };
        artist.Components.Add(artistComponent);
        context.Entities.Add(artist);
        context.SaveChanges();

        var album = albumSystem.CreateAlbum("A1", DateTime.UtcNow.AddDays(-10), artistComponent.EntityId);

        var track = trackSystem.CreateTrack("T1", TimeSpan.FromMinutes(3), album.Id, "Rock");
        trackArtistSystem.AddArtistToTrack(track.Id, artistComponent.EntityId);

        var byGenre = trackSystem.GetTracksWithDetailsByGenre("Rock");
        byGenre.Should().HaveCount(1);
        var details = byGenre.Single();
        details.Title.Should().Be("T1");
        details.Album.Title.Should().Be("A1");
        details.Artists.Should().ContainSingle(a => a.Name == "John Doe" && a.Pseudonym == "JD");
    }

    [Fact]
    public void Update_And_Delete_Track()
    {
        using var context = CreateInMemoryContext();
        var albumSystem = new AlbumSystem(context);
        var trackSystem = new TrackSystem(context);

        var album = albumSystem.CreateAlbum("A1", DateTime.UtcNow.AddDays(-10), Guid.NewGuid());
        var track = trackSystem.CreateTrack("OldT", TimeSpan.FromSeconds(30), album.Id, "Pop");

        trackSystem.UpdateTrack(track.Id, "NewT", TimeSpan.FromSeconds(45), album.Id, "Pop");
        var comp = context.Components.OfType<TrackComponent>().Single(t => t.EntityId == track.Id);
        comp.Title.Should().Be("NewT");

        trackSystem.DeleteTrack(track.Id);
        context.Entities.Any(e => e.Id == track.Id).Should().BeFalse();
    }
}


