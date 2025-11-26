param (
    [string]$Email,
    [string]$Password = "Password123!"
)

[System.Net.ServicePointManager]::ServerCertificateValidationCallback = { $true }
$baseUrl = "http://localhost:5140/api"

if ([string]::IsNullOrWhiteSpace($Email)) {
    $randomId = Get-Random -Minimum 1000 -Maximum 9999
    $Email = "user_$randomId@example.com"
    Write-Host "No email provided. Generated random email: $Email"
}

Write-Host "Using Credentials: Email=$Email, Password=$Password"

# 1. Register
try {
    Write-Host "Registering user..."
    $registerBody = @{
        email    = $Email
        password = $Password
        name     = "Test User"
    } | ConvertTo-Json
    Invoke-RestMethod -Method Post -Uri "$baseUrl/Auth/register" -Body $registerBody -ContentType "application/json" -ErrorAction Stop
    Write-Host "User registered successfully."
}
catch {
    $errorMessage = $_.Exception.Message
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        $errorMessage = "$errorMessage. Response: $responseBody"
    }
    
    if ($errorMessage -match "User already exists") {
        Write-Host "User already exists, proceeding to login."
    }
    else {
        Write-Error "Registration failed: $errorMessage"
        # We try to proceed to login anyway, in case it was a transient error or user exists
    }
}

# 2. Login
Write-Host "Logging in..."
$loginBody = @{
    email    = $Email
    password = $Password
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Method Post -Uri "$baseUrl/Auth/login" -Body $loginBody -ContentType "application/json" -ErrorAction Stop
    $token = $loginResponse.token
    Write-Host "Login successful. Token obtained."
}
catch {
    Write-Error "Login failed. Error: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Error "Response Body: $responseBody"
    }
    exit
}

# 3. Data Definitions
$professions = @(
    @{ Title = "Software Engineer"; Skills = @("C#", "React", "SQL", "Azure", "Docker"); Summary = "Experienced developer building scalable web apps." },
    @{ Title = "Data Scientist"; Skills = @("Python", "Machine Learning", "Pandas", "TensorFlow", "SQL"); Summary = "Data-driven professional with expertise in predictive modeling." },
    @{ Title = "Product Manager"; Skills = @("Agile", "Jira", "Roadmapping", "User Research", "Communication"); Summary = "Product leader focused on user-centric design and business growth." },
    @{ Title = "UX Designer"; Skills = @("Figma", "Adobe XD", "Prototyping", "User Testing", "HTML/CSS"); Summary = "Creative designer passionate about intuitive user experiences." },
    @{ Title = "DevOps Engineer"; Skills = @("Kubernetes", "Terraform", "AWS", "CI/CD", "Bash"); Summary = "Infrastructure expert automating deployment pipelines." }
)

$locations = @("New York, NY", "London, UK", "Berlin, DE", "San Francisco, CA", "Remote")
$universities = @("MIT", "Stanford", "Oxford", "Cambridge", "ETH Zurich")

# 4. Generate CVs
for ($i = 0; $i -lt 10; $i++) {
    $prof = $professions[$i % $professions.Count]
    $cvTitle = "$($prof.Title) CV"
    
    $cvData = @{
        personalInfo = @{
            fullName = "Test User"
            title    = $prof.Title
            email    = $Email
            phone    = "555-010$i"
            location = $locations[$i % $locations.Count]
            summary  = $prof.Summary
        }
        experience   = @(
            @{
                id          = 1
                title       = "Senior $($prof.Title)"
                company     = "Tech Corp"
                location    = $locations[$i % $locations.Count]
                startDate   = "2020-01"
                endDate     = "Present"
                description = "Leading key projects and mentoring junior team members."
            },
            @{
                id          = 2
                title       = "Junior $($prof.Title)"
                company     = "Startup Inc"
                location    = $locations[$i % $locations.Count]
                startDate   = "2018-01"
                endDate     = "2019-12"
                description = "Contributed to core product development."
            }
        )
        education    = @(
            @{
                id        = 1
                school    = $universities[$i % $universities.Count]
                degree    = "Bachelor of Science"
                location  = $locations[$i % $locations.Count]
                startDate = "2014-09"
                endDate   = "2018-06"
                gpa       = "3.8"
            }
        )
        skills       = $prof.Skills | ForEach-Object { @{ id = (Get-Random); name = $_; level = (Get-Random -Minimum 3 -Maximum 6); showLevel = $true } }
        visibility   = @{
            personalInfo   = $true
            summary        = $true
            experience     = $true
            education      = $true
            skills         = $true
            languages      = $true
            interests      = $true
            customSections = $true
        }
    }

    $payload = @{
        title = $cvTitle
        data  = ($cvData | ConvertTo-Json -Depth 10)
    } | ConvertTo-Json

    Write-Host "Creating CV: $cvTitle"
    
    try {
        Invoke-RestMethod -Method Post -Uri "$baseUrl/Cv" -Headers @{ Authorization = "Bearer $token" } -Body $payload -ContentType "application/json"
        Write-Host "Successfully created $cvTitle"
    }
    catch {
        Write-Error "Failed to create $cvTitle : $_"
        if ($_.Exception.Response) {
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            $responseBody = $reader.ReadToEnd()
            Write-Error "Response Body: $responseBody"
        }
    }
}

Write-Host "Done."
