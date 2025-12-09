using CvMaker.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace CvMaker.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users { get; set; }
    public DbSet<Cv> Cvs { get; set; }
    public DbSet<CoverLetter> CoverLetters { get; set; }
}
