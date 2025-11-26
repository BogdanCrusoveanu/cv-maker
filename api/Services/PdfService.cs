using PuppeteerSharp;
using PuppeteerSharp.Media;

namespace CvMaker.Api.Services;

public class PdfService
{
    private readonly ILogger<PdfService> _logger;
    private static bool _browserFetcherInitialized = false;
    private static readonly SemaphoreSlim _initLock = new(1, 1);

    public PdfService(ILogger<PdfService> logger)
    {
        _logger = logger;
    }

    public async Task EnsureBrowserInstalledAsync()
    {
        if (_browserFetcherInitialized) return;

        await _initLock.WaitAsync();
        try
        {
            if (_browserFetcherInitialized) return;

            _logger.LogInformation("Downloading Chromium for PuppeteerSharp...");
            var browserFetcher = new BrowserFetcher();
            await browserFetcher.DownloadAsync();
            _browserFetcherInitialized = true;
            _logger.LogInformation("Chromium download complete.");
        }
        finally
        {
            _initLock.Release();
        }
    }

    public async Task<byte[]> GeneratePdfFromUrlAsync(string url)
    {
        await EnsureBrowserInstalledAsync();

        _logger.LogInformation("Generating PDF from URL: {Url}", url);

        await using var browser = await Puppeteer.LaunchAsync(new LaunchOptions
        {
            Headless = true,
            Args = new[] { "--no-sandbox", "--disable-setuid-sandbox" }
        });

        await using var page = await browser.NewPageAsync();
        
        // Navigate to the URL and wait for network to be idle
        await page.GoToAsync(url, new NavigationOptions
        {
            WaitUntil = new[] { WaitUntilNavigation.Networkidle0 },
            Timeout = 30000
        });

        // Wait a bit more for any animations or dynamic content
        await Task.Delay(1000);

        // Generate PDF with settings that preserve interactivity
        var pdfData = await page.PdfDataAsync(new PdfOptions
        {
            Format = PaperFormat.A4,
            PrintBackground = true,
            MarginOptions = new MarginOptions
            {
                Top = "0",
                Bottom = "0",
                Left = "0",
                Right = "0"
            },
            PreferCSSPageSize = false
        });

        _logger.LogInformation("PDF generated successfully. Size: {Size} bytes", pdfData.Length);
        return pdfData;
    }
}
