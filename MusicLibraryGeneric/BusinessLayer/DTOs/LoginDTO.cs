using System.ComponentModel.DataAnnotations;
namespace BusinessLayer;

public class LoginDTO
{
    [Required]
    [EmailAddress(ErrorMessage = "Invalid email format")]
    public string Email { get; set; }

    [Required]
    public string Password { get; set; }
}