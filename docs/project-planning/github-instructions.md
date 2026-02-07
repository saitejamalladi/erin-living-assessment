# GitHub Instructions

## Git Workflow Rules
- Each subtask starts with a new feature branch from main (e.g., `git checkout -b feature/subtask-01-local-git-setup`).
- Commit messages are brief and descriptive (e.g., "Init Git repo").
- Before raising PR: Run unit tests (`npm test`) and build (`npm run build`), resolve any errors, commit fixes.
- Raise PR to main with brief title (e.g., "Add local Git setup") and description summarizing changes.
- Developer handles PR creation; agent does not raise PRs.

## Branch Naming Convention
- Use `feature/subtask-XX-description` where XX is the subtask number.

## PR Guidelines
- Ensure PRs are small and focused on one subtask.
- Include a description of what was implemented and any testing done.
- Wait for CI checks (if set up) before merging.

## Chatmode for Raising PR in GitHub Copilot
Use this prompt in GitHub Copilot chat to assist with PR creation:

"Help me create a pull request for branch [branch-name] to main. Title: '[Brief Title]'. Description: '[Summarize changes, e.g., Implemented user management API with validation and business logic. Added DTOs, controller, and service. Tested with unit tests.]'. Include any relevant reviewers or labels."</content>
<parameter name="filePath">/Users/saiteja/personal/erin-living/docs/github-instructions.md