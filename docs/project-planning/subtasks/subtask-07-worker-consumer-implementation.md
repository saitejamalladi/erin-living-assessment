# Subtask 7: Worker (Consumer) Implementation

## Description
Build the worker module as the consumer: process BullMQ jobs to fetch user data, send HTTP POST to RequestBin, and update nextRunAt for recurrence. Handle failures with retries and logging.

## Tasks
- Create WorkerModule and WorkerService.
- Register BullMQ processor for the queue.
- In processor: Fetch user by userId, construct message, send POST to RequestBin URL.
- On success: Update nextRunAt (+1 year, handle leap years), set status to 'SCHEDULED', log audit.
- On failure: Log error, let BullMQ handle retries; after max retries, set status to 'FAILED'.
- Add rate limiting in BullMQ config.
- Ensure idempotency and error handling.

## Git Workflow
- Create a new feature branch: `git checkout -b feature/subtask-07-worker-consumer-implementation`
- Commit changes with brief messages, e.g.:
  - "Create WorkerModule"
  - "Implement job processor"
  - "Add recurrence and error handling"
- Before raising PR: Run `npm test` and `npm run build`, resolve errors, commit fixes.
- Raise PR to main with title "Implement worker consumer" and description "Add queue processor to send notifications and update schedules."</content>
<parameter name="filePath">/Users/saiteja/personal/erin-living/docs/subtask-07-worker-consumer-implementation.md