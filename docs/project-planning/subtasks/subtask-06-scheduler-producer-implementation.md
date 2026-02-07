# Subtask 6: Scheduler (Producer) Implementation

## Description
Develop the scheduler module as the producer: a cron job running every 15 minutes to query due notifications, perform atomic locks, and push jobs to BullMQ queue. Implement recovery logic for missed tasks.

## Tasks
- Create SchedulerModule and SchedulerService.
- Use node-cron to schedule a method every 15 minutes.
- In the method: Query notifications where status='SCHEDULED' and nextRunAt <= now.
- For each, attempt atomic update to status='PROCESSING'.
- On success, add job to BullMQ queue with payload (notifId, userId).
- Handle concurrency to skip if lock fails.
- Add logging with nestjs-pino.

## Git Workflow
- Create a new feature branch: `git checkout -b feature/subtask-06-scheduler-producer-implementation`
- Commit changes with brief messages, e.g.:
  - "Create SchedulerModule"
  - "Implement cron logic"
  - "Add atomic locking and queue push"
- Before raising PR: Run `npm test` and `npm run build`, resolve errors, commit fixes.
- Raise PR to main with title "Implement scheduler producer" and description "Add cron-based producer to poll and queue notifications."</content>
<parameter name="filePath">/Users/saiteja/personal/erin-living/docs/subtask-06-scheduler-producer-implementation.md