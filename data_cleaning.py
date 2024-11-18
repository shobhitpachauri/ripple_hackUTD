import pandas as pd
import numpy as np

def do_cleaning(df, target_column):
    """
    Clean the data
    """
    # Drop duplicates
    df = df.drop_duplicates()
    df = df.dropna()
        
    return df
