Tech stack 

1. Typescript, I wanna goahead with Nestjs + typescript. Both producer and consumer in the same service for now. 
2. BullMQ
3. MongoDB via Mongoose
4. node-cron.
5. Use docker-compose for deployment, to run dependent services like redis for bullmq, mongodb, 
6. Jest for Unit Testing, TDD approach. Integration testing or tets suites are not required for the simplicity.
7. Readme.md should have setup instructions, technical architecture, tech stack, sequence diagrams, dependencies to run using docker. 
8. Use ianaName for timezone to deal with daylight savings settings, and convert 9AM local time to UTC store the notification date time.


Prompt # 1 Clarifications


Review #requirements.md #tech-design.md. 

Ask me 5 important questions for the clarifications for the technical implementation. 


Prompt #2 Project execution plan 
Review #requirements.md #tech-design.md. 
Prepare a detailed implementation plan (without code details) for this project. Split this work into reasonable number of subtasks(not more than 12) (1 for front end, few for backend, few for deployment, few for testing).The implementation-plan.md should be detailed by structured. 
subtasks should cover local git setup, nestjs setup, docker-compose setup, multiple subtasks for code implementation and unit tests, documentation.

The implementation should also have instructions on git commits. Every subtask should start with the creation of a new feature branch, commit messages should be brief, raise a PR to main at the end with brief PR title and description. Before initiating the PR, check the unit test cases and build the code, resolve the errors, commit the changes and then raise the PR with the final changes. Developer will raise the PR separately. Agent doesn't need to raise the PR. 

The implementation-plan.md should have the overall plan and there should be a separate .md file for each subtask. Implementation plan should have references to the subtasks within that file. 

The project should have a github instructions file with the above rules. 
It should also have a separate chatmode creaeted to raise a PR which I can use it in github copilot. 




prompt #3 - Improvise the implementation plan. 

I can see the following missing. Fix it. 
1. No references to the requirements or tech-design.md
2. What's the name of the service to be created. 
3. git will be initiated on the current directory. /erin-living-assessment
4. modify the absolute paths to relative paths. 
5. Create chatmodes for backend, frontend, document writer and other roles. I'll simply use that and mention the subtask name. 
