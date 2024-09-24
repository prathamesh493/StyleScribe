# train.py

from transformers import Trainer, TrainingArguments, DataCollatorForLanguageModeling
from config import OUTPUT_DIR, NUM_TRAIN_EPOCHS, BATCH_SIZE, LOGGING_STEPS, SAVE_STEPS
from load_data import load_data

def fine_tune_model(model, dataset, tokenizer):
    data_collator = DataCollatorForLanguageModeling(tokenizer=tokenizer, mlm=False)

    training_args = TrainingArguments(
        output_dir=OUTPUT_DIR,
        overwrite_output_dir=True,
        num_train_epochs=NUM_TRAIN_EPOCHS,
        per_device_train_batch_size=BATCH_SIZE,
        logging_steps=LOGGING_STEPS,
        save_steps=SAVE_STEPS,
        save_total_limit=2,
    )

    trainer = Trainer(
        model=model,
        args=training_args,
        data_collator=data_collator,
        train_dataset=dataset,
    )

    trainer.train()
    trainer.save_model()
