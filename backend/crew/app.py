from fastapi import FastAPI

app = FastAPI()

@app.post("/api/test")
async def test_api():
    return {"message": "FastAPI is running!"}