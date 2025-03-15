# Personal AI School Assistant

Designed to provide the user with a schedule prioritizing class due dates and provide assistance in research through user prompts.

# How To Run
## Frontend 
`npm run dev`
## Backend
`cd src-backend`
`uvicorn main:app`

## Tutorial
Send a topic in chat, a report.md will appear under src-backend, may need openapi code, and install venv for python. I will try to come up with a requirement.txt for python venv. But it runs on my end anyways. Never done anything with static webpage yet, only tested in dev and works on mine.

Check current `report.md` under `src-backend` for output from CrewAI with the topic: Game Design

Code modified under `src/components/PromptMenu.js`

Next goal: output crewAI in json file and show in frontend webpage. (this wont take too long, problly half day work)

Endpoint from backend is ready for setup, chat with me if any endpoint needed.