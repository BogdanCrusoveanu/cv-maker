using CvMaker.Api.Services;
using CvMaker.Api.DTOs;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.RateLimiting;

namespace CvMaker.Api.Controllers;

/// <summary>
/// Controller for handling user authentication and account management.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AuthService _authService;
    private readonly RsaKeyService _rsaKeyService;

    public AuthController(AuthService authService, RsaKeyService rsaKeyService)
    {
        _authService = authService;
        _rsaKeyService = rsaKeyService;
    }

    /// <summary>
    /// Retrieves the RSA public key for client-side password encryption.
    /// </summary>
    /// <returns>The RSA public key in XML format.</returns>
    [HttpGet("public-key")]
    [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
    public IActionResult GetPublicKey()
    {
        return Ok(new { publicKey = _rsaKeyService.GetPublicKey() });
    }

    /// <summary>
    /// Registers a new user.
    /// </summary>
    /// <param name="dto">The registration details including encrypted password.</param>
    /// <returns>A success message if registration is successful.</returns>
    [HttpPost("register")]
    [EnableRateLimiting("AuthRateLimit")]
    [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Register(RegisterDto dto)
    {
        var decryptedPassword = _rsaKeyService.Decrypt(dto.Password);
        if (decryptedPassword == null) return BadRequest("Invalid password encryption");

        var user = await _authService.RegisterAsync(dto.Email, decryptedPassword, dto.Name);
        if (user == null) return BadRequest("User already exists");
        return Ok(new { message = "User registered successfully" });
    }

    /// <summary>
    /// Logs in a user and sets authentication cookies.
    /// </summary>
    /// <param name="model">The login credentials with encrypted password.</param>
    /// <returns>User details if login is successful.</returns>
    [HttpPost("login")]
    [EnableRateLimiting("AuthRateLimit")]
    [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Login([FromBody] LoginDto model)
    {
        var decryptedPassword = _rsaKeyService.Decrypt(model.Password);
        if (decryptedPassword == null) return Unauthorized("Invalid credentials");

        var result = await _authService.LoginAsync(model.Email, decryptedPassword);
        if (result == null)
            return Unauthorized("Invalid credentials");

        SetTokenCookies(result.Value.AccessToken, result.Value.RefreshToken);

        return Ok(new { name = result.Value.Name, email = model.Email });
    }

    /// <summary>
    /// Refreshes the access token using the refresh token from cookies.
    /// </summary>
    /// <returns>A new access token and user details.</returns>
    [HttpPost("refresh")]
    [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Refresh()
    {
        var refreshToken = Request.Cookies["refreshToken"];
        var accessToken = Request.Cookies["accessToken"]; 

        if (string.IsNullOrEmpty(refreshToken))
            return Unauthorized("No refresh token");

        if (string.IsNullOrEmpty(accessToken))
        {
             return Unauthorized("Session expired");
        }

        var result = await _authService.RefreshTokenAsync(accessToken, refreshToken);
        if (result == null)
        {
            // Clear cookies if refresh fails
            Response.Cookies.Delete("accessToken");
            Response.Cookies.Delete("refreshToken");
            return Unauthorized("Invalid token");
        }

        var handler = new System.IdentityModel.Tokens.Jwt.JwtSecurityTokenHandler();
        var jwtToken = handler.ReadJwtToken(result.Value.AccessToken);
        var name = jwtToken.Claims.First(claim => claim.Type == "name").Value;
        var email = jwtToken.Claims.First(claim => claim.Type == ClaimTypes.Email).Value;

        SetTokenCookies(result.Value.AccessToken, result.Value.RefreshToken);

        return Ok(new { message = "Token refreshed", name, email });
    }

    private void SetTokenCookies(string accessToken, string refreshToken)
    {
        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = true, 
            SameSite = SameSiteMode.Strict,
            Expires = DateTime.UtcNow.AddDays(7) // Match refresh token expiry
        };

        Response.Cookies.Append("accessToken", accessToken, cookieOptions);
        Response.Cookies.Append("refreshToken", refreshToken, cookieOptions);

        // Set a non-HttpOnly cookie to let the frontend know we are logged in
        Response.Cookies.Append("logged_in", "true", new CookieOptions
        {
            HttpOnly = false, // Accessible to JS
            Secure = false, // Allow on http://localhost
            SameSite = SameSiteMode.Lax, // Allow on top-level navigation
            Path = "/", // Global path
            Expires = DateTime.UtcNow.AddDays(7)
        });
    }

    /// <summary>
    /// Logs out the user by clearing authentication cookies.
    /// </summary>
    /// <returns>A success message.</returns>
    [HttpPost("logout")]
    [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
    public IActionResult Logout()
    {
        Response.Cookies.Delete("accessToken");
        Response.Cookies.Delete("refreshToken");
        Response.Cookies.Delete("logged_in");
        return Ok(new { message = "Logged out" });
    }

    /// <summary>
    /// Uploads a profile picture for the authenticated user.
    /// </summary>
    /// <param name="file">The image file to upload.</param>
    /// <returns>Status of the upload.</returns>
    [HttpPost("upload-photo")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
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

    /// <summary>
    /// Retrieves the profile picture of the authenticated user.
    /// </summary>
    /// <returns>The profile picture as an image file.</returns>
    [HttpGet("photo")]
    [Authorize]
    [ProducesResponseType(typeof(FileContentResult), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetPhoto()
    {
        var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userIdStr == null || !int.TryParse(userIdStr, out int userId))
            return Unauthorized();

        var photo = await _authService.GetProfilePictureAsync(userId);
        if (photo == null) return NotFound();

        return File(photo, "image/jpeg");
    }

    /// <summary>
    /// Changes the password for the authenticated user.
    /// </summary>
    /// <param name="model">The current and new password (encrypted).</param>
    /// <returns>Success message.</returns>
    [HttpPost("change-password")]
    [Authorize]
    [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto model)
    {
        var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userIdStr == null || !int.TryParse(userIdStr, out int userId))
            return Unauthorized();

        var decryptedCurrentPassword = _rsaKeyService.Decrypt(model.CurrentPassword);
        var decryptedNewPassword = _rsaKeyService.Decrypt(model.NewPassword);

        if (decryptedCurrentPassword == null || decryptedNewPassword == null)
            return BadRequest("Invalid password encryption");

        var success = await _authService.ChangePasswordAsync(userId, decryptedCurrentPassword, decryptedNewPassword);
        if (!success) return BadRequest("Failed to change password. Check your current password.");

        return Ok(new { message = "Password changed successfully" });
    }

    /// <summary>
    /// Deletes the authenticated user's account.
    /// </summary>
    /// <returns>Success message.</returns>
    [HttpDelete("delete-account")]
    [Authorize]
    [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> DeleteAccount()
    {
        var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userIdStr == null || !int.TryParse(userIdStr, out int userId))
            return Unauthorized();

        var success = await _authService.DeleteAccountAsync(userId);
        if (!success) return NotFound("User not found");
        
        // Clear cookies on account deletion
        Response.Cookies.Delete("accessToken");
        Response.Cookies.Delete("refreshToken");

        return Ok(new { message = "Account deleted successfully" });
    }

    /// <summary>
    /// Initiates the password reset process by generating a reset token.
    /// </summary>
    /// <param name="dto">The email address to send the reset token to.</param>
    /// <returns>A message indicating the process has started (and the token for dev purposes).</returns>
    [HttpPost("forgot-password")]
    [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto dto)
    {
        var token = await _authService.ForgotPasswordAsync(dto.Email);
        if (token == null) 
        {
            // Generic message to prevent enumeration
            return Ok(new { message = "If the email exists, a reset token has been generated.", token = "HIDDEN_IN_PROD" }); 
        }

        // In a real app, send email. Here we return the token for testing.
        return Ok(new { message = "Reset token generated", token });
    }

    /// <summary>
    /// Resets the user's password using a valid reset token.
    /// </summary>
    /// <param name="dto">The reset token and new encrypted password.</param>
    /// <returns>Success message.</returns>
    [HttpPost("reset-password")]
    [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto dto)
    {
        var decryptedNewPassword = _rsaKeyService.Decrypt(dto.NewPassword);
        if (decryptedNewPassword == null) return BadRequest("Invalid password encryption");

        var success = await _authService.ResetPasswordAsync(dto.Email, dto.Token, decryptedNewPassword);
        if (!success) return BadRequest("Invalid or expired token");

        return Ok(new { message = "Password reset successfully" });
    }
}
