# Chat Modes for Development

To facilitate development, the following chat modes are defined for different roles. Each mode can reference the relevant subtask names for context:

- **Backend Developer**: Focus on subtasks 3-9, involving NestJS project setup, Docker Compose, database schemas, API endpoints, scheduler/producer, worker/consumer, and queue configuration.
- **Frontend Developer**: Handle subtask 11, creating the simple HTML page for user creation.
- **Document Writer**: Responsible for subtask 12, generating README, API docs, and architecture diagrams.
- **Tester**: Involved in subtask 10, writing and running Jest unit tests for all modules using TDD.
- **DevOps/Deployment Specialist**: Manage subtasks 2, 4, and 13 for local Git setup, Docker Compose setup, and deployment instructions.

## Chatmode for Raising PR in GitHub Copilot

Use this prompt in GitHub Copilot chat to assist with PR creation:

"Help me create a pull request for branch [branch-name] to main. Title: '[Brief Title]'. Description: '[Summarize changes, e.g., Implemented user management API with validation and business logic. Added DTOs, controller, and service. Tested with unit tests.]'. Include any relevant reviewers or labels."</content>
<parameter name="filePath">/Users/saiteja/personal/erin-living/docs/chatmode-pr.md