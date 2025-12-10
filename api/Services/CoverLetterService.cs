using CvMaker.Api.Data;
using CvMaker.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace CvMaker.Api.Services;

public class CoverLetterService
{
    private readonly AppDbContext _context;
    private readonly PdfService _pdfService;

    public CoverLetterService(AppDbContext context, PdfService pdfService)
    {
        _context = context;
        _pdfService = pdfService;
    }

    public async Task<List<CoverLetter>> GetCoverLettersAsync(int userId)
    {
        return await _context.CoverLetters
            .Where(c => c.UserId == userId)
            .OrderByDescending(c => c.UpdatedAt)
            .ToListAsync();
    }

    public async Task<CoverLetter?> GetCoverLetterAsync(int id, int userId)
    {
        return await _context.CoverLetters.FindAsync(id);
    }
    
    // Check ownership separately or in Get
    public async Task<CoverLetter?> GetCoverLetterCheckedAsync(int id, int userId)
    {
        var cl = await _context.CoverLetters.FindAsync(id);
        if (cl == null || cl.UserId != userId) return null;
        return cl;
    }

    public async Task<CoverLetter?> GetCoverLetterForPdfAsync(int id)
    {
        return await _context.CoverLetters.FindAsync(id);
    }

    public async Task<CoverLetter> CreateCoverLetterAsync(CoverLetter coverLetter)
    {
        _context.CoverLetters.Add(coverLetter);
        await _context.SaveChangesAsync();
        return coverLetter;
    }

    public async Task<bool> UpdateCoverLetterAsync(CoverLetter coverLetter, int userId)
    {
        var existing = await _context.CoverLetters.FindAsync(coverLetter.Id);
        if (existing == null || existing.UserId != userId) return false;

        existing.Title = coverLetter.Title;
        existing.JobTitle = coverLetter.JobTitle;
        existing.Company = coverLetter.Company;
        existing.Data = coverLetter.Data;
        existing.Template = coverLetter.Template;
        existing.CvId = coverLetter.CvId;
        existing.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteCoverLetterAsync(int id, int userId)
    {
        var existing = await _context.CoverLetters.FindAsync(id);
        if (existing == null || existing.UserId != userId) return false;

        _context.CoverLetters.Remove(existing);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<string> ShareCoverLetterAsync(int id, int userId)
    {
        var cl = await GetCoverLetterCheckedAsync(id, userId);
        if (cl == null) throw new KeyNotFoundException("Cover letter not found");

        if (string.IsNullOrEmpty(cl.PublicToken))
        {
            cl.PublicToken = Guid.NewGuid().ToString();
            await _context.SaveChangesAsync();
        }

        return cl.PublicToken;
    }

    public async Task UnshareCoverLetterAsync(int id, int userId)
    {
        var cl = await GetCoverLetterCheckedAsync(id, userId);
        if (cl == null) throw new KeyNotFoundException("Cover letter not found");

        cl.PublicToken = null;
        await _context.SaveChangesAsync();
    }

    public async Task<CoverLetter?> GetSharedCoverLetterAsync(string token)
    {
        return await _context.CoverLetters.FirstOrDefaultAsync(c => c.PublicToken == token);
    }

    /// <summary>
    /// Generates a PDF for the specified cover letter using a headless browser.
    /// </summary>
    public async Task<(byte[] FileBytes, string FileName)?> GeneratePdfForDownloadAsync(int id, int userId, string baseUrl)
    {
        var cl = await GetCoverLetterCheckedAsync(id, userId);
        if (cl == null) return null;

        // Use the print route we just added
        var pdfUrl = $"{baseUrl}/cover-letter/{id}/print";
        var pdfBytes = await _pdfService.GeneratePdfFromUrlAsync(pdfUrl);
        var filename = SanitizeFilename(cl.Title);

        return (pdfBytes, filename);
    }

    private string SanitizeFilename(string title)
    {
        var sanitized = new string(title
            .Where(c => char.IsLetterOrDigit(c) || c == ' ' || c == '-' || c == '_')
            .ToArray())
            .Trim()
            .Replace(" ", "_");
        
        return string.IsNullOrWhiteSpace(sanitized) ? "CoverLetter.pdf" : $"{sanitized}.pdf";
    }

    public async Task<(byte[] FileBytes, string FileName)?> GenerateSharedPdfForDownloadAsync(string token, string baseUrl)
    {
        var cl = await GetSharedCoverLetterAsync(token);
        if (cl == null) return null;

        // Use the print route - make sure CoverLetterPrintPage uses the anonymous /data endpoint
        var pdfUrl = $"{baseUrl}/cover-letter/{cl.Id}/print";
        var pdfBytes = await _pdfService.GeneratePdfFromUrlAsync(pdfUrl);
        var filename = SanitizeFilename(cl.Title);

        return (pdfBytes, filename);
    }

    public async Task<bool> RenameCoverLetterAsync(int id, int userId, string newTitle)
    {
        var existing = await _context.CoverLetters.FindAsync(id);
        if (existing == null || existing.UserId != userId) return false;

        existing.Title = newTitle;
        existing.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();
        return true;
    }

}
