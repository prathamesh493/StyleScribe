# utils.py

import os
import shutil
import pandas as pd

def load_csv_files(data_dir):
    """Load all CSV files from the specified directory."""
    csv_files = [f for f in os.listdir(data_dir) if f.endswith('.csv')]
    return [os.path.join(data_dir, f) for f in csv_files]

def move_file_to_old(file_path, old_data_dir):
    """Move the processed CSV file to the old directory."""
    shutil.move(file_path, os.path.join(old_data_dir, os.path.basename(file_path)))
