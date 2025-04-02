#!/usr/bin/env python
import sys
import asyncio
import warnings

from datetime import datetime

from crew import Backend

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

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
    result = research(request.prompt)
    return {"response": f"{result}"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)