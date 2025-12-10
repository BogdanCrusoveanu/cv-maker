using CvMaker.Api.Data;
using CvMaker.Api.DTOs;
using CvMaker.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace CvMaker.Api.Services;

public class CvService
{
    private readonly AppDbContext _context;
    private readonly PdfService _pdfService;

    public CvService(AppDbContext context, PdfService pdfService)
    {
        _context = context;
        _pdfService = pdfService;
    }

    public async Task<List<Cv>> GetAllCvsAsync(int userId)
    {
        return await _context.Cvs.Where(c => c.UserId == userId).ToListAsync();
    }

    public async Task<Cv?> GetCvAsync(int id, int userId)
    {
        return await _context.Cvs.FirstOrDefaultAsync(c => c.Id == id && c.UserId == userId);
    }

    public async Task<Cv> SaveCvAsync(CvDto dto, int userId)
    {
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

        await _context.SaveChangesAsync();
        return cv;
    }

    public async Task<bool> DeleteCvAsync(int id, int userId)
    {
        var cv = await _context.Cvs.FirstOrDefaultAsync(c => c.Id == id && c.UserId == userId);
        if (cv == null) return false;

        _context.Cvs.Remove(cv);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> RenameCvAsync(int id, int userId, string newTitle)
    {
        var cv = await _context.Cvs.FirstOrDefaultAsync(c => c.Id == id && c.UserId == userId);
        if (cv == null) return false;

        cv.Title = newTitle;
        cv.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<string?> ShareCvAsync(int id, int userId)
    {
        var cv = await _context.Cvs.FirstOrDefaultAsync(c => c.Id == id && c.UserId == userId);
        if (cv == null) return null;

        if (string.IsNullOrEmpty(cv.PublicToken))
        {
            cv.PublicToken = Guid.NewGuid().ToString("N");
            await _context.SaveChangesAsync();
        }

        return cv.PublicToken;
    }

    public async Task<bool> UnshareCvAsync(int id, int userId)
    {
        var cv = await _context.Cvs.FirstOrDefaultAsync(c => c.Id == id && c.UserId == userId);
        if (cv == null) return false;

        cv.PublicToken = null;
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<Cv?> GetSharedCvAsync(string token)
    {
        return await _context.Cvs.FirstOrDefaultAsync(c => c.PublicToken == token);
    }

    public async Task<Cv?> GetCvForPdfAsync(int id)
    {
        return await _context.Cvs.FirstOrDefaultAsync(c => c.Id == id);
    }
    public async Task<bool> UploadProfilePictureAsync(int cvId, int userId, Stream fileStream)
    {
        var cv = await _context.Cvs.FirstOrDefaultAsync(c => c.Id == cvId && c.UserId == userId);
        if (cv == null) return false;

        using var memoryStream = new MemoryStream();
        await fileStream.CopyToAsync(memoryStream);
        cv.Photo = memoryStream.ToArray();
        
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<byte[]?> GetProfilePictureAsync(int cvId)
    {
        var cv = await _context.Cvs.FindAsync(cvId);
        return cv?.Photo;
    }

    public async Task<(byte[] FileBytes, string FileName)?> GeneratePdfForDownloadAsync(int id, int userId, string baseUrl)
    {
        var cv = await GetCvAsync(id, userId);
        if (cv == null) return null;

        var pdfUrl = $"{baseUrl}/pdf/{id}";
        var pdfBytes = await _pdfService.GeneratePdfFromUrlAsync(pdfUrl);
        var filename = SanitizeFilename(cv.Title);

        return (pdfBytes, filename);
    }

    public async Task<(byte[] FileBytes, string FileName)?> GenerateSharedPdfForDownloadAsync(string token, string baseUrl)
    {
        var cv = await GetSharedCvAsync(token);
        if (cv == null) return null;

        var pdfUrl = $"{baseUrl}/shared/{token}";
        var pdfBytes = await _pdfService.GeneratePdfFromUrlAsync(pdfUrl);
        var filename = SanitizeFilename(cv.Title);

        return (pdfBytes, filename);
    }

    private string SanitizeFilename(string title)
    {
        var sanitized = new string(title
            .Where(c => char.IsLetterOrDigit(c) || c == ' ' || c == '-' || c == '_')
            .ToArray())
            .Trim()
            .Replace(" ", "_");
        
        return string.IsNullOrWhiteSpace(sanitized) ? "CV.pdf" : $"{sanitized}.pdf";
    }
}
