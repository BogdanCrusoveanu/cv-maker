param (
    [string]$Email,
    [string]$Password = "Password123!"
)

[System.Net.ServicePointManager]::ServerCertificateValidationCallback = { $true }
$baseUrl = "http://localhost:5140/api"

if ([string]::IsNullOrWhiteSpace($Email)) {
    Write-Error "Email is required."
    exit
}

Write-Host "Seeding for: $Email"

$body = @{
    email    = $Email
    password = $Password
} | ConvertTo-Json

try {
    Invoke-RestMethod -Method Post -Uri "$baseUrl/Seeding/seed" -Body $body -ContentType "application/json" -ErrorAction Stop
    Write-Host "Seeding completed successfully."
}
catch {
    Write-Error "Seeding failed: $_"
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Error "Response Body: $responseBody"
    }
}
