using System.ComponentModel.DataAnnotations.Schema;

namespace CvMaker.Api.Models;

public class CoverLetter
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public User? User { get; set; }
    public string Title { get; set; } = string.Empty;
    public string JobTitle { get; set; } = string.Empty;
    public string Company { get; set; } = string.Empty;
    
    [Column(TypeName = "json")]
    public string Data { get; set; } = "{}"; // Stores recipient details, body paragraphs, etc.
    
    public string Template { get; set; } = "midnight";
    public int? CvId { get; set; } // Optional: link to a source CV for syncing personal info
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
