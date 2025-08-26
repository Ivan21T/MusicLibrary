using System;
using FluentAssertions;
using MusicLibraryECS.Core.Components;
using MusicLibraryECS.Core.Validators;
using Xunit;

namespace MusicLibraryECS.Tests.Validators;

public class AlbumComponentValidatorTests
{
    [Fact]
    public void Should_Fail_When_ReleaseDate_In_Future()
    {
        var validator = new AlbumComponentValidator();
        var component = new AlbumComponent
        {
            Title = "Test",
            ReleaseDate = DateTime.Now.AddDays(1),
            ArtistEntityId = Guid.NewGuid(),
            EntityId = Guid.NewGuid()
        };

        var result = validator.Validate(component);

        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.ErrorMessage.Contains("cannot be in the future"));
    }

    [Fact]
    public void Should_Pass_When_ReleaseDate_In_Past()
    {
        var validator = new AlbumComponentValidator();
        var component = new AlbumComponent
        {
            Title = "OK",
            ReleaseDate = DateTime.Now.AddDays(-10),
            ArtistEntityId = Guid.NewGuid(),
            EntityId = Guid.NewGuid()
        };

        var result = validator.Validate(component);

        result.IsValid.Should().BeTrue();
    }
}


