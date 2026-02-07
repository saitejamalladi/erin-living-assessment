# Subtask 3: Docker Compose Setup

## Description
Create a docker-compose.yml file to orchestrate the application, MongoDB, and Redis services. Configure volumes, networks, environment variables, and health checks. Ensure secure connections with root credentials for databases. Add Dockerfile for the NestJS app with multi-stage build for optimization.

## Tasks
- Create docker-compose.yml with services: app (NestJS), mongo, redis.
- Configure MongoDB and Redis with authentication (root user/password).
- Set up volumes for data persistence.
- Add health checks for databases.
- Create Dockerfile for the app: base image Node.js, copy files, install deps, build, expose port 3000.
- Update .env with Docker service names for connections.
- Test basic compose up to ensure services start.

## Git Workflow
- Create a new feature branch: `git checkout -b feature/subtask-03-docker-compose-setup`
- Commit changes with brief messages, e.g.:
  - "Add docker-compose.yml"
  - "Create Dockerfile"
  - "Configure env for Docker"
- Before raising PR: Run `docker-compose build` and `docker-compose up` briefly to check no errors, resolve if any, commit fixes.
- Raise PR to main with title "Setup Docker Compose" and description "Configure containers for app, MongoDB, and Redis."</content>
<parameter name="filePath">/Users/saiteja/personal/erin-living/docs/subtask-03-docker-compose-setup.md