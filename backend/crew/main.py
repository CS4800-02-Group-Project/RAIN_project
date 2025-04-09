#!/usr/bin/env python
import sys
import asyncio
import warnings
import logging
from dotenv import load_dotenv

from datetime import datetime

from crew import Backend

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
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

def research(InputTopic):
    """
    Run the crew.
    """
    inputs = {
        'topic': InputTopic
    }
    
    try:
        return Backend().crew().kickoff(inputs=inputs)
    except Exception as e:
        logger.error(f"Error in research: {str(e)}")
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
    prompt: str

@app.post("/api/research")
async def ai_response(request: ResearchRequest):
    logger.info(f"Received research request for topic: {request.prompt}")
    result = research(request.prompt)
    return {"response": f"{result}"}



if __name__ == "__main__":
    import uvicorn
    logger.info("Starting server...")
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=False,  # Disable reloader to avoid watching package files
        log_level="info"
    )