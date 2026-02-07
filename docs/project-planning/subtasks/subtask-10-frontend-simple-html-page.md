# Subtask 10: Frontend Simple HTML Page

## Description
Create a basic HTML page served at root (/) with a form to create users. Include fields for firstName, lastName, dateOfEvent, location, notificationType. Submit POST to /user and display response.

## Tasks
- Create public/index.html with form elements.
- Add JavaScript for form submission via fetch to /user.
- Display success/error messages from API response.
- Configure NestJS to serve static files at /.
- Enable CORS globally.
- Test form submission manually.

## Git Workflow
- Create a new feature branch: `git checkout -b feature/subtask-10-frontend-simple-html-page`
- Commit changes with brief messages, e.g.:
  - "Create index.html form"
  - "Add form submission JS"
  - "Configure static serving"
- Before raising PR: Run `npm run build`, test form in browser, resolve issues, commit fixes.
- Raise PR to main with title "Add simple HTML frontend" and description "Create basic web form for user creation."</content>
<parameter name="filePath">/Users/saiteja/personal/erin-living/docs/subtask-10-frontend-simple-html-page.md