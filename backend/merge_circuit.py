import pandas as pd

df_simplified = pd.read_csv('./data/circuits_simplified.csv')
df_circuits = pd.read_csv('./data/circuits.csv')

merged_df = pd.merge(df_circuits, df_simplified, on='circuitId', how='left')

merged_df.to_csv('./data/merged_circuits.csv', index=False)

print("CSV files successfully merged. Output saved to merged_circuits.csv")