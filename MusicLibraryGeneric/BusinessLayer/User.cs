using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace BusinessLayer;

[Index(nameof(Email), IsUnique = true)]
public class User
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int UserId { get; set; }
    [Required]
    [StringLength(20,ErrorMessage ="Username must be 20 characters or less")]
    public string Username { get; set; }
    [Required]
    [EmailAddress(ErrorMessage = "Invalid email format")]   
    public string Email { get; set; }
    [Required]
    public string Password { get; set; }

    private User()
    {
        
    }

    public User(string email, string username,string password)
    {
        Email = email;
        Username = username;
        Password = password;
    }
}