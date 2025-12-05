using CvMaker.Api.Data;
using CvMaker.Api.DTOs;
using CvMaker.Api.Models;
using CvMaker.Api.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CvMaker.Api.Controllers;

/// <summary>
/// Controller for seeding test data.
/// </summary>
/// <remarks>
/// This controller is intended for development and testing purposes only.
/// </remarks>
[ApiController]
[Route("api/[controller]")]
public class SeedingController : ControllerBase
{
    private readonly AuthService _authService;
    private readonly CvService _cvService;
    private readonly AppDbContext _context;
    private readonly RsaKeyService _rsaKeyService;

    public SeedingController(AuthService authService, CvService cvService, AppDbContext context, RsaKeyService rsaKeyService)
    {
        _authService = authService;
        _cvService = cvService;
        _context = context;
        _rsaKeyService = rsaKeyService;
    }

    /// <summary>
    /// Seeds the database with a test user and sample CVs.
    /// </summary>
    /// <param name="dto">The user credentials to create.</param>
    /// <returns>Status of the seeding operation.</returns>
    [HttpPost("seed")]
    [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Seed([FromBody] LoginDto dto)
    {
        // 1. Try to Register
        // Note: We bypass RSA decryption here because this is a dev/test endpoint.
        // We assume the password sent is PLAIN TEXT.
        
        var user = await _authService.RegisterAsync(dto.Email, dto.Password, "Test User");
        
        if (user == null)
        {
            // User likely exists, fetch them
            user = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
            if (user == null) return BadRequest("Failed to register or find user.");
        }

        // 2. Generate Data
        var professions = new[]
        {
            new { Title = "Software Engineer", Skills = new[] { "C#", "React", "SQL", "Azure", "Docker" }, Summary = "Experienced developer building scalable web apps." },
            new { Title = "Data Scientist", Skills = new[] { "Python", "Machine Learning", "Pandas", "TensorFlow", "SQL" }, Summary = "Data-driven professional with expertise in predictive modeling." },
            new { Title = "Product Manager", Skills = new[] { "Agile", "Jira", "Roadmapping", "User Research", "Communication" }, Summary = "Product leader focused on user-centric design and business growth." },
            new { Title = "UX Designer", Skills = new[] { "Figma", "Adobe XD", "Prototyping", "User Testing", "HTML/CSS" }, Summary = "Creative designer passionate about intuitive user experiences." },
            new { Title = "DevOps Engineer", Skills = new[] { "Kubernetes", "Terraform", "AWS", "CI/CD", "Bash" }, Summary = "Infrastructure expert automating deployment pipelines." }
        };

        var locations = new[] { "New York, NY", "London, UK", "Berlin, DE", "San Francisco, CA", "Remote" };
        var universities = new[] { "MIT", "Stanford", "Oxford", "Cambridge", "ETH Zurich" };

        for (int i = 0; i < 10; i++)
        {
            var prof = professions[i % professions.Length];
            var cvTitle = $"{prof.Title} CV {i + 1}";

            // Create CV Data JSON
            var cvData = new
            {
                personalInfo = new
                {
                    fullName = "Test User",
                    title = prof.Title,
                    email = dto.Email,
                    phone = $"555-010{i}",
                    location = locations[i % locations.Length],
                    summary = prof.Summary
                },
                experience = new[]
                {
                    new
                    {
                        id = 1,
                        title = $"Senior {prof.Title}",
                        company = "Tech Corp",
                        location = locations[i % locations.Length],
                        startDate = "2020-01",
                        endDate = "Present",
                        description = "Leading key projects and mentoring junior team members."
                    },
                    new
                    {
                        id = 2,
                        title = $"Junior {prof.Title}",
                        company = "Startup Inc",
                        location = locations[i % locations.Length],
                        startDate = "2018-01",
                        endDate = "2019-12",
                        description = "Contributed to core product development."
                    }
                },
                education = new[]
                {
                    new
                    {
                        id = 1,
                        school = universities[i % universities.Length],
                        degree = "Bachelor of Science",
                        location = locations[i % locations.Length],
                        startDate = "2014-09",
                        endDate = "2018-06",
                        gpa = "3.8"
                    }
                },
                skills = prof.Skills.Select(s => new { id = Guid.NewGuid(), name = s, level = new Random().Next(3, 6), showLevel = true }).ToArray(),
                visibility = new
                {
                    personalInfo = true,
                    summary = true,
                    experience = true,
                    education = true,
                    skills = true,
                    languages = true,
                    interests = true,
                    customSections = true
                }
            };

            var cvDto = new CvDto(0, cvTitle, System.Text.Json.JsonSerializer.Serialize(cvData));

            await _cvService.SaveCvAsync(cvDto, user.Id);
        }

        return Ok(new { message = "Seeding completed successfully", userId = user.Id });
    }
}
