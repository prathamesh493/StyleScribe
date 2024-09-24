from fastapi import FastAPI, UploadFile, Form
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional

app = FastAPI()

# Allow CORS for the frontend (localhost:3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # List the frontend's origin
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

@app.post("/api/generate-text")
async def generate_text(
    authorName: str = Form(...),
    prompt: str = Form(...),
    file: Optional[UploadFile] = None
):
    # Placeholder for actual text generation logic
    if file:
        # Process the uploaded file (optional)
        file_content = await file.read()
        # You would process this file content to extract relevant information for generation
        print("Received file:", file.filename)

    generated_text = f"Generated text in the style of {authorName}: {prompt}"

    return JSONResponse({"generatedText": generated_text})

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
