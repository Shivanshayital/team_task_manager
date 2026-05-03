#!/usr/bin/env powershell
# Team Task Manager - Comprehensive API Test Suite

$baseURL = "http://localhost:5000/api"
$passed = 0
$failed = 0

function Test-API {
  param(
    [string]$name,
    [scriptblock]$test
  )
  try {
    & $test
    Write-Host "[PASS] $name"
    $global:passed++
    return $true
  } catch {
    Write-Host "[FAIL] $name - $($_.Exception.Message)"
    $global:failed++
    return $false
  }
}

Write-Host "========================================"
Write-Host "Team Task Manager - API Test Suite"
Write-Host "========================================"
Write-Host ""

# Test 1: Health Check
Write-Host "[TEST 1] Health Check"
Test-API "Server health endpoint" {
  $health = Invoke-RestMethod "$baseURL/health" -UseBasicParsing
  if (-not $health.message) { throw "No health message" }
}

# Test 2: Admin Signup
Write-Host "[TEST 2] Admin Signup"
$adminSignup = @{
  name     = "Admin User"
  email    = "admin@test.com"
  password = "password123"
  role     = "admin"
} | ConvertTo-Json

Test-API "Admin user registration" {
  $res = Invoke-RestMethod -Uri "$baseURL/auth/signup" -Method POST `
    -ContentType 'application/json' -Body $adminSignup -UseBasicParsing
  if (-not $res.token) { throw "No token returned" }
  $global:adminToken = $res.token
  $global:adminId = $res.user.id
}

# Test 3: Member Signup
Write-Host "[TEST 3] Member Signup"
$memberSignup = @{
  name     = "Member User"
  email    = "member@test.com"
  password = "password123"
  role     = "member"
} | ConvertTo-Json

Test-API "Member user registration" {
  $res = Invoke-RestMethod -Uri "$baseURL/auth/signup" -Method POST `
    -ContentType 'application/json' -Body $memberSignup -UseBasicParsing
  if (-not $res.token) { throw "No token returned" }
  $global:memberToken = $res.token
  $global:memberId = $res.user.id
}

# Test 4: Login
Write-Host "[TEST 4] Login"
$loginBody = @{
  email    = "admin@test.com"
  password = "password123"
} | ConvertTo-Json

Test-API "User login with valid credentials" {
  $res = Invoke-RestMethod -Uri "$baseURL/auth/login" -Method POST `
    -ContentType 'application/json' -Body $loginBody -UseBasicParsing
  if (-not $res.token) { throw "No token returned" }
}

# Test 5: Get Current User
Write-Host "[TEST 5] Get Current User"
$headers = @{
  "Authorization" = "Bearer $adminToken"
  "Content-Type"  = "application/json"
}

Test-API "Retrieve current user info" {
  $res = Invoke-RestMethod -Uri "$baseURL/auth/me" -Headers $headers -UseBasicParsing
  if ($res.user.id -ne $adminId) { throw "User ID mismatch" }
}

# Test 6: Create Project (Admin)
Write-Host "[TEST 6] Create Project"
$projectBody = @{
  name        = "Demo Project"
  description = "Test project for validation"
} | ConvertTo-Json

Test-API "Admin creates a project" {
  $res = Invoke-RestMethod -Uri "$baseURL/projects" -Method POST `
    -Headers $headers -Body $projectBody -UseBasicParsing
  if (-not $res.project._id) { throw "Project not created" }
  $global:projectId = $res.project._id
}

# Test 7: Member Cannot Create Project (RBAC)
Write-Host "[TEST 7] Member RBAC Test (Should Fail)"
$memberHeaders = @{
  "Authorization" = "Bearer $memberToken"
  "Content-Type"  = "application/json"
}

Test-API "Member cannot create project (403 Forbidden)" {
  try {
    $res = Invoke-RestMethod -Uri "$baseURL/projects" -Method POST `
      -Headers $memberHeaders -Body $projectBody -UseBasicParsing
    throw "Should have been blocked"
  } catch {
    if ($_.Exception.Response.StatusCode -ne 403) {
      throw "Expected 403, got $($_.Exception.Response.StatusCode)"
    }
  }
}

# Test 8: Add Member to Project
Write-Host "[TEST 8] Add Member to Project"
$addMemberBody = @{
  userId = $memberId
} | ConvertTo-Json

Test-API "Add member to project" {
  $res = Invoke-RestMethod -Uri "$baseURL/projects/$projectId/members" `
    -Method POST -Headers $headers -Body $addMemberBody -UseBasicParsing
  if ($res.project.members.Count -lt 1) { throw "Member not added" }
}

# Test 9: Create Task (Admin)
Write-Host "[TEST 9] Create Task"
$deadline = (Get-Date).AddDays(7).ToString('o')
$taskBody = @{
  title       = "Test Task"
  description = "Task for testing"
  projectId   = $projectId
  assignedTo  = $memberId
  deadline    = $deadline
  priority    = "high"
} | ConvertTo-Json

Test-API "Admin creates a task" {
  $res = Invoke-RestMethod -Uri "$baseURL/tasks" -Method POST `
    -Headers $headers -Body $taskBody -UseBasicParsing
  if (-not $res.task._id) { throw "Task not created" }
  $global:taskId = $res.task._id
}

# Test 10: Member Cannot Create Task (RBAC)
Write-Host "[TEST 10] Member RBAC Test for Tasks"
Test-API "Member cannot create task (403 Forbidden)" {
  try {
    $res = Invoke-RestMethod -Uri "$baseURL/tasks" -Method POST `
      -Headers $memberHeaders -Body $taskBody -UseBasicParsing
    throw "Should have been blocked"
  } catch {
    if ($_.Exception.Response.StatusCode -ne 403) {
      throw "Expected 403, got $($_.Exception.Response.StatusCode)"
    }
  }
}

