from __future__ import annotations

import csv
import os
import pickle
from pathlib import Path

import joblib
import numpy as np
from flask import Flask, jsonify, request
try:
    from flask_cors import CORS
except ModuleNotFoundError:
    CORS = None
from sklearn.preprocessing import StandardScaler

BASE_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = BASE_DIR.parent
MODEL_PATH = BASE_DIR / "loan_random_forest.pkl"
DATA_PATH = PROJECT_ROOT / "loan_cleaned.csv"

NUMERIC_COLUMNS = [
    "Age",
    "Income",
    "LoanAmount",
    "CreditScore",
    "MonthsEmployed",
    "NumCreditLines",
    "InterestRate",
    "LoanTerm",
    "DTIRatio",
]

CATEGORICAL_LEVELS = {
    "Education": ["Bachelor's", "High School", "Master's", "PhD"],
    "EmploymentType": ["Full-time", "Part-time", "Self-employed", "Unemployed"],
    "MaritalStatus": ["Divorced", "Married", "Single"],
    "HasMortgage": ["No", "Yes"],
    "HasDependents": ["No", "Yes"],
    "LoanPurpose": ["Auto", "Business", "Education", "Home", "Other"],
    "HasCoSigner": ["No", "Yes"],
}

DUMMY_COLUMNS = [
    f"{col}_{level}"
    for col, levels in CATEGORICAL_LEVELS.items()
    for level in levels[1:]
]

MODEL_COLUMNS = NUMERIC_COLUMNS + DUMMY_COLUMNS

app = Flask(__name__)
if CORS is not None:
    CORS(app)

def _load_model(path: Path):
    with path.open("rb") as file:
        try:
            return pickle.load(file)
        except Exception:
            file.seek(0)
            return joblib.load(file)


model = _load_model(MODEL_PATH)


def _fit_scaler_from_training_data() -> StandardScaler:
    features = []
    with DATA_PATH.open("r", encoding="utf-8", newline="") as file:
        reader = csv.DictReader(file)
        for row in reader:
            vec = []
            for col in NUMERIC_COLUMNS:
                vec.append(float(row[col]))
            for col, levels in CATEGORICAL_LEVELS.items():
                value = row[col]
                for level in levels[1:]:
                    vec.append(1.0 if value == level else 0.0)
            features.append(vec)

    scaler = StandardScaler()
    scaler.fit(np.array(features, dtype=float))
    return scaler


scaler = _fit_scaler_from_training_data()


def _vector_from_payload(payload: dict) -> np.ndarray:
    if "features" in payload:
        values = payload["features"]
        if not isinstance(values, list) or len(values) != len(MODEL_COLUMNS):
            raise ValueError(f"'features' must be a list of {len(MODEL_COLUMNS)} numbers")
        return np.array(values, dtype=float)

    missing = [
        key
        for key in [*NUMERIC_COLUMNS, *CATEGORICAL_LEVELS.keys()]
        if key not in payload
    ]
    if missing:
        raise ValueError(f"Missing fields: {', '.join(missing)}")

    vec = []
    for col in NUMERIC_COLUMNS:
        vec.append(float(payload[col]))

    for col, levels in CATEGORICAL_LEVELS.items():
        value = payload[col]
        if value not in levels:
            raise ValueError(f"Invalid value for {col}: {value}. Allowed: {levels}")
        for level in levels[1:]:
            vec.append(1.0 if value == level else 0.0)

    return np.array(vec, dtype=float)


@app.get("/")
def home():
    return jsonify(
        {
            "message": "Loan default prediction API is running",
            "predict_endpoint": "/predict",
            "method": "POST",
            "expected_fields": [*NUMERIC_COLUMNS, *CATEGORICAL_LEVELS.keys()],
        }
    )


@app.get("/health")
def health():
    return jsonify({"status": "ok", "model": "loan_random_forest.pkl"})


@app.post("/predict")
def predict():
    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        return jsonify({"error": "Request body must be JSON object"}), 400

    try:
        raw_features = _vector_from_payload(data)
        scaled = scaler.transform(raw_features.reshape(1, -1))
        prediction = int(model.predict(scaled)[0])
        probability_default = float(model.predict_proba(scaled)[0][1])
    except ValueError as exc:
        return jsonify({"error": str(exc)}), 400
    except Exception as exc:
        return jsonify({"error": f"Prediction failed: {exc}"}), 500

    return jsonify(
        {
            "model_name": "Random Forest",
            "model_file": MODEL_PATH.name,
            "prediction": prediction,
            "prediction_label": "Default" if prediction == 1 else "No Default",
            "probability_default": probability_default,
            "probability_no_default": 1.0 - probability_default,
            "confidence": max(probability_default, 1.0 - probability_default),
        }
    )


if __name__ == "__main__":
    port = int(os.getenv("PORT", "5000"))
    app.run(host="0.0.0.0", port=port, debug=False)
