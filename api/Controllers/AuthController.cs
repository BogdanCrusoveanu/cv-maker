using CvMaker.Api.Services;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;

namespace CvMaker.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AuthService _authService;

    public AuthController(AuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterDto dto)
    {
        var user = await _authService.RegisterAsync(dto.Email, dto.Password, dto.Name);
        if (user == null) return BadRequest("User already exists");
        return Ok(new { message = "User registered successfully" });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto model)
    {
        var result = await _authService.LoginAsync(model.Email, model.Password);
        if (result == null)
            return Unauthorized("Invalid credentials");

        return Ok(new { token = result.Value.AccessToken, refreshToken = result.Value.RefreshToken, name = result.Value.Name });
    }

    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh([FromBody] RefreshTokenDto model)
    {
        var result = await _authService.RefreshTokenAsync(model.Token, model.RefreshToken);
        if (result == null)
            return BadRequest("Invalid token");

        return Ok(new { token = result.Value.AccessToken, refreshToken = result.Value.RefreshToken });
    }

    [HttpPost("upload-photo")]
    [Authorize]
    public async Task<IActionResult> UploadPhoto(IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest("No file uploaded");

        var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userIdStr == null || !int.TryParse(userIdStr, out int userId))
            return Unauthorized();

        using var memoryStream = new MemoryStream();
        await file.CopyToAsync(memoryStream);
        var success = await _authService.UploadProfilePictureAsync(userId, memoryStream.ToArray());

        if (!success) return BadRequest("Failed to upload photo");
        return Ok();
    }

    [HttpGet("photo")]
    [Authorize]
    public async Task<IActionResult> GetPhoto()
    {
        var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userIdStr == null || !int.TryParse(userIdStr, out int userId))
            return Unauthorized();

        var photo = await _authService.GetProfilePictureAsync(userId);
        if (photo == null) return NotFound();

        return File(photo, "image/jpeg");
    }
    [HttpPost("change-password")]
    [Authorize]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto model)
    {
        var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userIdStr == null || !int.TryParse(userIdStr, out int userId))
            return Unauthorized();

        var success = await _authService.ChangePasswordAsync(userId, model.CurrentPassword, model.NewPassword);
        if (!success) return BadRequest("Failed to change password. Check your current password.");

        return Ok(new { message = "Password changed successfully" });
    }

    [HttpDelete("delete-account")]
    [Authorize]
    public async Task<IActionResult> DeleteAccount()
    {
        var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userIdStr == null || !int.TryParse(userIdStr, out int userId))
            return Unauthorized();

        var success = await _authService.DeleteAccountAsync(userId);
        if (!success) return NotFound("User not found");

        return Ok(new { message = "Account deleted successfully" });
    }

    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto dto)
    {
        var token = await _authService.ForgotPasswordAsync(dto.Email);
        if (token == null) return NotFound("Email not found");

        // In a real app, send email. Here we return the token for testing.
        return Ok(new { message = "Reset token generated", token });
    }

    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto dto)
    {
        var success = await _authService.ResetPasswordAsync(dto.Email, dto.Token, dto.NewPassword);
        if (!success) return BadRequest("Invalid or expired token");

        return Ok(new { message = "Password reset successfully" });
    }
}

public record ChangePasswordDto(string CurrentPassword, string NewPassword);
public record ForgotPasswordDto(string Email);
public record ResetPasswordDto(string Email, string Token, string NewPassword);

public record RegisterDto(string Email, string Password, string Name);

public class LoginDto
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public class RefreshTokenDto
{
    public string Token { get; set; } = string.Empty;
    public string RefreshToken { get; set; } = string.Empty;
}
