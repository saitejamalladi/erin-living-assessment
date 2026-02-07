# Subtask 9: Unit Tests

## Description
Write comprehensive Jest unit tests for all modules using TDD: schemas, services, controllers, scheduler, worker. Cover happy paths, edge cases (e.g., leap years, failures), and mocks for external deps.

## Tasks
- Set up Jest config in package.json.
- Write tests for UserService: creation, update, deletion, nextRunAt calc.
- Write tests for NotificationService: scheduling logic.
- Write tests for SchedulerService: polling, locking, queuing.
- Write tests for WorkerService: processing, HTTP calls, recurrence.
- Write tests for controllers: API responses, validation.
- Mock Mongoose, BullMQ, HTTP requests.
- Achieve high coverage (>80%).

## Git Workflow
- Create a new feature branch: `git checkout -b feature/subtask-09-unit-tests`
- Commit changes with brief messages, e.g.:
  - "Add UserService tests"
  - "Add Scheduler tests"
  - "Add Worker tests"
- Before raising PR: Run `npm test` to ensure all pass, resolve failures, commit fixes.
- Raise PR to main with title "Add unit tests" and description "Implement Jest tests for all modules with TDD."</content>
<parameter name="filePath">/Users/saiteja/personal/erin-living/docs/subtask-09-unit-tests.md