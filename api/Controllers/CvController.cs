using CvMaker.Api.Data;
using CvMaker.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace CvMaker.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class CvController : ControllerBase
{
    private readonly AppDbContext _context;

    public CvController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetCvs()
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        var cvs = await _context.Cvs.Where(c => c.UserId == userId).ToListAsync();
        return Ok(cvs);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetCv(int id)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        var cv = await _context.Cvs.FirstOrDefaultAsync(c => c.Id == id && c.UserId == userId);
        if (cv == null) return NotFound();
        return Ok(cv);
    }

    [HttpPost]
    public async Task<IActionResult> SaveCv(CvDto dto)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        
        Cv? cv = null;
        if (dto.Id > 0)
        {
            cv = await _context.Cvs.FirstOrDefaultAsync(c => c.Id == dto.Id && c.UserId == userId);
        }

        if (cv == null)
        {
            cv = new Cv
            {
                UserId = userId,
                Title = dto.Title,
                Data = dto.Data,
                CreatedAt = DateTime.UtcNow
            };
            _context.Cvs.Add(cv);
        }
        else
        {
            cv.Title = dto.Title;
            cv.Data = dto.Data;
            cv.UpdatedAt = DateTime.UtcNow;
        }

        try
        {
            await _context.SaveChangesAsync();
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
        var cv = await _context.Cvs.FirstOrDefaultAsync(c => c.Id == id && c.UserId == userId);
        
        if (cv == null) return NotFound();

        _context.Cvs.Remove(cv);
        await _context.SaveChangesAsync();

        return NoContent();
    }
    [HttpPost("{id}/share")]
    public async Task<IActionResult> ShareCv(int id)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        var cv = await _context.Cvs.FirstOrDefaultAsync(c => c.Id == id && c.UserId == userId);
        
        if (cv == null) return NotFound();

        if (string.IsNullOrEmpty(cv.PublicToken))
        {
            cv.PublicToken = Guid.NewGuid().ToString("N");
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error sharing CV: {ex}");
                return StatusCode(500, ex.Message);
            }
        }

        return Ok(new { Token = cv.PublicToken });
    }

    [HttpPost("{id}/unshare")]
    public async Task<IActionResult> UnshareCv(int id)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        var cv = await _context.Cvs.FirstOrDefaultAsync(c => c.Id == id && c.UserId == userId);
        
        if (cv == null) return NotFound();

        cv.PublicToken = null;
        await _context.SaveChangesAsync();

        return Ok();
    }

    [AllowAnonymous]
    [HttpGet("shared/{token}")]
    public async Task<IActionResult> GetSharedCv(string token)
    {
        var cv = await _context.Cvs.FirstOrDefaultAsync(c => c.PublicToken == token);
        if (cv == null) return NotFound();
        
        // Return only necessary data for viewing
        return Ok(new { cv.Title, cv.Data, cv.UpdatedAt });
    }
}

public record CvDto(int Id, string Title, string Data);
