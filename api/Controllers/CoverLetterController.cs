
using CvMaker.Api.Data;
using CvMaker.Api.Models;
using CvMaker.Api.DTOs;
using CvMaker.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CvMaker.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/cover-letter")]
public class CoverLetterController : ControllerBase
{
    private readonly CoverLetterService _service;
    private readonly IConfiguration _configuration;

    public CoverLetterController(CoverLetterService service, IConfiguration configuration)
    {
        _service = service;
        _configuration = configuration;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<CoverLetter>>> GetCoverLetters()
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
        return await _service.GetCoverLettersAsync(userId);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<CoverLetter>> GetCoverLetter(int id)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
        var coverLetter = await _service.GetCoverLetterCheckedAsync(id, userId);

        if (coverLetter == null)
        {
            return NotFound();
        }

        return coverLetter;
    }

    [HttpPost]
    public async Task<ActionResult<CoverLetter>> CreateCoverLetter(CoverLetter coverLetter)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
        coverLetter.UserId = userId;
        coverLetter.CreatedAt = DateTime.UtcNow;
        coverLetter.UpdatedAt = DateTime.UtcNow;

        await _service.CreateCoverLetterAsync(coverLetter);

        return CreatedAtAction(nameof(GetCoverLetter), new { id = coverLetter.Id }, coverLetter);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateCoverLetter(int id, CoverLetter coverLetter)
    {
        if (id != coverLetter.Id)
        {
            return BadRequest();
        }

        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
        var success = await _service.UpdateCoverLetterAsync(coverLetter, userId);

        if (!success)
        {
            return NotFound(); // Or Forbid, logic in service handles check
        }

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCoverLetter(int id)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
        var success = await _service.DeleteCoverLetterAsync(id, userId);

        if (!success)
        {
            return NotFound();
        }

        return NoContent();
    }

    [HttpPost("{id}/share")]
    public async Task<ActionResult<object>> ShareCoverLetter(int id)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
        try
        {
            var token = await _service.ShareCoverLetterAsync(id, userId);
            return Ok(new { token });
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }

    [HttpPost("{id}/unshare")]
    public async Task<IActionResult> UnshareCoverLetter(int id)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
        try
        {
            await _service.UnshareCoverLetterAsync(id, userId);
            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }

    [AllowAnonymous]
    [HttpGet("shared/{token}")]
    public async Task<ActionResult<CoverLetter>> GetSharedCoverLetter(string token)
    {
        var cl = await _service.GetSharedCoverLetterAsync(token);
        if (cl == null) return NotFound();
        return cl;
    }

    [AllowAnonymous]
    [HttpGet("{id}/data")]
    public async Task<IActionResult> GetCoverLetterDataForPdf(int id)
    {
        // This endpoint is used by Puppeteer (running locally) to fetch data for PDF generation.
        // It allows anonymous access, similar to CvController.GetCvDataForPdf.
        // In production, restrict this to localhost or use a shared secret.
        var cl = await _service.GetCoverLetterForPdfAsync(id);
        if (cl == null) return NotFound();

        return Ok(cl);
    }

    /// <summary>
    /// Generates and downloads a PDF for the specified cover letter.
    /// </summary>
    /// <param name="id">The cover letter ID.</param>
    /// <returns>The PDF file.</returns>
    [HttpGet("{id}/pdf")]
    public async Task<IActionResult> DownloadPdf(int id)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        var frontendUrl = _configuration["AppSettings:FrontendUrl"] ?? "http://localhost:5173";
        
        try
        {
            var result = await _service.GeneratePdfForDownloadAsync(id, userId, frontendUrl);
            if (result == null) return NotFound();

            Response.Headers.Append("Content-Disposition", $"attachment; filename=\"{result.Value.FileName}\"");
            return File(result.Value.FileBytes, "application/pdf", result.Value.FileName);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error generating PDF: {ex}"); // Keep simplified error log
            return StatusCode(500, "Failed to generate PDF");
        }
    }

    [AllowAnonymous]
    [HttpGet("shared/{token}/pdf")]
    public async Task<IActionResult> DownloadSharedPdf(string token)
    {
        var frontendUrl = _configuration["AppSettings:FrontendUrl"] ?? "http://localhost:5173";

        try
        {
            var result = await _service.GenerateSharedPdfForDownloadAsync(token, frontendUrl);
            if (result == null) return NotFound();

            Response.Headers.Append("Content-Disposition", $"attachment; filename=\"{result.Value.FileName}\"");
            return File(result.Value.FileBytes, "application/pdf", result.Value.FileName);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error generating shared PDF: {ex}");
            return StatusCode(500, "Failed to generate PDF");
        }
    }

    [HttpPatch("{id}/title")]
    public async Task<IActionResult> RenameCoverLetter(int id, [FromBody] RenameCvDto dto)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
        var success = await _service.RenameCoverLetterAsync(id, userId, dto.Title);

        if (!success)
        {
            return NotFound();
        }

        return NoContent();
    }
}
