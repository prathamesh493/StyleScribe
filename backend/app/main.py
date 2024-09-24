from fastapi import FastAPI, UploadFile, Form, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
from transformers import AutoModelForCausalLM, AutoTokenizer
from train_model.config import OUTPUT_DIR
from train_model.generate import TextGenerator
import os

app = FastAPI()

# Allow CORS for the frontend (localhost:3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # List the frontend's origin
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# Load the tokenizer once when the application starts
tokenizer = AutoTokenizer.from_pretrained("gpt2")

@app.post("/api/generate-text")
async def generate_text(
    authorName: str = Form(...),
    prompt: str = Form(...),
    file: Optional[UploadFile] = None
):
    # Optional: Process the uploaded file if needed
    if file:
        file_content = await file.read()
        # Process this file content if necessary (e.g., extract data for fine-tuning)
        print("Received file:", file.filename)

    # Check for the model's existence
    model_path = os.path.join(OUTPUT_DIR, authorName)
    if not os.path.exists(model_path):
        raise HTTPException(status_code=404, detail=f"Model for author '{authorName}' not found. Please train the model first.")

    # Load the fine-tuned model and tokenizer
    model = AutoModelForCausalLM.from_pretrained(model_path)
    tokenizer = AutoTokenizer.from_pretrained("gpt2")

    # Create a TextGenerator instance with model, tokenizer, and input_text
    text_generator = TextGenerator(model, tokenizer, prompt)

    # Generate text using the prompt
    generated_text = text_generator.generate_text()

    return JSONResponse({"generatedText": generated_text})


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
