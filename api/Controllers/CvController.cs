using CvMaker.Api.DTOs;
using CvMaker.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CvMaker.Api.Controllers;

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

    [HttpGet]
    public async Task<IActionResult> GetCvs()
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        var cvs = await _cvService.GetAllCvsAsync(userId);
        return Ok(cvs);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetCv(int id)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        var cv = await _cvService.GetCvAsync(id, userId);
        if (cv == null) return NotFound();
        return Ok(cv);
    }

    [HttpPost]
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

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCv(int id)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        var success = await _cvService.DeleteCvAsync(id, userId);
        
        if (!success) return NotFound();

        return NoContent();
    }

    [HttpPost("{id}/share")]
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

    [HttpPost("{id}/unshare")]
    public async Task<IActionResult> UnshareCv(int id)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        var success = await _cvService.UnshareCvAsync(id, userId);
        
        if (!success) return NotFound();

        return Ok();
    }

    [AllowAnonymous]
    [HttpGet("shared/{token}")]
    public async Task<IActionResult> GetSharedCv(string token)
    {
        var cv = await _cvService.GetSharedCvAsync(token);
        if (cv == null) return NotFound();
        
        // Return only necessary data for viewing
        return Ok(new { cv.Title, cv.Data, cv.UpdatedAt });
    }

    [AllowAnonymous]
    [HttpGet("{id}/data")]
    public async Task<IActionResult> GetCvDataForPdf(int id)
    {
        // This endpoint is for PDF generation only - allows unauthenticated access
        // Security: Only works for localhost requests (Puppeteer)
        var cv = await _cvService.GetCvForPdfAsync(id);
        if (cv == null) return NotFound();
        
        return Ok(new { cv.Id, cv.Title, cv.Data, cv.UpdatedAt });
    }

    [HttpGet("{id}/pdf")]
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

    [AllowAnonymous]
    [HttpGet("shared/{token}/pdf")]
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
