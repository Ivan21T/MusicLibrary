using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BusinessLayer;

public class Album
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int AlbumId { get; set; }
    
    [StringLength(50, ErrorMessage = "Album title cannot exceed 50 characters")]
    [Required]
    public string Title { get; set; }
    
    [CustomValidation(typeof(Validator),nameof(Validator.ValidateReleaseDate))]
    [Required]
    public DateTime ReleaseDate{get;set;}
    
    public Artist Artist{get;set;}
    public User AddedBy{get;set;}
    public List<Track> Tracks { get; set; }

    public Album()
    {
        Tracks = new List<Track>();
    }

    public Album(string title, DateTime releaseDate)
    {
        Title = title;
        ReleaseDate = releaseDate;
        Tracks = new List<Track>();
    }

    public Album(string title, DateTime releaseDate, User addedBy)
        :this(title, releaseDate)
    {
        AddedBy = addedBy;
    }
}