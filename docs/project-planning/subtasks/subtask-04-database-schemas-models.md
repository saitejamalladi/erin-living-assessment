# Subtask 4: Database Schemas and Models

## Description
Define Mongoose schemas and models for the User and Notification collections based on the normalized design. Include validation, timestamps, and references. Set up database connection module with environment variables.

## Tasks
- Create user.schema.ts with fields: firstName, lastName, location, dateOfEvent, timestamps.
- Create notification.schema.ts with fields: userId (ref), type (enum), status (enum), nextRunAt, audit (object).
- Define enums for notification type and status.
- Create MongooseModule configuration in app.module.ts.
- Add database connection service with health check endpoint (/health).
- Ensure schemas enforce data integrity (e.g., required fields, date formats).

## Git Workflow
- Create a new feature branch: `git checkout -b feature/subtask-04-database-schemas-models`
- Commit changes with brief messages, e.g.:
  - "Define User schema"
  - "Define Notification schema"
  - "Add DB connection module"
- Before raising PR: Run `npm test` (initial tests if any) and `npm run build`, resolve errors, commit fixes.
- Raise PR to main with title "Add database schemas and models" and description "Implement Mongoose schemas for User and Notification with validation."</content>
<parameter name="filePath">/Users/saiteja/personal/erin-living/docs/subtask-04-database-schemas-models.md