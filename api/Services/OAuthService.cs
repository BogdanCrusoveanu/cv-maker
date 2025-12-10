using System.Net.Http.Headers;
using System.Text.Json;

namespace CvMaker.Api.Services;

public class OAuthService
{
    private readonly IConfiguration _configuration;
    private readonly HttpClient _httpClient;

    public OAuthService(IConfiguration configuration, HttpClient httpClient)
    {
        _configuration = configuration;
        _httpClient = httpClient;
    }

    public async Task<OAuthUserInfo?> GetGoogleUserAsync(string code)
    {
        var clientId = _configuration["Authentication:Google:ClientId"] ?? "";
        var clientSecret = _configuration["Authentication:Google:ClientSecret"] ?? "";
        var redirectUri = _configuration["Authentication:Google:RedirectUri"] ?? "http://localhost:5140/api/auth/external-callback/google";

        // Exchange Code for Token
        var tokenResponse = await _httpClient.PostAsync("https://oauth2.googleapis.com/token", new FormUrlEncodedContent(new Dictionary<string, string>
        {
            {"code", code},
            {"client_id", clientId},
            {"client_secret", clientSecret},
            {"redirect_uri", redirectUri},
            {"grant_type", "authorization_code"}
        }));

        if (!tokenResponse.IsSuccessStatusCode) return null;

        var tokenContent = await tokenResponse.Content.ReadAsStringAsync();
        var tokenData = JsonSerializer.Deserialize<JsonElement>(tokenContent);
        var accessToken = tokenData.GetProperty("access_token").GetString();

        // Get User Info
        _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
        var userResponse = await _httpClient.GetAsync("https://www.googleapis.com/oauth2/v2/userinfo");
        
        if (!userResponse.IsSuccessStatusCode) return null;

        var userContent = await userResponse.Content.ReadAsStringAsync();
        var userData = JsonSerializer.Deserialize<JsonElement>(userContent);

        return new OAuthUserInfo
        {
            Id = userData.GetProperty("id").GetString()!,
            Email = userData.GetProperty("email").GetString()!,
            Name = userData.GetProperty("name").GetString()!,
            AvatarUrl = userData.TryGetProperty("picture", out var pic) ? pic.GetString() : null
        };
    }

    public async Task<OAuthUserInfo?> GetLinkedInUserAsync(string code)
    {
        var clientId = _configuration["Authentication:LinkedIn:ClientId"] ?? "";
        var clientSecret = _configuration["Authentication:LinkedIn:ClientSecret"] ?? "";
        var redirectUri = _configuration["Authentication:LinkedIn:RedirectUri"] ?? "http://localhost:5140/api/auth/external-callback/linkedin";

        // Exchange Code for Token
        var tokenResponse = await _httpClient.PostAsync("https://www.linkedin.com/oauth/v2/accessToken", new FormUrlEncodedContent(new Dictionary<string, string>
        {
            {"code", code},
            {"client_id", clientId},
            {"client_secret", clientSecret},
            {"redirect_uri", redirectUri},
            {"grant_type", "authorization_code"}
        }));

        if (!tokenResponse.IsSuccessStatusCode) return null;

        var tokenContent = await tokenResponse.Content.ReadAsStringAsync();
        var tokenData = JsonSerializer.Deserialize<JsonElement>(tokenContent);
        var accessToken = tokenData.GetProperty("access_token").GetString();

        // Get User Info (OpenID Connect)
        _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
        var userResponse = await _httpClient.GetAsync("https://api.linkedin.com/v2/userinfo");

        if (!userResponse.IsSuccessStatusCode) return null;
        
        var userContent = await userResponse.Content.ReadAsStringAsync();
        var userData = JsonSerializer.Deserialize<JsonElement>(userContent);

        return new OAuthUserInfo
        {
            Id = userData.GetProperty("sub").GetString()!,
            Name = userData.GetProperty("name").GetString()!,
            Email = userData.GetProperty("email").GetString()!,
            AvatarUrl = userData.TryGetProperty("picture", out var pic) ? pic.GetString() : null
        };
    }

    public async Task<OAuthUserInfo?> GetGitHubUserAsync(string code)
    {
        var clientId = _configuration["Authentication:GitHub:ClientId"] ?? "";
        var clientSecret = _configuration["Authentication:GitHub:ClientSecret"] ?? "";
        var redirectUri = _configuration["Authentication:GitHub:RedirectUri"] ?? "http://localhost:5140/api/auth/external-callback/github";

        // Exchange Code for Token (GitHub uses JSON response by default if Accept header set, but basic is form)
        var request = new HttpRequestMessage(HttpMethod.Post, "https://github.com/login/oauth/access_token");
        request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
        request.Content = new FormUrlEncodedContent(new Dictionary<string, string>
        {
            {"client_id", clientId},
            {"client_secret", clientSecret},
            {"code", code},
            {"redirect_uri", redirectUri}
        });

        var tokenResponse = await _httpClient.SendAsync(request);
        if (!tokenResponse.IsSuccessStatusCode) return null;

        var tokenContent = await tokenResponse.Content.ReadAsStringAsync();
        var tokenData = JsonSerializer.Deserialize<JsonElement>(tokenContent);
        
        if (!tokenData.TryGetProperty("access_token", out var tokenProp)) return null;
        var accessToken = tokenProp.GetString();

        // Get User Info
        request = new HttpRequestMessage(HttpMethod.Get, "https://api.github.com/user");
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
        request.Headers.UserAgent.Add(new ProductInfoHeaderValue("CvMaker", "1.0")); // GitHub requires User-Agent

        var userResponse = await _httpClient.SendAsync(request);
        if (!userResponse.IsSuccessStatusCode) return null;

        var userContent = await userResponse.Content.ReadAsStringAsync();
        var userData = JsonSerializer.Deserialize<JsonElement>(userContent);

        // GitHub email might be private, need separate call if null/empty, but for now take public
        string? email = userData.TryGetProperty("email", out var emailProp) ? emailProp.GetString() : null;

        if (string.IsNullOrEmpty(email))
        {
            // Fetch emails
            var emailReq = new HttpRequestMessage(HttpMethod.Get, "https://api.github.com/user/emails");
            emailReq.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
            emailReq.Headers.UserAgent.Add(new ProductInfoHeaderValue("CvMaker", "1.0"));
            
            var emailResp = await _httpClient.SendAsync(emailReq);
            if (emailResp.IsSuccessStatusCode)
            {
                var emails = JsonSerializer.Deserialize<JsonElement>(await emailResp.Content.ReadAsStringAsync());
                foreach (var mail in emails.EnumerateArray())
                {
                    if (mail.GetProperty("primary").GetBoolean())
                    {
                        email = mail.GetProperty("email").GetString();
                        break;
                    }
                }
            }
        }

        return new OAuthUserInfo
        {
            Id = userData.GetProperty("id").GetInt32().ToString(), // GitHub ID is int
            Name = userData.TryGetProperty("name", out var nameProp) ? nameProp.GetString() ?? userData.GetProperty("login").GetString()! : userData.GetProperty("login").GetString()!,
            Email = email ?? "",
            AvatarUrl = userData.TryGetProperty("avatar_url", out var av) ? av.GetString() : null
        };
    }
}

public class OAuthUserInfo
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? AvatarUrl { get; set; }
}
