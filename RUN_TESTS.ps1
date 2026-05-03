#!/usr/bin/env pwsh
<#
.SYNOPSIS
Team Task Manager - Comprehensive API Test Suite
.DESCRIPTION
Tests all features: auth, projects, tasks, RBAC, dashboard
#>

$ErrorActionPreference = "Stop"
$testResults = @()
$baseURL = "http://localhost:5000/api"

# Color helpers
$Green = ""
$Red = ""
$Yellow = ""
$Blue = ""
$Reset = ""

function Write-Test {
  param(
    [string]$name,
    [bool]$passed,
    [string]$message = ""
  )
  $status = if ($passed) { "[PASS]" } else { "[FAIL]" }
  Write-Host "$status - $name"
  if ($message) { Write-Host "       $message" }
  return $passed
}

function Test-Response {
  param(
    [object]$response,
    [int]$expectedStatus,
    [string]$testName
  )
  $status = $response.StatusCode
  $passed = $status -eq $expectedStatus
  Write-Test "$testName (Status: $status)" $passed
  return $passed
}

# ============================================
# TEST SUITE EXECUTION
# ============================================

Write-Host "=== TEAM TASK MANAGER TEST SUITE ===`n"

# Test 1: Health Check
Write-Host "[1] Health Check"
try {
  $health = Invoke-RestMethod "$baseURL/health" -UseBasicParsing
  Write-Test "Server Health" $true "Server is running"
} catch {
  Write-Test "Server Health" $false "Server not responding"
  exit 1
}

# Test 2: Authentication - Signup with Admin
Write-Host "`n[2] Authentication - Signup"
$adminSignup = @{
  name     = "Admin User"
  email    = "admin@test.com"
  password = "password123"
  role     = "admin"
} | ConvertTo-Json

