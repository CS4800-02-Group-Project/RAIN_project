#!/usr/bin/env python

import warnings
import logging
from dotenv import load_dotenv

from research_crew import ResearchCrew
from academic_crew import AcademicCrew


from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Suppress specific warnings
warnings.filterwarnings("ignore", category=SyntaxWarning, module="pysbd")


def response(classification, query):
    """
    Run the appropriate crew based on classification.
    """
    inputs = {
        'classification': classification,
        'query': query
    }

    try:
        if classification == "Research Topic":
            return ResearchCrew().crew().kickoff(inputs=inputs)
        elif classification == "Academic Question":
            return AcademicCrew().crew().kickoff(inputs=inputs)
        else:
            return "No Classification found."
            
    except Exception as e:
        logger.error(f"Error in run: {str(e)}")
        raise Exception(f"An error occurred while running the crew: {e}")

app = FastAPI()

# Enable CORS to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ResearchRequest(BaseModel):
    classification: str
    query: str

@app.post("/api/research")
async def ai_response(request: ResearchRequest):
    result = response(request.classification, request.query)
    print(result)
    return {"response": result}


import uvicorn
if __name__ == "__main__":
    logger.info("Starting server...")
    uvicorn.run(
        "main:app",
        host="127.0.0.1",
        port=8000,
        reload=False,  # Disable reloader to avoid watching package files
        log_level="info"
    )
    
# import json
# result = response("Research Topic", "Game Theory")
# result = response("Academic Question", "What is the Nash Equilibrium?")
# print(result)