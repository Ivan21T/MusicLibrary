using System.ComponentModel.DataAnnotations;

namespace BusinessLayer;

public class OTPCode
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    public string Email { get; set; }
    
    [Required]
    public string Code { get; set; }
    
    [Required]
    public DateTime ExpiryTime { get; set; }
}