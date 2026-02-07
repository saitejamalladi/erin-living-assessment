# Implementation Plan for Event Notification Scheduler

## Overview
This implementation plan outlines the phased development of the Event Notification Scheduler, a scalable backend system for managing recurring notifications (starting with birthdays) using an event-driven Producer-Consumer architecture. The project leverages NestJS, MongoDB, BullMQ, and Docker Compose, with a focus on reliability, extensibility, and test-driven development (TDD).

This plan is based on the requirements outlined in [requirements.md](../requirements.md) and the technical design in [tech-design.md](../tech-design.md).

The plan is divided into 13 subtasks, covering setup, backend development, frontend, testing, documentation, and deployment. Each subtask includes Git workflow instructions: create a feature branch, make commits with brief messages, run unit tests and build before raising a PR to main, resolve any issues, commit fixes, and then raise the PR. The developer will handle PR creation separately.

## Subtasks
1. **[Subtask 1.1: Create Chatmodes and Instructions](subtasks/subtask-01-1-chatmodes-instructions.md)** - Create chatmodes and instructions files.
2. **[Subtask 1: Local Git Setup](subtasks/subtask-01-local-git-setup.md)** - Initialize Git repository in the current directory (/erin-living-assessment) and configure basic settings.
3. **[Subtask 2: NestJS Project Setup](subtasks/subtask-02-nestjs-project-setup.md)** - Scaffold the NestJS application with dependencies.
4. **[Subtask 3: Docker Compose Setup](subtasks/subtask-03-docker-compose-setup.md)** - Configure containers for app, Redis, and MongoDB.
5. **[Subtask 4: Database Schemas and Models](subtasks/subtask-04-database-schemas-models.md)** - Define Mongoose schemas for User and Notification collections.
6. **[Subtask 5: API Endpoints for User Management](subtasks/subtask-05-api-endpoints-user-management.md)** - Implement CRUD endpoints for users with validation.
7. **[Subtask 6: Scheduler (Producer) Implementation](subtasks/subtask-06-scheduler-producer-implementation.md)** - Develop the cron-based producer to poll and queue notifications.
8. **[Subtask 7: Worker (Consumer) Implementation](subtasks/subtask-07-worker-consumer-implementation.md)** - Build the queue processor to send notifications and update schedules.
9. **[Subtask 8: Queue Configuration](subtasks/subtask-08-queue-configuration.md)** - Set up BullMQ with retries, rate limiting, and error handling.
10. **[Subtask 9: Unit Tests](subtasks/subtask-09-unit-tests.md)** - Write Jest unit tests for all modules using TDD.
11. **[Subtask 10: Frontend Simple HTML Page](subtasks/subtask-10-frontend-simple-html-page.md)** - Create a basic web form for user creation.
12. **[Subtask 11: Documentation](subtasks/subtask-11-documentation.md)** - Generate README, API docs, and architecture diagrams.
13. **[Subtask 12: Deployment Instructions](subtasks/subtask-12-deployment-instructions.md)** - Finalize Docker setup and provide run instructions.

## Dependencies and Order
- Subtasks 1-4 are foundational and should be completed sequentially.
- Subtasks 5-9 can be done in parallel after setup, but depend on prior backend setup.
- Subtask 10 (testing) should run throughout, but is listed as a dedicated task for comprehensive coverage.
- Subtask 11 (frontend) is independent but requires API endpoints (Subtask 6).
- Subtasks 12-13 are final and depend on all prior work.

## Git Workflow Rules
- Each subtask starts with a new feature branch from main (e.g., `feature/subtask-01-local-git-setup`).
- Commit messages are brief and descriptive (e.g., "Init Git repo").
- Before raising PR: Run unit tests (`npm test`) and build (`npm run build`), resolve any errors, commit fixes.
- Raise PR to main with brief title (e.g., "Add local Git setup") and description summarizing changes.
- Developer handles PR creation; agent does not raise PRs.

## Chat Modes
See [chatmode-pr.md](chatmode-pr.md) for defined chat modes for different development roles.

## Success Criteria
- All subtasks completed with passing tests and builds.
- Application runs via Docker Compose, sends notifications, and handles recovery.
- Code is modular, extensible, and follows NestJS best practices.
- Documentation is complete and accurate.

For GitHub-specific instructions, see [github-instructions.md](github-instructions.md).</content>
<parameter name="filePath">/Users/saiteja/personal/erin-living/docs/implementation-plan.md