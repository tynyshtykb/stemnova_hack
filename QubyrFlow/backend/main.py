from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client, Client
import joblib
import pandas as pd
import random
import json
SUPABASE_URL = "https://hvlypstjbytixdifuryp.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2bHlwc3RqYnl0aXhkaWZ1cnlwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTM1NDUxMiwiZXhwIjoyMDk2OTMwNTEyfQ.qDTlUgUzrgtXwBIll4KnIeCzNmfu3xJ7lNZq1rg3Nb8"
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

model = joblib.load("pipeline_model.pkl")
train_features = joblib.load("train_features.pkl")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
class PipelineCreate(BaseModel):
    pipe_id: int  # Твой ручной ID для связи
    pipe_size: float
    min_thickness: float
    material: str
    grade: str
    corrosion_impact: float
    time_in_years: float
    initial_thickness: float

class SensorData(BaseModel):
    pipe_id: int
    Temperature: float  
    Pressure: float     
@app.get("/")
def home():
    return {"status": "Pipeline Prediction API is running"}

@app.get("/debug/pipelines")
def debug_pipelines():
    """Debug endpoint to see raw pipeline data"""
    try:
        response = supabase.table("pipelines").select("*").limit(1).execute()
        if response.data:
            pipe = response.data[0]
            return {
                "raw_data": pipe,
                "keys": list(pipe.keys()),
                "has_pipe_id": "pipe_id" in pipe,
                "has_id": "id" in pipe,
            }
        else:
            return {"status": "No pipelines in database"}
    except Exception as e:
        return {"error": str(e)}

@app.post("/pipeline")
def create_pipeline(data: PipelineCreate):
    try:
        payload = data.dict()
        
        print(f"\n=== CREATE PIPELINE ===")
        print(f"Input data from frontend:")
        for key, val in payload.items():
            print(f"  {key}: {val} (type: {type(val).__name__})")
        
        payload["id"] = payload["pipe_id"]
        
        print(f"\nPayload to send to Supabase:")
        for key, val in payload.items():
            print(f"  {key}: {val} (type: {type(val).__name__})")
        
        response = supabase.table("pipelines").insert(payload).execute()
        
        print(f"\nResponse from Supabase:")
        print(f"  Response object: {response}")
        print(f"  Response data: {response.data}")
        
        if hasattr(response, 'error') and response.error:
            error_detail = str(response.error)
            print(f"ERROR from Supabase: {error_detail}")
            raise HTTPException(status_code=400, detail=f"Database error: {error_detail}")
        
        result = response.data

        if isinstance(result, list) and len(result) > 0:
            result = result[0]
        if isinstance(result, dict):
            if "id" in result and "pipe_id" not in result:
                result["pipe_id"] = result["id"]
        
        try:
            pipe_id = payload["pipe_id"]
            sensor_payload = {
                "pipe_id": pipe_id,
                "temperature": 25.0,  
                "pressure": 100.0     
            }
            print(f"\nCreating initial sensor data: {sensor_payload}")
            sensor_response = supabase.table("sensor_data").insert(sensor_payload).execute()
            print(f"Sensor data created: {sensor_response.data}")
        except Exception as sensor_error:
            print(f"WARNING: Failed to create initial sensor data: {sensor_error}")
        
        print(f"\nFinal result to return:")
        for key, val in (result.items() if isinstance(result, dict) else []):
            print(f"  {key}: {val}")
        print(f"======================\n")
        
        return result
    except HTTPException:
        raise
    except Exception as e:
        error_msg = str(e)
        print(f"ERROR in create_pipeline: {error_msg}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to create pipeline: {error_msg}")

@app.get("/pipelines")
def get_pipelines():
    try:
        response = supabase.table("pipelines").select("*").execute()
        if hasattr(response, 'error') and response.error:
            raise HTTPException(status_code=400, detail=f"Database error: {response.error}")
        
        pipelines = response.data
        if pipelines:
            for i, pipe in enumerate(pipelines):
    
                if not pipe.get("pipe_id") and pipe.get("id"):
                    pipe["pipe_id"] = pipe["id"]
                print(f"DEBUG: Pipeline {i}: pipe_id={pipe.get('pipe_id')}, id={pipe.get('id')}")
        
        return pipelines
    except Exception as e:
        print(f"ERROR in get_pipelines: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to get pipelines: {str(e)}")

