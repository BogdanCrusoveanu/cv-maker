using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Nodes;

namespace CvMaker.Api.Models;

public class Cv
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public User? User { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? PublicToken { get; set; }
    
    
    [Column(TypeName = "json")]
    public string Data { get; set; } = "{}"; 
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
