# generate.py

import torch
from transformers import AutoTokenizer, AutoModelForCausalLM
from train_model.config import OUTPUT_DIR, MODEL_NAME

class TextGenerator:
    def __init__(self, model, tokenizer, input_text):
        self.model = model
        self.tokenizer = tokenizer
        self.input_text = input_text

    def generate_text(self, max_length=50, num_return_sequences=1):
        inputs = self.tokenizer.encode(self.input_text, return_tensors="pt")
        outputs = self.model.generate(
            inputs,
            max_length=max_length,
            num_return_sequences=num_return_sequences,
            no_repeat_ngram_size=2,
            num_beams=5,
            early_stopping=True,
        )
        generated_text = self.tokenizer.decode(outputs[0], skip_special_tokens=True)
        return generated_text
