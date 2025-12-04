namespace CvMaker.Api.DTOs;

public record ResetPasswordDto(string Email, string Token, string NewPassword);
