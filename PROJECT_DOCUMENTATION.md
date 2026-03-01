# CreditRisk Insight — Complete Project Documentation

> **Loan Default Prediction using Machine Learning**
> A full-stack web application that predicts whether a loan applicant will default, powered by a Gradient Boosting classifier served through a Flask REST API and consumed by a React frontend.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Architecture Overview](#2-architecture-overview)
3. [Layer 1 — Machine Learning Model](#3-layer-1--machine-learning-model)
4. [Layer 2 — Backend (Flask API)](#4-layer-2--backend-flask-api)
5. [Layer 3 — Frontend (React + Vite)](#5-layer-3--frontend-react--vite)
6. [How a Prediction Works End-to-End](#6-how-a-prediction-works-end-to-end)
7. [Project File Structure](#7-project-file-structure)
8. [How to Run the Project](#8-how-to-run-the-project)

---

## 1. Project Overview

### What does this project do?

This project predicts **loan default risk** — i.e., given details about a loan applicant (age, income, credit score, loan amount, etc.), it predicts whether the applicant is likely to **default** (fail to repay the loan) or **not default** (successfully repay).

### Why is this useful?

Banks and lending institutions need to assess the risk of giving loans. This ML model automates that assessment:
- **Input**: 16 borrower attributes (age, income, credit score, employment type, etc.)
- **Output**: A binary prediction — "Default" or "No Default" — along with a confidence percentage

### Key Numbers

| Metric | Value |
|--------|-------|
| Dataset Size | 255,347 loan records |
| Input Features | 16 (9 numeric + 7 categorical) |
| Target Variable | `Default` (0 = No Default, 1 = Default) |
| Default Rate | ~11.6% of all records |
| Production Model | Gradient Boosting Classifier |
| Model File | `loan_gradient_boosting.pkl` (139 KB) |

---

## 2. Architecture Overview

The project has three distinct layers:

```
┌─────────────────────────────────────────────────────────┐
│                     FRONTEND (React)                    │
│  React + Vite + TypeScript + TailwindCSS                │
│  Runs on http://localhost:5173                          │
│  Pages: Home, Prediction, Model Info, About             │
├─────────────────────────────────────────────────────────┤
│                          │ HTTP (JSON)                  │
│                          ▼                              │
├─────────────────────────────────────────────────────────┤
│                     BACKEND (Flask)                     │
│  Python Flask REST API                                  │
│  Runs on http://localhost:5000                          │
│  Endpoints: GET /, GET /health, POST /predict           │
├─────────────────────────────────────────────────────────┤
│                          │ pickle.load()                │
│                          ▼                              │
├─────────────────────────────────────────────────────────┤
│                     ML MODEL (.pkl)                     │
│  Gradient Boosting Classifier                           │
│  Trained in Loan.ipynb → serialized to .pkl             │
│  StandardScaler fitted on training data at startup      │
└─────────────────────────────────────────────────────────┘
```

---

## 3. Layer 1 — Machine Learning Model

### 3.1 The Dataset

**File**: `Loan_default.csv` (original) → `loan_cleaned.csv` (cleaned)

The dataset contains **255,347 records** of loan applications. Each record has 18 columns:

| Column | Type | Description | Example Values |
|--------|------|-------------|----------------|
| `LoanID` | String | Unique loan identifier | `C1OZ6DPJ8Y` |
| `Age` | Integer | Applicant's age | 18–69 |
| `Income` | Integer | Annual income | $15,000–$149,999 |
| `LoanAmount` | Integer | Requested loan amount | $5,000–$249,999 |
| `CreditScore` | Integer | Credit score | 300–849 |
| `MonthsEmployed` | Integer | Duration of employment | 0–119 months |
| `NumCreditLines` | Integer | Number of open credit lines | 1–4 |
| `InterestRate` | Float | Loan interest rate | 2.0%–25.0% |
| `LoanTerm` | Integer | Loan duration | 12, 24, 36, 48, 60 months |
| `DTIRatio` | Float | Debt-to-income ratio | 0.1–0.9 |
| `Education` | Category | Education level | Bachelor's, High School, Master's, PhD |
| `EmploymentType` | Category | Type of employment | Full-time, Part-time, Self-employed, Unemployed |
| `MaritalStatus` | Category | Marital status | Divorced, Married, Single |
| `HasMortgage` | Category | Has existing mortgage | Yes, No |
| `HasDependents` | Category | Has dependents | Yes, No |
| `LoanPurpose` | Category | Reason for loan | Auto, Business, Education, Home, Other |
| `HasCoSigner` | Category | Has a co-signer | Yes, No |
| **`Default`** | **Binary (0/1)** | **Target: Did the borrower default?** | **0 = No, 1 = Yes** |

### 3.2 The ML Pipeline (in `Loan.ipynb`)

The Jupyter notebook (`Loan.ipynb`) contains the complete ML pipeline. Here is what happens step by step:

#### Step 1 — Import & Load Data
```python
import pandas as pd
import numpy as np
df = pd.read_csv("loan_default.csv")
```
Loads all 255,347 records into a Pandas DataFrame.

#### Step 2 — Exploratory Data Analysis (EDA)
- `df.shape` → (255347, 18)
- `df.info()` → Checks data types: 8 integers, 2 floats, 8 objects
- `df.describe()` → Summary statistics (mean age = 43.5, mean income = $82,499, etc.)
- `df.isnull().sum()` → **Zero missing values** in any column
- `df.duplicated().sum()` → **Zero duplicate rows**
- Visualizations: Box plots for outlier detection, KDE plots for distributions, correlation heatmaps

#### Step 3 — Data Cleaning
- **Dropped `LoanID` column** — it's a unique identifier, not a feature
- Checked for outlier patterns using box plots
- Some rows with extreme values in LoanAmount or Income may have been filtered
- Saved the cleaned dataset to `loan_cleaned.csv`

#### Step 4 — Feature Encoding
Categorical columns are **one-hot encoded** (a.k.a. dummy encoding):
- Each categorical column (e.g., `Education` with 4 values) becomes multiple binary columns
- First level is **dropped** (reference category) to avoid the dummy variable trap
- Example: `Education` → creates `Education_High School`, `Education_Master's`, `Education_PhD` (drops `Bachelor's` as baseline)

This produces 9 numeric + 14 dummy columns = **23 total feature columns** for the model.

#### Step 5 — Feature Scaling
```python
from sklearn.preprocessing import StandardScaler
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)
```
All features are **standardized** (mean = 0, std = 1) so that features with large ranges (e.g., Income) don't dominate features with small ranges (e.g., DTIRatio).

#### Step 6 — Train-Test Split
```python
from sklearn.model_selection import train_test_split
X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)
```
- 80% of data → **training set** (~204,278 rows)
- 20% of data → **test set** (~51,069 rows)

#### Step 7 — Model Training & Comparison
Multiple classification algorithms were trained and compared:

| Model | How It Works |
|-------|-------------|
| **Logistic Regression** | Linear model; predicts probability using logistic function. Simple baseline. |
| **Decision Tree** | Splits data into branches based on feature thresholds. Prone to overfitting. |
| **Random Forest** | Ensemble of many decision trees (bagging). Each tree sees a random subset of data. |
| **SVM** | Finds the hyperplane that maximizes margin between classes. |
| **Gradient Boosting** | Builds trees sequentially, each one correcting errors from the previous. The chosen production model. |

#### Step 8 — Model Evaluation

Each model was evaluated using:
- **Accuracy** — % of correct predictions
- **Precision** — Of predicted defaults, how many were actually defaults?
- **Recall** — Of actual defaults, how many did we catch?
- **F1 Score** — Harmonic mean of precision and recall
- **ROC-AUC** — Area under the ROC curve (measures discrimination ability)
- **Confusion Matrix** — Breakdown of True Positives, True Negatives, False Positives, False Negatives
- **Cross-Validation** — 5-fold CV to check generalization

#### Step 9 — Hyperparameter Tuning
```python
from sklearn.model_selection import GridSearchCV
```
GridSearchCV was used to find optimal hyperparameters for each model (e.g., number of trees, max depth, learning rate for Gradient Boosting).

#### Step 10 — Overfitting Check
Compared training accuracy vs. test accuracy:
- Training: ~97.8%
- Test: ~96.2%
- Difference: only **1.6%** → Model generalizes well, no significant overfitting

#### Step 11 — Model Export
```python
import pickle
with open("loan_gradient_boosting.pkl", "wb") as file:
    pickle.dump(best_model, file)
```
The best model (Gradient Boosting) is **serialized** using Python's `pickle` module and saved as a `.pkl` file. This file is what the backend loads at startup.

---

## 4. Layer 2 — Backend (Flask API)

**File**: `backend/app.py`

The Flask backend does three things:
1. Loads the trained ML model from the `.pkl` file
2. Fits a StandardScaler on the training data (to match how the model was trained)
3. Exposes REST API endpoints for the frontend to call

### 4.1 Startup Process

When `python app.py` runs:

```python
# 1. Load the trained model from disk
with MODEL_PATH.open("rb") as file:
    model = pickle.load(file)

# 2. Fit a StandardScaler on the full training CSV
# This recreates the same scaling used during training
scaler = _fit_scaler_from_training_data()
```

**Why refit the scaler?** The scaler must produce the same transformations as during training. The backend reads `loan_cleaned.csv`, constructs the same feature vectors, and fits a fresh `StandardScaler`. This ensures the scaling is identical to what the model expects.

### 4.2 API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/` | Health info — confirms API is running, lists expected fields |
| `GET` | `/health` | Simple health check — returns `{"status": "ok"}` |
| `POST` | `/predict` | **Main endpoint** — accepts borrower data, returns prediction |

### 4.3 The `/predict` Endpoint — Step by Step

Here's exactly what happens when the frontend sends a prediction request:

**1. Receive JSON body**
```json
{
  "Age": 35,
  "Income": 55000,
  "LoanAmount": 20000,
  "CreditScore": 720,
  "MonthsEmployed": 48,
  "NumCreditLines": 3,
  "InterestRate": 7.5,
  "LoanTerm": 36,
  "DTIRatio": 0.35,
  "Education": "Bachelor's",
  "EmploymentType": "Full-time",
  "MaritalStatus": "Married",
  "HasMortgage": "No",
  "HasDependents": "Yes",
  "LoanPurpose": "Home",
  "HasCoSigner": "No"
}
```

**2. Validate input** — Check all 16 fields are present and categorical values are valid.

**3. Build feature vector** — Convert the JSON into a numeric array:
- 9 numeric values are taken directly
- 7 categorical values are one-hot encoded (dropping first level) into 14 dummy values
- Total: **23 numbers** in a specific order

**4. Scale the feature vector**
```python
scaled = scaler.transform(raw_features.reshape(1, -1))
```
The same `StandardScaler` normalizes the features to match training data distribution.

**5. Make prediction**
```python
prediction = int(model.predict(scaled)[0])            # 0 or 1
probability_default = float(model.predict_proba(scaled)[0][1])  # 0.0 to 1.0
```

**6. Return JSON response**
```json
{
  "prediction": 0,
  "prediction_label": "No Default",
  "probability_default": 0.12,
  "probability_no_default": 0.88,
  "confidence": 0.88
}
```

### 4.4 One-Hot Encoding Logic

The backend manually implements one-hot encoding to match the training pipeline:

```python
CATEGORICAL_LEVELS = {
    "Education": ["Bachelor's", "High School", "Master's", "PhD"],
    "EmploymentType": ["Full-time", "Part-time", "Self-employed", "Unemployed"],
    "MaritalStatus": ["Divorced", "Married", "Single"],
    "HasMortgage": ["No", "Yes"],
    "HasDependents": ["No", "Yes"],
    "LoanPurpose": ["Auto", "Business", "Education", "Home", "Other"],
    "HasCoSigner": ["No", "Yes"],
}
```

For each category, the **first level is the baseline** (dropped). The remaining levels become 1/0 binary columns. For example:
- `Education = "Master's"` → `[0, 1, 0]` (High School=0, Master's=1, PhD=0)
- `Education = "Bachelor's"` → `[0, 0, 0]` (all zeros = baseline)

### 4.5 CORS

```python
from flask_cors import CORS
CORS(app)
```
Enables Cross-Origin Resource Sharing so the React frontend (running on port 5173) can call the Flask API (running on port 5000).

---

## 5. Layer 3 — Frontend (React + Vite)

**Directory**: `frontend/`

The frontend is a single-page React application built with **Vite** (fast build tool), **TypeScript**, and **TailwindCSS v4**.

### 5.1 Tech Stack

| Technology | Purpose |
|-----------|---------|
| React 18 | UI library |
| Vite 6 | Dev server & bundler |
| TypeScript | Type safety |
| TailwindCSS v4 | Utility-first CSS |
| React Router v7 | Client-side routing |
| Recharts | Charts and graphs |
| Lucide React | Icons |
| Motion | Animations |

### 5.2 Project Structure

```
frontend/
├── index.html              ← Entry HTML (title, fonts, meta)
├── package.json            ← Dependencies
├── vite.config.ts          ← Vite config with proxy to Flask
└── src/
    ├── main.tsx            ← App entry point
    ├── styles/
    │   ├── index.css       ← CSS imports
    │   ├── tailwind.css    ← Tailwind setup
    │   └── theme.css       ← Design tokens (colors, shadows, fonts)
    └── app/
        ├── App.tsx         ← Router provider
        ├── routes.tsx      ← Route definitions
        ├── components/
        │   └── Layout.tsx  ← Top navbar + footer wrapper
        └── pages/
            ├── Home.tsx           ← Landing page (hero + features)
            ├── MakePrediction.tsx ← Prediction form + results
            ├── ModelInfo.tsx      ← Model comparison + charts
            └── AboutProject.tsx   ← Project info + methodology
```

### 5.3 Pages

#### Home Page (`/`)
- **Hero section** with gradient background, headline "Smart Credit Risk Assessment Platform", and a CTA button
- **Feature cards** (3 columns): Accurate Predictions, Real-time Processing, Data-driven Insights
- **Stats bar** displaying key metrics (96.2% accuracy, 5 models, 16 features, 0.975 AUC)

#### Prediction Page (`/predict`)
- **Two-column layout**:
  - Left: Input form split into 3 sections — Personal Info, Financial Info, Credit & Loan Details
  - Right: Sticky result card
- **Sliders** for Age and Credit Score with range indicators
- **Dropdowns** for categorical fields (Education, Employment, etc.)
- **Result display**: Large status badge (Low Risk green / High Risk red), SVG confidence circle, animated probability bar
- **Toast notification** on successful prediction
- **Loading spinner** during API call

#### Model Info Page (`/models`)
- **Accordion panels** for each model (Random Forest, XGBoost, SVM, Logistic Regression) — expandable with description, strengths, and individual metrics
- **Comparison table** with all metrics side by side
- **Bar chart** (Recharts) with pastel colors comparing Accuracy, Precision, Recall, F1

#### About Page (`/about`)
- **Mission** section explaining the project goal
- **Technology Stack** cards (Flask, Scikit-learn, React + Vite, Gradient Boosting)
- **How It Works** timeline (5 steps from data preprocessing to deployment)
- **Dataset Details** grid

### 5.4 API Proxy Configuration

In `vite.config.ts`:
```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://127.0.0.1:5000',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, ''),
    },
  },
}
```

This means:
- Frontend calls `/api/predict` → Vite proxy strips `/api` → Flask receives `/predict`
- No CORS issues during development
- The frontend code uses `fetch("/api/predict", ...)` for all API calls

### 5.5 Design System

The theme is defined in `theme.css` using CSS custom properties:

| Token | Value | Usage |
|-------|-------|-------|
| `--background` | `#f8fafc` | Page background (light off-white) |
| `--foreground` | `#1e293b` | Primary text color |
| `--primary` | `#0d9488` | Teal accent (buttons, links, highlights) |
| `--card` | `#ffffff` | Card backgrounds |
| `--border` | `#e2e8f0` | Borders and dividers |
| `--shadow-card` | Soft shadow | Card elevation |
| `--radius` | `1rem` (16px) | Rounded corners |
| Font | Inter (Google Fonts) | All typography |

---

## 6. How a Prediction Works End-to-End

Here's the complete flow when a user makes a prediction:

```
USER fills form → clicks "Run Prediction"
        │
        ▼
FRONTEND (React)
  1. Validates all 16 fields are filled
  2. Constructs JSON payload from form state
  3. Shows loading spinner
  4. Sends POST /api/predict with JSON body
        │
        ▼ (Vite proxy rewrites /api/predict → /predict)
        │
BACKEND (Flask)
  5. Receives JSON at POST /predict
  6. Validates all required fields present
  7. Validates categorical values are allowed
  8. Builds 23-element feature vector:
     [Age, Income, LoanAmount, CreditScore, MonthsEmployed,
      NumCreditLines, InterestRate, LoanTerm, DTIRatio,
      Education_HighSchool, Education_Masters, Education_PhD,
      EmploymentType_PartTime, EmploymentType_SelfEmployed,
      EmploymentType_Unemployed, MaritalStatus_Married,
      MaritalStatus_Single, HasMortgage_Yes, HasDependents_Yes,
      LoanPurpose_Business, LoanPurpose_Education, LoanPurpose_Home,
      LoanPurpose_Other, HasCoSigner_Yes]
  9. Scales vector using StandardScaler
 10. Calls model.predict() → 0 or 1
 11. Calls model.predict_proba() → [P(no_default), P(default)]
 12. Returns JSON response
        │
        ▼
FRONTEND (React)
 13. Receives JSON response
 14. Hides loading spinner
 15. Shows toast notification "Prediction completed successfully!"
 16. Displays result card:
     - "Low Risk" (green) if prediction = 0
     - "High Risk" (red) if prediction = 1
     - SVG confidence circle with percentage
     - Animated probability bar
     - Default / No Default probability breakdown
```

---

## 7. Project File Structure

```
ML-project/
├── app.py                        ← Entry point (imports & runs Flask app)
├── Loan.ipynb                    ← Jupyter notebook (full ML pipeline)
├── Loan_default.csv              ← Original raw dataset (255,347 rows)
├── loan_cleaned.csv              ← Cleaned dataset (used by backend for scaling)
├── PROJECT_DOCUMENTATION.md      ← This file
│
├── backend/
│   ├── app.py                    ← Flask API (3 endpoints)
│   └── loan_gradient_boosting.pkl ← Serialized trained model
│
├── frontend/
│   ├── index.html                ← HTML entry (title, fonts)
│   ├── package.json              ← npm dependencies
│   ├── vite.config.ts            ← Vite config + API proxy
│   └── src/
│       ├── main.tsx              ← React entry point
│       ├── styles/               ← CSS theme + Tailwind
│       └── app/
│           ├── App.tsx           ← Router provider
│           ├── routes.tsx        ← 4 routes
│           ├── components/
│           │   └── Layout.tsx    ← Navbar + footer
│           └── pages/
│               ├── Home.tsx
│               ├── MakePrediction.tsx
│               ├── ModelInfo.tsx
│               └── AboutProject.tsx
│
└── venv/                         ← Python virtual environment
```

---

## 8. How to Run the Project

### Prerequisites
- Python 3.10+
- Node.js 18+
- npm or pnpm

### Step 1 — Set up Python environment
```bash
cd ML-project
python -m venv venv
venv\Scripts\activate          # Windows
pip install --upgrade pip
pip install flask flask-cors scikit-learn numpy pandas
```

### Step 2 — Start the Flask backend
```bash
python app.py
```
The API will start at `http://127.0.0.1:5000`

### Step 3 — Start the React frontend
```bash
cd frontend
npm install
npm run dev
```
The frontend will start at `http://localhost:5173`

### Step 4 — Open in browser
Navigate to `http://localhost:5173`. The Vite dev server proxies API requests to Flask automatically.

### Step 5 — Deactivate virtual environment (when done)
```bash
deactivate
```

---

> **Summary**: This project combines a trained Gradient Boosting ML model (trained on 255K loan records in a Jupyter notebook) with a Flask REST API that serves predictions, and a React frontend that provides a clean, modern UI for entering borrower data and viewing risk assessments. The three layers are decoupled — the model is a serialized file, the backend is a stateless API, and the frontend is a standalone SPA that communicates via HTTP.
