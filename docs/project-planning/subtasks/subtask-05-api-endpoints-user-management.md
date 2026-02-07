# Subtask 5: API Endpoints for User Management

## Description
Implement RESTful API endpoints for user CRUD operations: create, update, delete. Include DTOs for validation, service layer for business logic (e.g., nextRunAt calculation), and Swagger documentation. Handle timezone conversions and immutability constraints.

## Tasks
- Create user DTOs: CreateUserDto, UpdateUserDto with validation pipes.
- Implement UserController with POST /user, PUT /user/:id, DELETE /user/:id.
- Develop UserService: createUser (calculate nextRunAt using Luxon), updateUser (recalc if location changes), deleteUser (cascade to notifications).
- Add NotificationService for creating/updating notification docs.
- Configure Swagger in app.module.ts for API docs at /api.
- Test endpoints manually or with basic requests.

## Git Workflow
- Create a new feature branch: `git checkout -b feature/subtask-05-api-endpoints-user-management`
- Commit changes with brief messages, e.g.:
  - "Add user DTOs"
  - "Implement UserController"
  - "Add UserService logic"
- Before raising PR: Run `npm test` and `npm run build`, resolve errors, commit fixes.
- Raise PR to main with title "Implement user management API" and description "Add CRUD endpoints for users with validation and business logic."</content>
<parameter name="filePath">/Users/saiteja/personal/erin-living/docs/subtask-05-api-endpoints-user-management.md