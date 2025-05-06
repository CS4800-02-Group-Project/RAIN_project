# Website Deployment

This guide explains how to deploy our Full-stack web application, consisting of:

- React-based Frontend
- Python Backend

When initiaiing the web application. It is recommended to first start the backend programs and then open the front end application

## Prerequisites

Before Starting, ensure the folling are installed on your system:

- **Node.js** (Latest version is recommended)
- **npm**
- **Python 3.11**
- **pip**
- **virtualenv** (Optional but recommended)

## Backend

The backend consists of Crew (Ai Agent) and Outlook (Email Parser). These guides will show how to start the programs

### Crew

- cd backend/crew
- python -m venv .venv
- For MAC: source .venv/bin/activate
- For Windows: .venv/scripts/activate
- Imports:
  - pip install -r requirements.txt
  - pip install crew
  - pip install serapapi
  - pip install google-search-results
- python main.py

### Outlook

- cd backend/outlook
- python -m venv .venv
- For MAC: source .venv/bin/activate
- For Windows: .venv/scripts/activate
- Imports:
  - pip install -r requirements.txt
  - pip install firebase
  - pip install firebase_admin
- python Outlook_Eamil_Parser.py

When running the **Outlook_Email_Parser.py**. it will immediately open a outlook page, that can be closed.

## Frontend

To run the frontend, install **react_scripts**.

- npm install react-scripts --save

Once installed and node.js is installed, input **npm start** to open the page. Directing to the login page.

- npm start
