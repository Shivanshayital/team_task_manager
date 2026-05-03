# Team Task Manager - Comprehensive Test Suite

## Test Scenarios

### 1. Authentication Tests
- [x] Signup with valid data
- [x] Login with valid credentials
- [x] Reject invalid email format
- [x] Reject short passwords
- [x] JWT token validation
- [x] Token expiration (7 days)

### 2. Project Management Tests
- [ ] Admin can create projects
- [ ] Member cannot create projects (403)
- [ ] Get all projects
- [ ] Get user's projects
- [ ] Update own project
- [ ] Delete own project
- [ ] Add member to project
- [ ] Remove member from project

### 3. Task Management Tests
- [ ] Admin can create tasks
- [ ] Task requires title and projectId
- [ ] Task assignment to project members
- [ ] Get all tasks
- [ ] Get user tasks (assigned or created)
- [ ] Get project tasks
- [ ] Update task (title, description, priority, deadline)
- [ ] Update task status (pending → in-progress → completed)
- [ ] Delete task (creator or admin)
- [ ] Cannot update/delete task without permission (403)

### 4. Role-Based Access Control (RBAC)
- [ ] Admin role permissions
  - Create projects
  - Create tasks
  - Delete any project/task
  - Update any project/task
- [ ] Member role permissions
  - View projects they're part of
  - View tasks assigned to them
  - Update own assigned tasks
  - Cannot create projects (403)
  - Cannot create tasks (403)
  - Cannot delete projects (403)

### 5. Dashboard & Status Tests
- [ ] Dashboard shows total tasks
- [ ] Dashboard shows pending tasks
- [ ] Dashboard shows in-progress tasks
- [ ] Dashboard shows completed tasks
- [ ] Dashboard shows overdue tasks
- [ ] Overdue calculation: deadline < now AND status != completed

### 6. Validation Tests
- [ ] Project name required
- [ ] Task title required
- [ ] Task projectId required
- [ ] Email format validation
- [ ] Password min length (6 chars)
- [ ] Status enum validation (pending, in-progress, completed)
- [ ] Priority enum validation (low, medium, high)

### 7. Relationship Tests
- [ ] Task has valid projectId (must exist)
- [ ] Task has valid createdBy (must exist)
- [ ] Task has valid assignedTo (optional, must be project member)
- [ ] Project has valid owner
- [ ] Project members list populated correctly

---

## Test Results (Will be updated after execution)

### Backend API Tests Status: ⏳ PENDING
### Frontend UI Tests Status: ⏳ PENDING
### Integration Tests Status: ⏳ PENDING
### RBAC Tests Status: ⏳ PENDING

---

## How to Run Tests Locally

### Prerequisites
- Backend running on `http://localhost:5000`
- MongoDB Atlas connected with IP whitelisted
- `.env` file in `server/` with valid credentials

### Run All Tests
```bash
# See RUN_TESTS.ps1 for automated testing
```

### Manual Testing Steps
1. Start backend: `npm run dev` from root
2. Start frontend: `npm run dev` from client
3. Run the Postman collection (if available) or execute curl commands

---

Last Updated: May 3, 2026
