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

    public async Task<byte[]> GeneratePdfAsync(string pdfUrl)
    {
        return await _pdfService.GeneratePdfFromUrlAsync(pdfUrl);
    }

    public async Task<bool> UploadProfilePictureAsync(int cvId, int userId, byte[] pictureData)
    {
        var cv = await _context.Cvs.FirstOrDefaultAsync(c => c.Id == cvId && c.UserId == userId);
        if (cv == null) return false;

        cv.Photo = pictureData;
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<byte[]?> GetProfilePictureAsync(int cvId)
    {
        var cv = await _context.Cvs.FindAsync(cvId);
        return cv?.Photo;
    }

}
