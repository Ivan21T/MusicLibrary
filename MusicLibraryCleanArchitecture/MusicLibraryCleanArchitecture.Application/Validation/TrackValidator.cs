using FluentValidation;
using MusicLibraryCleanArchitecture.Application.DTOs;

namespace MusicLibraryCleanArchitecture.Application.Validation;

public class CreateTrackDtoValidator : AbstractValidator<CreateTrackDto>
{
	public CreateTrackDtoValidator()
	{
		RuleFor(x => x.Title).NotEmpty().MaximumLength(200);
		RuleFor(x => x.Duration).Must(d => d > TimeSpan.Zero).WithMessage("Duration must be positive.");
		RuleFor(x => x.Genre).NotEmpty().MaximumLength(100);
	}
}

public class UpdateTrackDtoValidator : AbstractValidator<UpdateTrackDto>
{
	public UpdateTrackDtoValidator()
	{
		RuleFor(x => x.Title).NotEmpty().MaximumLength(200);
		RuleFor(x => x.Duration).Must(d => d > TimeSpan.Zero).WithMessage("Duration must be positive.");
		RuleFor(x => x.Genre).NotEmpty().MaximumLength(100);
	}
}


