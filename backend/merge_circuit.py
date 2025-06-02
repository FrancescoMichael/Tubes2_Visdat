import csv
import pandas as pd

# Read both CSV files
df_simplified = pd.read_csv('./data/circuits_simplified.csv')
df_circuits = pd.read_csv('./data/circuits.csv')

# Clean up the name column in both dataframes for better matching
df_simplified['name'] = df_simplified['name'].str.strip()
df_circuits['name'] = df_circuits['name'].str.strip()

# Merge the dataframes on the name column
merged_df = pd.merge(df_circuits, df_simplified, on='name', how='left')

# Save the merged dataframe to a new CSV file
merged_df.to_csv('merged_circuits.csv', index=False)

print("CSV files successfully merged. Output saved to merged_circuits.csv")