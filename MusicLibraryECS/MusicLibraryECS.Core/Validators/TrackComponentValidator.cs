using FluentValidation;
using MusicLibraryECS.Core.Components;

namespace MusicLibraryECS.Core.Validators;
public class TrackComponentValidator : AbstractValidator<TrackComponent>
{
    public TrackComponentValidator()
    {
        RuleFor(x => x.Duration)
            .Must(duration => duration.TotalSeconds > 0)
            .WithMessage("Track duration must be a positive number.");
    }
}