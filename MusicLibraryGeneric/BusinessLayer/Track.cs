using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BusinessLayer;

public class Track
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int TrackId { get; set; }
    
    [Required]
    [StringLength(50,ErrorMessage ="Title must be 50 characters or less")]
    public string Title { get; set; }
    
    [Range(0.1, double.MaxValue, ErrorMessage = "Duration must be positive")]
    public double Duration { get; set; }
    
    public Album Album { get; set; }
    public List<Artist> Artists { get; set; }
    
    [Required]
    [StringLength(30,ErrorMessage ="Genre must be 30 characters or less")]
    public string Genre { get; set; }

    private Track()
    {
        Artists = new List<Artist>();
    }

    public Track(string title, double duration,string genre)
    {
        Artists = new List<Artist>();
        Title = title;
        Duration = duration;
        Genre = genre;
    }
}