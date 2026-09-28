$ErrorActionPreference = 'Stop'
$repo = (Get-Location).Path
$savedDir = Join-Path $repo 'saved'
New-Item -ItemType Directory -Force -Path $savedDir | Out-Null

function Save-Json {
    param(
        [string]$Name,
        [object]$Data
    )

    $path = Join-Path $savedDir "$Name.json"
    $Data | ConvertTo-Json -Depth 10 | Set-Content -Path $path -Encoding utf8
    return $path
}

function Save-Text {
    param(
        [string]$Name,
        [string]$Data
    )

    $path = Join-Path $savedDir "$Name.txt"
    Set-Content -Path $path -Value $Data -Encoding utf8
    return $path
}

$serverProcess = Start-Process -FilePath 'node' -ArgumentList @('server.js') -WorkingDirectory $repo -PassThru -WindowStyle Hidden

$maxAttempts = 30
for ($i = 0; $i -lt $maxAttempts; $i++) {
    try {
        $response = Invoke-WebRequest -Uri 'http://localhost:3000/' -TimeoutSec 2
        if ($response.StatusCode -eq 200) { break }
    }
    catch {
        Start-Sleep -Seconds 1
    }
}

$root = Invoke-RestMethod -Uri 'http://localhost:3000/'
Save-Json -Name 'task1_root' -Data $root

$registerData = @{ username = 'charlie'; password = 'pass123' } | ConvertTo-Json
$registerResponse = Invoke-RestMethod -Uri 'http://localhost:3000/register' -Method Post -ContentType 'application/json' -Body $registerData
Save-Json -Name 'task7_register' -Data $registerResponse

$loginData = @{ username = 'charlie'; password = 'pass123' } | ConvertTo-Json
$loginResponse = Invoke-RestMethod -Uri 'http://localhost:3000/login' -Method Post -ContentType 'application/json' -Body $loginData
Save-Json -Name 'task8_login' -Data $loginResponse

$token = $loginResponse.token
$headers = @{ Authorization = "Bearer $token" }

$allBooks = Invoke-RestMethod -Uri 'http://localhost:3000/books' -Headers $headers
Save-Json -Name 'task2_books' -Data $allBooks

$isbnBook = Invoke-RestMethod -Uri 'http://localhost:3000/books/9780132350884' -Headers $headers
Save-Json -Name 'task3_isbn_book' -Data $isbnBook

$authorBooks = Invoke-RestMethod -Uri 'http://localhost:3000/books?author=Robert%20C.%20Martin' -Headers $headers
Save-Json -Name 'task4_author_books' -Data $authorBooks

$titleBooks = Invoke-RestMethod -Uri 'http://localhost:3000/books?title=Clean' -Headers $headers
Save-Json -Name 'task5_title_books' -Data $titleBooks

$reviews = Invoke-RestMethod -Uri 'http://localhost:3000/books/9780132350884/reviews' -Headers $headers
Save-Json -Name 'task6_reviews' -Data $reviews

$addReviewBody = @{ review = 'This book helped me write cleaner API code.'; user = 'charlie' } | ConvertTo-Json
$addReviewResponse = Invoke-RestMethod -Uri 'http://localhost:3000/books/9780132350884/reviews' -Method Post -ContentType 'application/json' -Headers $headers -Body $addReviewBody
Save-Json -Name 'task9_add_review' -Data $addReviewResponse

$updateReviewBody = @{ review = 'Updated review from charlie about cleaner API patterns.'; user = 'charlie' } | ConvertTo-Json
$updateReviewResponse = Invoke-RestMethod -Uri 'http://localhost:3000/books/9780132350884/reviews' -Method Put -ContentType 'application/json' -Headers $headers -Body $updateReviewBody
Save-Json -Name 'task9_update_review' -Data $updateReviewResponse

$deleteReviewBody = @{ user = 'charlie' } | ConvertTo-Json
$deleteReviewResponse = Invoke-RestMethod -Uri 'http://localhost:3000/books/9780132350884/reviews' -Method Delete -ContentType 'application/json' -Headers $headers -Body $deleteReviewBody
Save-Json -Name 'task10_delete_review' -Data $deleteReviewResponse

Save-Text -Name 'task11_github_url' -Data 'https://github.com/your-user/expressBookReview'

Stop-Process -Id $serverProcess.Id -Force

Write-Host "Saved grading outputs to $savedDir"
