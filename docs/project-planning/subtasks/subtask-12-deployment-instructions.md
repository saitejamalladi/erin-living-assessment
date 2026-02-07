# Subtask 12: Deployment Instructions

## Description
Finalize Docker Compose for production-like deployment, add health checks, and provide detailed run instructions. Ensure environment variables are documented and secure.

## Tasks
- Refine docker-compose.yml for production: add restart policies, logging.
- Update Dockerfile for production build (multi-stage).
- Add .env.example with all variables.
- Document steps: clone, set env, docker-compose up.
- Add scripts in package.json for dev/prod modes.
- Test full deployment locally.

## Git Workflow
- Create a new feature branch: `git checkout -b feature/subtask-12-deployment-instructions`
- Commit changes with brief messages, e.g.:
  - "Refine docker-compose.yml"
  - "Update Dockerfile"
  - "Add deployment docs"
- Before raising PR: Run `docker-compose up` to test, resolve issues, commit fixes.
- Raise PR to main with title "Finalize deployment" and description "Complete Docker setup and provide run instructions."</content>
<parameter name="filePath">/Users/saiteja/personal/erin-living/docs/subtask-12-deployment-instructions.md