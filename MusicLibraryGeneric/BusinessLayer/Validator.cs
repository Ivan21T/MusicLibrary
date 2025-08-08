using System.ComponentModel.DataAnnotations;

namespace BusinessLayer;

public class Validator
{
    public static ValidationResult ValidateReleaseDate(DateTime releaseDate, ValidationContext context)
    {
        if (releaseDate > DateTime.Now)
        {
            return new ValidationResult("Release date cannot be in the future.");
        }
        return ValidationResult.Success;
    }
}