@app.post("/sensors")
def save_sensors(data: SensorData):
    try:
        payload = {
            "pipe_id": data.pipe_id,
            "temperature": data.Temperature,
            "pressure": data.Pressure
        }
        response = supabase.table("sensor_data").insert(payload).execute()
        if hasattr(response, 'error') and response.error:
            raise HTTPException(status_code=400, detail=f"Database error: {response.error}")
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save sensor data: {str(e)}")

@app.get("/predict/{pipe_id}")
def predict(pipe_id: int):
    try:
        print(f"DEBUG: Fetching prediction for pipe_id={pipe_id}")
        
        pipe_resp = supabase.table("pipelines").select("*").eq("id", pipe_id).execute()
        
        pipe = None
        if pipe_resp.data and len(pipe_resp.data) > 0:
            pipe = pipe_resp.data[0]
            print(f"DEBUG: Found pipe by id={pipe_id}")
        else:
            print(f"DEBUG: Not found by id={pipe_id}, trying by pipe_id field")
            pipe_resp = supabase.table("pipelines").select("*").eq("pipe_id", pipe_id).execute()
            if pipe_resp.data and len(pipe_resp.data) > 0:
                pipe = pipe_resp.data[0]
                print(f"DEBUG: Found pipe by pipe_id field={pipe_id}")
        
        if not pipe:
            print(f"DEBUG: Pipe not found with id or pipe_id={pipe_id}")
            raise HTTPException(status_code=404, detail=f"Pipe with id={pipe_id} not found")
        
        print(f"DEBUG: Found pipe: {pipe}")

        sensor_resp = (
            supabase.table("sensor_data")
            .select("*")
            .eq("pipe_id", pipe_id)
            .order("created_at", desc=True)
            .limit(1)
            .execute()
        )
        
        sensor = None
        if sensor_resp.data and len(sensor_resp.data) > 0:
            sensor = sensor_resp.data[0]
            print(f"DEBUG: Found sensor data: {sensor}")
        else:
            print(f"WARNING: No sensor data for pipe_id={pipe_id}, using defaults")

            sensor = {
                "temperature": 25.0,
                "pressure": 100.0
            }
            try:
                sensor_payload = {
                    "pipe_id": pipe_id,
                    "temperature": sensor["temperature"],
                    "pressure": sensor["pressure"]
                }
                supabase.table("sensor_data").insert(sensor_payload).execute()
                print(f"DEBUG: Created default sensor data for pipe_id={pipe_id}")
            except Exception as e:
                print(f"WARNING: Could not create default sensor data: {e}")
        
        model_input = {
            "Pipe_Size_mm": pipe["pipe_size"],
            "Thickness_mm": pipe["initial_thickness"],
            "Material": pipe["material"],
            "Grade": pipe["grade"],
            "Max_Pressure_psi": sensor["pressure"],
            "Temperature_C": sensor["temperature"],
            "Corrosion_Impact_Percent": pipe["corrosion_impact"],
            "Time_Years": pipe["time_in_years"],
        }

        df = pd.DataFrame([model_input])
        df = pd.get_dummies(df)
        
        for col in train_features:
            if col not in df.columns:
                df[col] = 0
        df = df[train_features]

        predicted_loss = float(model.predict(df)[0])
        print(f"DEBUG: Model predicted thickness loss: {predicted_loss} mm")
        current_thickness = pipe["initial_thickness"] - predicted_loss
        corrosion_rate = predicted_loss / max(pipe["time_in_years"], 1)
        years_to_failure = max((current_thickness - pipe["min_thickness"]) / corrosion_rate, 0) if corrosion_rate > 0 else 99

        return {
            "pipe_id": pipe_id,
            "predicted_thickness_loss_mm": random.uniform(0.1, 5.0),  # Replace with predicted_loss for real prediction
            "current_thickness_mm": random.uniform(0.1, pipe["initial_thickness"]),  # Replace with current_thickness for real prediction
            "years_to_failure": 8,  # Replace with years_to_failure for real prediction
            "status": "Critical" if current_thickness <= pipe["min_thickness"] else "Normal",
            "Temperature_C": random.uniform(20.0, 80.0),  # Replace with sensor["temperature"] for real data
            "Pressure_psi": random.uniform(90.0, 150.0)  # Replace with sensor["pressure"] for real data
        }
    except HTTPException:
        raise
    except Exception as e:
        error_msg = str(e)
        print(f"ERROR in predict: {error_msg}")
        raise HTTPException(status_code=500, detail=f"Prediction failed: {error_msg}")




















