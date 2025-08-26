using System;
using FluentAssertions;
using MusicLibraryECS.Core.Components;
using MusicLibraryECS.Core.Validators;
using Xunit;

namespace MusicLibraryECS.Tests.Validators;

public class TrackComponentValidatorTests
{
    [Fact]
    public void Should_Fail_When_Duration_NonPositive()
    {
        var validator = new TrackComponentValidator();
        var component = new TrackComponent
        {
            Title = "X",
            Duration = TimeSpan.Zero,
            AlbumEntityId = Guid.NewGuid(),
            Genre = "Pop",
            EntityId = Guid.NewGuid()
        };

        var result = validator.Validate(component);

        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.ErrorMessage.Contains("must be a positive"));
    }

    [Fact]
    public void Should_Pass_When_Duration_Positive()
    {
        var validator = new TrackComponentValidator();
        var component = new TrackComponent
        {
            Title = "Y",
            Duration = TimeSpan.FromSeconds(10),
            AlbumEntityId = Guid.NewGuid(),
            Genre = "Rock",
            EntityId = Guid.NewGuid()
        };

        var result = validator.Validate(component);

        result.IsValid.Should().BeTrue();
    }
}