# Test 11: Update Task Status
Write-Host "[TEST 11] Update Task Status"
$statusBody = @{
  status = "in-progress"
} | ConvertTo-Json

Test-API "Member updates task status" {
  $res = Invoke-RestMethod -Uri "$baseURL/tasks/$taskId/status" -Method PATCH `
    -Headers $memberHeaders -Body $statusBody -UseBasicParsing
  if ($res.task.status -ne "in-progress") { throw "Status not updated" }
}

# Test 12: Get Project Tasks
Write-Host "[TEST 12] Get Project Tasks"
Test-API "Retrieve all tasks in a project" {
  $res = Invoke-RestMethod -Uri "$baseURL/tasks/project/$projectId" `
    -Headers $headers -UseBasicParsing
  if ($res.tasks.Count -lt 1) { throw "No tasks found" }
}

# Test 13: Get User Tasks
Write-Host "[TEST 13] Get User Tasks"
Test-API "Retrieve user assigned tasks" {
  $res = Invoke-RestMethod -Uri "$baseURL/tasks/my-tasks" `
    -Headers $memberHeaders -UseBasicParsing
  if ($res.tasks.Count -lt 1) { throw "No tasks found" }
}

# Test 14: Overdue Task Detection
Write-Host "[TEST 14] Overdue Task Calculation"
$overdueDeadline = (Get-Date).AddDays(-1).ToString('o')
$overdueTaskBody = @{
  title       = "Overdue Task"
  description = "This task should be overdue"
  projectId   = $projectId
  deadline    = $overdueDeadline
  priority    = "high"
} | ConvertTo-Json

Test-API "System detects overdue tasks" {
  $res = Invoke-RestMethod -Uri "$baseURL/tasks" -Method POST `
    -Headers $headers -Body $overdueTaskBody -UseBasicParsing
  
  $tasks = Invoke-RestMethod -Uri "$baseURL/tasks/my-tasks" `
    -Headers $headers -UseBasicParsing
  
  $overdue = $tasks.tasks | Where-Object {
    [DateTime]$_.deadline -lt (Get-Date) -and $_.status -ne "completed"
  }
  
  if ($overdue.Count -lt 1) { throw "Overdue task not detected" }
}

# Test 15: Validation - Project Name Required
Write-Host "[TEST 15] Validation Tests"
Test-API "Project name is required" {
  try {
    $invalid = @{
      description = "No name"
    } | ConvertTo-Json
    $res = Invoke-RestMethod -Uri "$baseURL/projects" -Method POST `
      -Headers $headers -Body $invalid -UseBasicParsing
    throw "Should have failed"
  } catch {
    if ($_.Exception.Response.StatusCode -ne 400) {
      throw "Expected 400"
    }
  }
}

# Test 16: Validation - Task Title Required
Test-API "Task title is required" {
  try {
    $invalid = @{
      description = "No title"
      projectId   = $projectId
    } | ConvertTo-Json
    $res = Invoke-RestMethod -Uri "$baseURL/tasks" -Method POST `
      -Headers $headers -Body $invalid -UseBasicParsing
    throw "Should have failed"
  } catch {
    if ($_.Exception.Response.StatusCode -ne 400) {
      throw "Expected 400"
    }
  }
}

# Test 17: Get All Users
Write-Host "[TEST 16] Get All Users"
Test-API "Retrieve all registered users" {
  $res = Invoke-RestMethod -Uri "$baseURL/auth/users" `
    -Headers $headers -UseBasicParsing
  if ($res.users.Count -lt 2) { throw "Expected at least 2 users" }
}

# Test 18: Update Project
Write-Host "[TEST 17] Update Project"
$updateBody = @{
  name        = "Updated Project"
  description = "Updated description"
} | ConvertTo-Json

Test-API "Update project details" {
  $res = Invoke-RestMethod -Uri "$baseURL/projects/$projectId" -Method PUT `
    -Headers $headers -Body $updateBody -UseBasicParsing
  if ($res.project.name -ne "Updated Project") { throw "Name not updated" }
}

# Test 19: Delete Task
Write-Host "[TEST 18] Delete Task"
Test-API "Admin deletes a task" {
  $res = Invoke-RestMethod -Uri "$baseURL/tasks/$taskId" -Method DELETE `
    -Headers $headers -UseBasicParsing
  if (-not $res.message) { throw "Delete failed" }
}

# Test 20: Get User Projects
Write-Host "[TEST 19] Get User Projects"
Test-API "Retrieve user's projects" {
  $res = Invoke-RestMethod -Uri "$baseURL/projects/my-projects" `
    -Headers $headers -UseBasicParsing
  if ($res.projects.Count -lt 1) { throw "No projects found" }
}

# Summary
Write-Host ""
Write-Host "========================================"
Write-Host "TEST SUMMARY"
Write-Host "========================================"
Write-Host "Passed: $passed"
Write-Host "Failed: $failed"
Write-Host "Total:  $($passed + $failed)"

if ($failed -eq 0) {
  Write-Host ""
  Write-Host "All tests passed! Application is ready for deployment."
} else {
  Write-Host ""
  Write-Host "Some tests failed. Please review the errors above."
}
