using FluentValidation;
using MusicLibraryCleanArchitecture.Application.DTOs;

namespace MusicLibraryCleanArchitecture.Application.Validation;

public class CreateAlbumDtoValidator : AbstractValidator<CreateAlbumDto>
{
	public CreateAlbumDtoValidator()
	{
		RuleFor(x => x.Title).NotEmpty().MaximumLength(200);
		RuleFor(x => x.ReleaseDate)
			.Must(d => d <= DateTime.UtcNow)
			.WithMessage("Release date cannot be in the future.");
	}
}

public class UpdateAlbumDtoValidator : AbstractValidator<UpdateAlbumDto>
{
	public UpdateAlbumDtoValidator()
	{
		RuleFor(x => x.Title).NotEmpty().MaximumLength(200);
		RuleFor(x => x.ReleaseDate)
			.Must(d => d <= DateTime.UtcNow)
			.WithMessage("Release date cannot be in the future.");
	}
}


