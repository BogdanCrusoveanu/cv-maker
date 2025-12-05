using CvMaker.Api.DTOs;
using CvMaker.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CvMaker.Api.Controllers;

/// <summary>
/// Controller for managing CVs (Resumes).
/// </summary>
[Authorize]
[ApiController]
[Route("api/[controller]")]
public class CvController : ControllerBase
{
    private readonly CvService _cvService;
    private readonly IConfiguration _configuration;

    public CvController(CvService cvService, IConfiguration configuration)
    {
        _cvService = cvService;
        _configuration = configuration;
    }

    /// <summary>
    /// Retrieves all CVs for the authenticated user.
    /// </summary>
    /// <returns>A list of CVs.</returns>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<object>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetCvs()
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        var cvs = await _cvService.GetAllCvsAsync(userId);
        return Ok(cvs);
    }

    /// <summary>
    /// Retrieves a specific CV by ID.
    /// </summary>
    /// <param name="id">The ID of the CV.</param>
    /// <returns>The CV details.</returns>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetCv(int id)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        var cv = await _cvService.GetCvAsync(id, userId);
        if (cv == null) return NotFound();
        return Ok(cv);
    }

    /// <summary>
    /// Creates or updates a CV.
    /// </summary>
    /// <param name="dto">The CV data.</param>
    /// <returns>The saved CV.</returns>
    [HttpPost]
    [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> SaveCv(CvDto dto)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        
        try
        {
            var cv = await _cvService.SaveCvAsync(dto, userId);
            return Ok(cv);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error saving CV: {ex}");
            return StatusCode(500, ex.Message);
        }
    }

    /// <summary>
    /// Deletes a CV.
    /// </summary>
    /// <param name="id">The ID of the CV to delete.</param>
    /// <returns>No content if successful.</returns>
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteCv(int id)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        var success = await _cvService.DeleteCvAsync(id, userId);
        
        if (!success) return NotFound();

        return NoContent();
    }

    /// <summary>
    /// Generates a public share token for a CV.
    /// </summary>
    /// <param name="id">The ID of the CV to share.</param>
    /// <returns>The public token.</returns>
    [HttpPost("{id}/share")]
    [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> ShareCv(int id)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        try
        {
            var token = await _cvService.ShareCvAsync(id, userId);
            if (token == null) return NotFound();
            return Ok(new { Token = token });
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error sharing CV: {ex}");
            return StatusCode(500, ex.Message);
        }
    }

    /// <summary>
    /// Revokes the public share token for a CV.
    /// </summary>
    /// <param name="id">The ID of the CV to unshare.</param>
    /// <returns>Success status.</returns>
    [HttpPost("{id}/unshare")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UnshareCv(int id)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        var success = await _cvService.UnshareCvAsync(id, userId);
        
        if (!success) return NotFound();

        return Ok();
    }

    /// <summary>
    /// Retrieves a shared CV by its public token.
    /// </summary>
    /// <param name="token">The public token.</param>
    /// <returns>The CV details (read-only).</returns>
    [AllowAnonymous]
    [HttpGet("shared/{token}")]
    [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetSharedCv(string token)
    {
        var cv = await _cvService.GetSharedCvAsync(token);
        if (cv == null) return NotFound();
        
        // Return only necessary data for viewing
        return Ok(new { cv.Title, cv.Data, cv.UpdatedAt });
    }

    /// <summary>
    /// Retrieves CV data specifically for PDF generation.
    /// </summary>
    /// <param name="id">The ID of the CV.</param>
    /// <returns>The CV data.</returns>
    /// <remarks>
    /// This endpoint allows unauthenticated access but should be restricted to localhost (Puppeteer) in a real deployment.
    /// </remarks>
    [AllowAnonymous]
    [HttpGet("{id}/data")]
    [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetCvDataForPdf(int id)
    {
        var cv = await _cvService.GetCvForPdfAsync(id);
        if (cv == null) return NotFound();
        
        return Ok(new { cv.Id, cv.Title, cv.Data, cv.UpdatedAt });
    }

    /// <summary>
    /// Generates and downloads a PDF for a specific CV.
    /// </summary>
    /// <param name="id">The ID of the CV.</param>
    /// <returns>The PDF file.</returns>
    [HttpGet("{id}/pdf")]
    [ProducesResponseType(typeof(FileContentResult), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> DownloadPdf(int id)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        var cv = await _cvService.GetCvAsync(id, userId);
        
        if (cv == null) return NotFound();

        // Get frontend URL for PDF rendering
        var frontendUrl = _configuration["AppSettings:FrontendUrl"] ?? "http://localhost:5173";
        var pdfUrl = $"{frontendUrl}/pdf/{id}";

        try
        {
            var pdfBytes = await _cvService.GeneratePdfAsync(pdfUrl);
            
            // Sanitize filename - remove special characters
            var sanitizedTitle = new string(cv.Title
                .Where(c => char.IsLetterOrDigit(c) || c == ' ' || c == '-' || c == '_')
                .ToArray())
                .Trim()
                .Replace(" ", "_");
            
            if (string.IsNullOrWhiteSpace(sanitizedTitle))
                sanitizedTitle = "CV";
                
            var filename = $"{sanitizedTitle}.pdf";
            
            // Explicitly set headers
            Response.Headers.Append("Content-Disposition", $"attachment; filename=\"{filename}\"");
            return File(pdfBytes, "application/pdf", filename);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "Failed to generate PDF", details = ex.Message });
        }
    }

    /// <summary>
    /// Generates and downloads a PDF for a shared CV.
    /// </summary>
    /// <param name="token">The public token of the CV.</param>
    /// <returns>The PDF file.</returns>
    [AllowAnonymous]
    [HttpGet("shared/{token}/pdf")]
    [ProducesResponseType(typeof(FileContentResult), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> DownloadSharedPdf(string token)
    {
        var cv = await _cvService.GetSharedCvAsync(token);
        if (cv == null) return NotFound();

        // Get frontend URL for PDF rendering
        var frontendUrl = _configuration["AppSettings:FrontendUrl"] ?? "http://localhost:5173";
        var pdfUrl = $"{frontendUrl}/shared/{token}";

        try
        {
            var pdfBytes = await _cvService.GeneratePdfAsync(pdfUrl);
            
            // Sanitize filename - remove special characters
            var sanitizedTitle = new string(cv.Title
                .Where(c => char.IsLetterOrDigit(c) || c == ' ' || c == '-' || c == '_')
                .ToArray())
                .Trim()
                .Replace(" ", "_");
            
            if (string.IsNullOrWhiteSpace(sanitizedTitle))
                sanitizedTitle = "CV";
                
            var filename = $"{sanitizedTitle}.pdf";
            
            // Explicitly set headers
            Response.Headers.Append("Content-Disposition", $"attachment; filename=\"{filename}\"");
            return File(pdfBytes, "application/pdf", filename);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "Failed to generate PDF", details = ex.Message });
        }
    }
}
