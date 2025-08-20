using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BusinessLayer;

public class Artist
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int ArtistId { get; set; }
    
    [Required(ErrorMessage = "First name is required")]
    [StringLength(35, ErrorMessage = "First name cannot exceed 35 characters")] 
    public string FirstName { get; set; }
    
    [Required(ErrorMessage = "Last name is required")]
    [StringLength(35, ErrorMessage = "Last name cannot exceed 35 characters")]
    public string LastName { get; set; }
    
    [StringLength(35, ErrorMessage = "Pseudonim cannot exceed 35 characters")]
    public string Pseudonim { get; set; }
    
    [Required(ErrorMessage = "Country is required")]
    [StringLength(35, ErrorMessage = "Country cannot exceed 35 characters")]
    public string Country { get; set; }
    
    public List<Track> Tracks { get; set; }
    public List<Album> Albums { get; set; }
    public Artist()
    {
        Tracks = new List<Track>();
        Albums = new List<Album>();
    }

    public Artist(string firstName, string lastName, string pseudonim, string country)
    {
        FirstName = firstName;
        LastName = lastName;
        Pseudonim = pseudonim;
        Country = country;
        Tracks = new List<Track>();
        Albums = new List<Album>();
    }
}