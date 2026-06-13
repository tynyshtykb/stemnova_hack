import pandas as pd
import joblib

model = joblib.load('pipeline_model.pkl')
pipe = {
    "Pipe_Size_mm": 300,
    "Thickness_mm": 13.87,
    "Material": "Carbon Steel",
    "Grade": "ASTM A106 Grade B",
    "Max_Pressure_psi": 900,
    "Temperature_C": 40.8,
    "Corrosion_Impact_Percent": 5.57,
    "Material_Loss_Percent": 3.02,
    "Time_Years": 21,
    "Condition": "Moderate"
}
data = pd.DataFrame([pipe])
data = pd.get_dummies(data, drop_first=True)
train_features = joblib.load("train_features.pkl")

for col in train_features:
    if col not in data.columns:
        data[col] = 0

data = data[train_features]
data = data.reindex(columns=train_features, fill_value=0)

pred = model.predict(data)[0]

print(f"Predicted Thickness Loss (mm): {pred:.2f}")