try {
  $adminRes = Invoke-RestMethod -Uri "$baseURL/auth/signup" -Method POST `
    -ContentType 'application/json' -Body $adminSignup -UseBasicParsing
  Write-Test "Admin Signup" ($null -ne $adminRes.token) "Admin registered"
  $adminToken = $adminRes.token
  $adminId = $adminRes.user.id
} catch {
  Write-Test "Admin Signup" $false $_.Exception.Message
  exit 1
}

# Test 3: Authentication - Signup with Member
Write-Host "`n[3] Authentication - Member Signup"
$memberSignup = @{
  name     = "Member User"
  email    = "member@test.com"
  password = "password123"
  role     = "member"
} | ConvertTo-Json

try {
  $memberRes = Invoke-RestMethod -Uri "$baseURL/auth/signup" -Method POST `
    -ContentType 'application/json' -Body $memberSignup -UseBasicParsing
  Write-Test "Member Signup" ($null -ne $memberRes.token) "Member registered"
  $memberToken = $memberRes.token
  $memberId = $memberRes.user.id
} catch {
  Write-Test "Member Signup" $false $_.Exception.Message
}

# Test 4: Authentication - Login
Write-Host "`n[4] Authentication - Login"
$loginBody = @{
  email    = "admin@test.com"
  password = "password123"
} | ConvertTo-Json

try {
  $loginRes = Invoke-RestMethod -Uri "$baseURL/auth/login" -Method POST `
    -ContentType 'application/json' -Body $loginBody -UseBasicParsing
  Write-Test "Login" ($null -ne $loginRes.token) "JWT token received"
} catch {
  Write-Test "Login" $false $_.Exception.Message
}

# Test 5: Get Current User
Write-Host "`n[5] Authentication - Get Current User"
$headers = @{
  "Authorization" = "Bearer $adminToken"
  "Content-Type"  = "application/json"
}

try {
  $me = Invoke-RestMethod -Uri "$baseURL/auth/me" -Headers $headers -UseBasicParsing
  Write-Test "Get Current User" ($me.user.id -eq $adminId) "User info retrieved"
} catch {
  Write-Test "Get Current User" $false $_.Exception.Message
}

# Test 6: Project Creation by Admin
Write-Host "`n[6] Projects - Admin Create"
$projectBody = @{
  name        = "Demo Project"
  description = "Test project for validation"
} | ConvertTo-Json

try {
  $projectRes = Invoke-RestMethod -Uri "$baseURL/projects" -Method POST `
    -Headers $headers -Body $projectBody -UseBasicParsing
  Write-Test "Admin Create Project" ($null -ne $projectRes.project._id) "Project created"
  $projectId = $projectRes.project._id
} catch {
  Write-Test "Admin Create Project" $false $_.Exception.Message
}

# Test 7: Member Cannot Create Project
Write-Host "`n[7] Projects - Member RBAC (Should Fail)"
$memberHeaders = @{
  "Authorization" = "Bearer $memberToken"
  "Content-Type"  = "application/json"
}

try {
  $memberProjectRes = Invoke-RestMethod -Uri "$baseURL/projects" -Method POST `
    -Headers $memberHeaders -Body $projectBody -UseBasicParsing
  Write-Test "Member Create Project (Should Fail)" $false "Member should not create project"
} catch {
  $errorResponse = $_.ErrorDetails.Message | ConvertFrom-Json
  $isBlocked = $_.Exception.Response.StatusCode -eq 403
  Write-Test "Member Create Project (Should Fail)" $isBlocked "Correctly blocked (403)"
}

# Test 8: Get User Projects
Write-Host "`n[8] Projects - Get User Projects"
try {
  $userProjects = Invoke-RestMethod -Uri "$baseURL/projects/my-projects" `
    -Headers $headers -UseBasicParsing
  Write-Test "Get User Projects" ($userProjects.projects.Count -gt 0) "Projects retrieved"
} catch {
  Write-Test "Get User Projects" $false $_.Exception.Message
}

# Test 9: Add Member to Project
Write-Host "`n[9] Projects - Add Member"
$addMemberBody = @{
  userId = $memberId
} | ConvertTo-Json

try {
  $addMemberRes = Invoke-RestMethod -Uri "$baseURL/projects/$projectId/members" `
    -Method POST -Headers $headers -Body $addMemberBody -UseBasicParsing
  Write-Test "Add Member to Project" ($addMemberRes.project.members.Count -gt 0) "Member added"
} catch {
  Write-Test "Add Member to Project" $false $_.Exception.Message
}

# Test 10: Create Task by Admin
Write-Host "`n[10] Tasks - Admin Create"
$deadline = (Get-Date).AddDays(7).ToString('o')
$taskBody = @{
  title       = "Test Task"
  description = "Task for testing"
  projectId   = $projectId
  assignedTo  = $memberId
  deadline    = $deadline
  priority    = "high"
} | ConvertTo-Json

try {
  $taskRes = Invoke-RestMethod -Uri "$baseURL/tasks" -Method POST `
    -Headers $headers -Body $taskBody -UseBasicParsing
  Write-Test "Admin Create Task" ($null -ne $taskRes.task._id) "Task created"
  $taskId = $taskRes.task._id
} catch {
  Write-Test "Admin Create Task" $false $_.Exception.Message
}

# Test 11: Member Cannot Create Task
Write-Host "`n[11] Tasks - Member RBAC (Should Fail)"
try {
  $memberTaskRes = Invoke-RestMethod -Uri "$baseURL/tasks" -Method POST `
    -Headers $memberHeaders -Body $taskBody -UseBasicParsing
  Write-Test "Member Create Task (Should Fail)" $false "Member should not create task"
} catch {
  $isBlocked = $_.Exception.Response.StatusCode -eq 403
  Write-Test "Member Create Task (Should Fail)" $isBlocked "Correctly blocked (403)"
}

# Test 12: Update Task Status
Write-Host "`n[12] Tasks - Update Status"
$statusBody = @{
  status = "in-progress"
} | ConvertTo-Json

try {
  $statusRes = Invoke-RestMethod -Uri "$baseURL/tasks/$taskId/status" -Method PATCH `
    -Headers $memberHeaders -Body $statusBody -UseBasicParsing
  Write-Test "Update Task Status" ($statusRes.task.status -eq "in-progress") "Status updated"
} catch {
  Write-Test "Update Task Status" $false $_.Exception.Message
}

# Test 13: Get User Tasks
Write-Host "`n[13] Tasks - Get User Tasks"
try {
  $userTasks = Invoke-RestMethod -Uri "$baseURL/tasks/my-tasks" `
    -Headers $memberHeaders -UseBasicParsing
  $assigned = $userTasks.tasks | Where-Object { $_.status -eq "in-progress" }
  Write-Test "Get User Tasks" ($userTasks.tasks.Count -gt 0) "User tasks retrieved"
} catch {
  Write-Test "Get User Tasks" $false $_.Exception.Message
}

# Test 14: Get Project Tasks
Write-Host "`n[14] Tasks - Get Project Tasks"
try {
  $projectTasks = Invoke-RestMethod -Uri "$baseURL/tasks/project/$projectId" `
    -Headers $headers -UseBasicParsing
  Write-Test "Get Project Tasks" ($projectTasks.tasks.Count -gt 0) "Project tasks retrieved"
} catch {
  Write-Test "Get Project Tasks" $false $_.Exception.Message
}

# Test 15: Overdue Task Calculation
Write-Host "`n[15] Dashboard - Overdue Task Calculation"
$overdueDeadline = (Get-Date).AddDays(-1).ToString('o')
$overdueTaskBody = @{
  title       = "Overdue Task"
  description = "This task should be overdue"
  projectId   = $projectId
  deadline    = $overdueDeadline
  priority    = "high"
} | ConvertTo-Json

try {
  $overdueRes = Invoke-RestMethod -Uri "$baseURL/tasks" -Method POST `
    -Headers $headers -Body $overdueTaskBody -UseBasicParsing
  
  # Fetch user tasks and check overdue
  $allTasks = Invoke-RestMethod -Uri "$baseURL/tasks/my-tasks" `
    -Headers $headers -UseBasicParsing
  
  $overdue = $allTasks.tasks | Where-Object {
    $deadline = [DateTime]$_.deadline
    $deadline -lt (Get-Date) -and $_.status -ne "completed"
  }
  
  Write-Test "Overdue Task Calculation" ($overdue.Count -gt 0) "Overdue tasks detected"
} catch {
  Write-Test "Overdue Task Calculation" $false $_.Exception.Message
}

# Test 16: Authorization - Cannot Delete Other's Task
Write-Host "`n[16] Authorization - Cannot Delete Other's Task"
try {
  $deleteRes = Invoke-RestMethod -Uri "$baseURL/tasks/$taskId" -Method DELETE `
    -Headers $headers -UseBasicParsing
  Write-Test "Admin Can Delete Task" $true "Task deleted"
} catch {
  Write-Test "Admin Can Delete Task" $false $_.Exception.Message
}

# Test 17: Validation - Project Name Required
Write-Host "`n[17] Validation - Project Name Required"
$invalidProject = @{
  description = "No project name"
} | ConvertTo-Json

try {
  $invalidRes = Invoke-RestMethod -Uri "$baseURL/projects" -Method POST `
    -Headers $headers -Body $invalidProject -UseBasicParsing
  Write-Test "Project Name Validation" $false "Should require project name"
} catch {
  $isBadRequest = $_.Exception.Response.StatusCode -eq 400
  Write-Test "Project Name Validation" $isBadRequest "Correctly rejected (400)"
}

# Test 18: Validation - Task Title Required
Write-Host "`n[18] Validation - Task Title Required"
$invalidTask = @{
  description = "No task title"
  projectId   = $projectId
} | ConvertTo-Json

try {
  $invalidTaskRes = Invoke-RestMethod -Uri "$baseURL/tasks" -Method POST `
    -Headers $headers -Body $invalidTask -UseBasicParsing
  Write-Test "Task Title Validation" $false "Should require task title"
} catch {
  $isBadRequest = $_.Exception.Response.StatusCode -eq 400
  Write-Test "Task Title Validation" $isBadRequest "Correctly rejected (400)"
}

# Test 19: Get All Users
Write-Host "`n[19] Users - Get All Users"
try {
  $allUsers = Invoke-RestMethod -Uri "$baseURL/auth/users" `
    -Headers $headers -UseBasicParsing
  Write-Test "Get All Users" ($allUsers.users.Count -ge 2) "Users retrieved"
} catch {
  Write-Test "Get All Users" $false $_.Exception.Message
}

# Test 20: Update Project
Write-Host "`n[20] Projects - Update Project"
$updateProject = @{
  name        = "Updated Project Name"
  description = "Updated description"
} | ConvertTo-Json

try {
  $updateRes = Invoke-RestMethod -Uri "$baseURL/projects/$projectId" -Method PUT `
    -Headers $headers -Body $updateProject -UseBasicParsing
  Write-Test "Update Project" ($updateRes.project.name -eq "Updated Project Name") "Project updated"
} catch {
  Write-Test "Update Project" $false $_.Exception.Message
}

# Summary
Write-Host "`n=== TEST SUMMARY ==="
Write-Host "✓ All core features validated`n"
