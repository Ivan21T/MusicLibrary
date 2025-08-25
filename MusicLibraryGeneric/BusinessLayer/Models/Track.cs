using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace BusinessLayer;

public class Track
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int TrackId { get; set; }
    
    [Required]
    [StringLength(50,ErrorMessage ="Title must be 50 characters or less")]
    public string Title { get; set; }
    public Album? Album { get; set; }
    public List<Artist> Artists { get; set; }
    
    [Required]
    [EnumDataType(typeof(Genre), ErrorMessage = "Invalid genre value")]
    public Genre Genre { get; set; }
    
    public string ImageData { get; set; }
    
    [Required]
    public string MusicData { get; set; }
    public User? AddedBy { get; set; } 

    public Track()
    {
        Artists = new List<Artist>();
    }

    public Track(string title, Genre genre,string musicData)
    {
        Artists = new List<Artist>();
        Title = title;
        Genre = genre;
        MusicData=musicData;
    }

    public Track(string title,Genre genre, string musicData, string imageData)
        : this(title, genre, musicData)
    {
        ImageData = imageData;
    }
    public Track(string title, Genre genre, string musicData, User addedBy)
        : this(title,  genre, musicData)
    {
        AddedBy = addedBy;
    }

    public Track(string title, Genre genre, string musicData, string imageData, User addedBy)
        : this(title, genre, musicData, imageData)
    {
        AddedBy = addedBy;
    }
    public Track(string title, Genre genre, string musicData, string imageData, User addedBy,Album album)
        : this(title, genre, musicData, imageData, addedBy)
    {
        Album = album;
    }
}