using FluentAssertions;
using MusicLibraryCleanArchitecture.Application.DTOs;
using MusicLibraryCleanArchitecture.Application.Validation;

namespace MusicLibraryCleanArchitecture.Tests;

public class ValidationTests
{
	[Fact]
	public void TrackValidator_Should_Fail_For_NonPositive_Duration()
	{
		var validator = new CreateTrackDtoValidator();
		var dto = new CreateTrackDto("Song", TimeSpan.Zero, "Pop", 1, null);
		var result = validator.Validate(dto);
		result.IsValid.Should().BeFalse();
	}

	[Fact]
	public void AlbumValidator_Should_Fail_For_Future_Date()
	{
		var validator = new CreateAlbumDtoValidator();
		var future = DateTime.UtcNow.AddDays(1);
		var dto = new CreateAlbumDto("Album", future, 1);
		var result = validator.Validate(dto);
		result.IsValid.Should().BeFalse();
	}
}
