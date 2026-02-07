# Subtask 2: NestJS Project Setup

## Description
Scaffold a new NestJS project for the Event Notification Scheduler using the NestJS CLI, install required dependencies (Mongoose, BullMQ, node-cron, Luxon, nestjs-pino, etc.), configure TypeScript, and set up basic project structure with modules for API, scheduler, and worker. Ensure the project is ready for development with proper package.json and tsconfig.json.

## Tasks
- Install NestJS CLI globally if needed.
- Generate new NestJS project in the root directory.
- Install dependencies: @nestjs/mongoose, bullmq, node-cron, luxon, nestjs-pino, @nestjs/swagger, jest.
- Configure TypeScript for strict mode and paths.
- Create initial module structure (app, user, notification, scheduler, worker).
- Add basic app.module.ts with imports for Mongoose, BullMQ, etc.
- Set up environment variables file (.env) for database and queue connections.

## Git Workflow
- Create a new feature branch: `git checkout -b feature/subtask-02-nestjs-project-setup`
- Commit changes with brief messages, e.g.:
  - "Scaffold NestJS project"
  - "Install dependencies"
  - "Configure modules and env"
- Before raising PR: Run `npm run build` to ensure no compilation errors, resolve if any, commit fixes.
- Raise PR to main with title "Setup NestJS project" and description "Initialize NestJS app with dependencies and basic structure."</content>
<parameter name="filePath">/Users/saiteja/personal/erin-living/docs/subtask-02-nestjs-project-setup.md