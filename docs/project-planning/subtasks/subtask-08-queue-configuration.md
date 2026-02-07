# Subtask 8: Queue Configuration

## Description
Configure BullMQ queue with Redis connection, retry policies (3 retries, 5s interval), rate limiting (max 10 jobs/sec), and error handling. Integrate with NestJS modules.

## Tasks
- Create QueueModule with BullModule.forRoot using Redis config from env.
- Define queue name and register in modules.
- Set up retry options: max attempts 3, backoff fixed 5s.
- Add rate limiter: max 10 jobs per second.
- Configure event listeners for job completion/failure logging.
- Ensure queue persistence and cleanup.

## Git Workflow
- Create a new feature branch: `git checkout -b feature/subtask-08-queue-configuration`
- Commit changes with brief messages, e.g.:
  - "Configure BullMQ module"
  - "Set retry and rate limiting"
  - "Add event listeners"
- Before raising PR: Run `npm test` and `npm run build`, resolve errors, commit fixes.
- Raise PR to main with title "Configure BullMQ queue" and description "Setup queue with retries, rate limiting, and error handling."</content>
<parameter name="filePath">/Users/saiteja/personal/erin-living/docs/subtask-08-queue-configuration.md