$baseUrl = "http://localhost:3000/api"

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "     SnailSite API Testing Script        " -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

# 1. Test Registration
Write-Host "`n[1] Testing User Registration..." -ForegroundColor Yellow
$registerBody = @{
    name = "Test Snail"
    email = "test.snail@example.com"
    password = "password123"
    confirm_password = "password123"
} | ConvertTo-Json

try {
    $registerResponse = Invoke-RestMethod -Uri "$baseUrl/auth/register" -Method Post -Body $registerBody -ContentType "application/json"
    Write-Host "Success!" -ForegroundColor Green
    $registerResponse | ConvertTo-Json -Depth 5
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails) { Write-Host $_.ErrorDetails.Message -ForegroundColor Red }
}

# 2. Test Login
Write-Host "`n[2] Testing User Login..." -ForegroundColor Yellow
$loginBody = @{
    email = "test.snail@example.com"
    password = "password123"
} | ConvertTo-Json

$token = ""
$userId = ""

try {
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
    Write-Host "Success!" -ForegroundColor Green
    $loginResponse | ConvertTo-Json -Depth 5
    $token = $loginResponse.token
    $userId = $loginResponse.user.id
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails) { Write-Host $_.ErrorDetails.Message -ForegroundColor Red }
}

# 3. Test Get All Users
Write-Host "`n[3] Testing Get All Users..." -ForegroundColor Yellow
try {
    # Assuming token is needed, although we didn't add auth middleware to GET /users in user.routes.js in the last snippet, but we pass it anyway
    $headers = @{}
    if ($token) { $headers["Authorization"] = "Bearer $token" }

    $usersResponse = Invoke-RestMethod -Uri "$baseUrl/users" -Method Get -Headers $headers
    Write-Host "Success!" -ForegroundColor Green
    $usersResponse | ConvertTo-Json -Depth 5
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails) { Write-Host $_.ErrorDetails.Message -ForegroundColor Red }
}

# 4. Test Update User
if ($userId) {
    Write-Host "`n[4] Testing Update User (ID: $userId)..." -ForegroundColor Yellow
    $updateBody = @{
        name = "Updated Fast Snail"
    } | ConvertTo-Json

    try {
        $updateResponse = Invoke-RestMethod -Uri "$baseUrl/users/$userId" -Method Put -Body $updateBody -ContentType "application/json" -Headers $headers
        Write-Host "Success!" -ForegroundColor Green
        $updateResponse | ConvertTo-Json -Depth 5
    } catch {
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
        if ($_.ErrorDetails) { Write-Host $_.ErrorDetails.Message -ForegroundColor Red }
    }
} else {
    Write-Host "`n[4] Skipping Update User (No user ID available from login)" -ForegroundColor Gray
}

# 5. Test Delete User
if ($userId) {
    Write-Host "`n[5] Testing Delete User (ID: $userId)..." -ForegroundColor Yellow
    try {
        $deleteResponse = Invoke-RestMethod -Uri "$baseUrl/users/$userId" -Method Delete -Headers $headers
        Write-Host "Success!" -ForegroundColor Green
        $deleteResponse | ConvertTo-Json -Depth 5
    } catch {
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
        if ($_.ErrorDetails) { Write-Host $_.ErrorDetails.Message -ForegroundColor Red }
    }
} else {
    Write-Host "`n[5] Skipping Delete User (No user ID available from login)" -ForegroundColor Gray
}

Write-Host "`n=========================================" -ForegroundColor Cyan
Write-Host "          Testing Complete!              " -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
