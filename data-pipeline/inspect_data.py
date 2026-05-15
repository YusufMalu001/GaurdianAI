import pandas as pd
df = pd.read_excel("../Indore_Women_Safety_Enhanced_With_Coordinates.xlsx")
print(df.columns.tolist())
print(df.head(1).to_dict('records'))
