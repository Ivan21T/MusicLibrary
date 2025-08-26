using FluentValidation;
using MusicLibraryECS.Core.Components;

namespace MusicLibraryECS.Core.Validators;
public class AlbumComponentValidator : AbstractValidator<AlbumComponent>
{
    public AlbumComponentValidator()
    {
        RuleFor(x => x.ReleaseDate)
            .Must(date => date <= DateTime.Now)
            .WithMessage("Album release date cannot be in the future.");
    }
}