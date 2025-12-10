namespace CvMaker.Api.Models;

public class User
{
    public int Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? RefreshToken { get; set; }
    public DateTime? RefreshTokenExpiryTime { get; set; }
    public byte[]? ProfilePicture { get; set; }
    public string? AvatarUrl { get; set; } // External URL if ProfilePicture is null
    public string? GoogleId { get; set; }
    public string? LinkedInId { get; set; }
    public string? GitHubId { get; set; }
    public string? ResetToken { get; set; }
    public DateTime? ResetTokenExpiry { get; set; }
}
