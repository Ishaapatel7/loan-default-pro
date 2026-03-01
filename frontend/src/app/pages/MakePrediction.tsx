import { useMemo, useState } from "react";
import { Loader2, CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react";

type PredictionResponse = {
  model_name?: string;
  model_file?: string;
  prediction: number;
  prediction_label: string;
  probability_default: number;
  probability_no_default: number;
  confidence: number;
};

const BACKEND_HELP_MESSAGE =
  "Backend API is not reachable. Start Flask with: backend\\venv\\Scripts\\python.exe backend\\app.py";

type FormDataShape = {
  Age: string;
  Income: string;
  LoanAmount: string;
  CreditScore: string;
  MonthsEmployed: string;
  NumCreditLines: string;
  InterestRate: string;
  LoanTerm: string;
  DTIRatio: string;
  Education: string;
  EmploymentType: string;
  MaritalStatus: string;
  HasMortgage: string;
  HasDependents: string;
  LoanPurpose: string;
  HasCoSigner: string;
};

const EDUCATION_OPTIONS = ["Bachelor's", "High School", "Master's", "PhD"];
const EMPLOYMENT_OPTIONS = ["Full-time", "Part-time", "Self-employed", "Unemployed"];
const MARITAL_OPTIONS = ["Divorced", "Married", "Single"];
const YES_NO_OPTIONS = ["No", "Yes"];
const LOAN_PURPOSE_OPTIONS = ["Auto", "Business", "Education", "Home", "Other"];

const initialFormData: FormDataShape = {
  Age: "35",
  Income: "",
  LoanAmount: "",
  CreditScore: "650",
  MonthsEmployed: "",
  NumCreditLines: "",
  InterestRate: "",
  LoanTerm: "",
  DTIRatio: "",
  Education: EDUCATION_OPTIONS[0],
  EmploymentType: EMPLOYMENT_OPTIONS[0],
  MaritalStatus: MARITAL_OPTIONS[0],
  HasMortgage: YES_NO_OPTIONS[0],
  HasDependents: YES_NO_OPTIONS[0],
  LoanPurpose: LOAN_PURPOSE_OPTIONS[0],
  HasCoSigner: YES_NO_OPTIONS[0],
};

/* Slider field config */
const SLIDER_FIELDS: Array<{
  key: keyof FormDataShape;
  label: string;
  min: number;
  max: number;
  step: number;
  unit?: string;
}> = [
  { key: "Age", label: "Age", min: 18, max: 80, step: 1, unit: " yrs" },
  { key: "CreditScore", label: "Credit Score", min: 300, max: 850, step: 1 },
];

export function MakePrediction() {
  const [formData, setFormData] = useState<FormDataShape>(initialFormData);
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const numericFields: Array<{ key: keyof FormDataShape; label: string; placeholder: string }> =
    useMemo(
      () => [
        { key: "Income", label: "Annual Income ($)", placeholder: "e.g. 55000" },
        { key: "LoanAmount", label: "Loan Amount ($)", placeholder: "e.g. 20000" },
        { key: "MonthsEmployed", label: "Months Employed", placeholder: "e.g. 36" },
        { key: "NumCreditLines", label: "Credit Lines", placeholder: "e.g. 4" },
        { key: "InterestRate", label: "Interest Rate (%)", placeholder: "e.g. 7.5" },
        { key: "LoanTerm", label: "Loan Term (months)", placeholder: "e.g. 60" },
        { key: "DTIRatio", label: "DTI Ratio", placeholder: "e.g. 0.35" },
      ],
      [],
    );

  const isFormValid =
    numericFields.every((f) => formData[f.key] !== "") &&
    SLIDER_FIELDS.every((f) => formData[f.key] !== "");

  const handleChange = (key: keyof FormDataShape, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handlePredict = async () => {
    if (!isFormValid || loading) return;
    setLoading(true);
    setError(null);

    try {
      const payload = {
        Age: Number(formData.Age),
        Income: Number(formData.Income),
        LoanAmount: Number(formData.LoanAmount),
        CreditScore: Number(formData.CreditScore),
        MonthsEmployed: Number(formData.MonthsEmployed),
        NumCreditLines: Number(formData.NumCreditLines),
        InterestRate: Number(formData.InterestRate),
        LoanTerm: Number(formData.LoanTerm),
        DTIRatio: Number(formData.DTIRatio),
        Education: formData.Education,
        EmploymentType: formData.EmploymentType,
        MaritalStatus: formData.MaritalStatus,
        HasMortgage: formData.HasMortgage,
        HasDependents: formData.HasDependents,
        LoanPurpose: formData.LoanPurpose,
        HasCoSigner: formData.HasCoSigner,
      };

      const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();
      const apiBaseUrl = configuredApiBaseUrl
        ? /^https?:\/\//i.test(configuredApiBaseUrl)
          ? configuredApiBaseUrl
          : `https://${configuredApiBaseUrl}`
        : "/api";
      const response = await fetch(`${apiBaseUrl}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const contentType = response.headers.get("content-type") || "";
      let result: unknown = null;
      if (contentType.includes("application/json")) {
        result = await response.json();
      } else {
        const responseText = await response.text();
        if (responseText.trim().length > 0) {
          try {
            result = JSON.parse(responseText);
          } catch {
            // Leave result as null and report a clearer error below.
          }
        }
      }

      if (!response.ok) {
        const apiError =
          typeof result === "object" && result !== null && "error" in result
            ? String((result as { error?: unknown }).error ?? "")
            : "";
        throw new Error(apiError || `Prediction failed (HTTP ${response.status})`);
      }

      if (!result || typeof result !== "object") {
        throw new Error(BACKEND_HELP_MESSAGE);
      }

      setPrediction(result as PredictionResponse);
      setToast("Prediction completed successfully!");
      setTimeout(() => setToast(null), 3500);
    } catch (err) {
      const message =
        err instanceof Error
          ? err instanceof SyntaxError
            ? BACKEND_HELP_MESSAGE
            : err.message
          : "Prediction failed";
      setError(message);
      setPrediction(null);
    } finally {
      setLoading(false);
    }
  };

  const confidencePercent = prediction ? prediction.confidence * 100 : 0;
  const isLowRisk = prediction ? prediction.prediction === 0 : false;

  /* SVG circle progress values */
  const circleR = 54;
  const circleC = 2 * Math.PI * circleR;
  const circleOffset = circleC - (circleC * confidencePercent) / 100;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* Toast */}
      {toast && (
        <div
          className="fixed top-20 right-6 z-50 flex items-center gap-3 rounded-2xl px-5 py-3.5 text-sm font-medium text-white shadow-xl"
          style={{
            background: "linear-gradient(135deg, #0d9488, #14b8a6)",
            animation: "slideInRight 0.4s ease-out both",
          }}
        >
          <CheckCircle2 className="size-5" />
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="mb-10" style={{ animation: "fadeInUp 0.6s ease-out both" }}>
        <h1 className="text-3xl sm:text-4xl font-bold" style={{ color: "#0f172a" }}>
          Credit Risk Prediction
        </h1>
        <p className="mt-2 text-base" style={{ color: "#64748b" }}>
          Enter loan applicant details to get a live prediction from our ML model.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        {/* ── LEFT: Input Form ── */}
        <div
          className="lg:col-span-3 rounded-3xl p-6 sm:p-8"
          style={{
            background: "#ffffff",
            border: "1px solid #f1f5f9",
            boxShadow: "var(--shadow-card)",
            animation: "fadeInUp 0.6s ease-out 0.1s both",
          }}
        >
          {/* Personal Info */}
          <SectionLabel>Personal Information</SectionLabel>
          <div className="grid gap-5 sm:grid-cols-2 mb-8">
            {SLIDER_FIELDS.map((sf) => (
              <div key={sf.key}>
                <label className="flex justify-between text-sm font-medium mb-2" style={{ color: "#475569" }}>
                  <span>{sf.label}</span>
                  <span style={{ color: "#0d9488" }}>
                    {formData[sf.key] || sf.min}
                    {sf.unit || ""}
                  </span>
                </label>
                <input
                  type="range"
                  min={sf.min}
                  max={sf.max}
                  step={sf.step}
                  value={formData[sf.key] || sf.min}
                  onChange={(e) => handleChange(sf.key, e.target.value)}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #0d9488 0%, #0d9488 ${
                      ((Number(formData[sf.key] || sf.min) - sf.min) / (sf.max - sf.min)) * 100
                    }%, #e2e8f0 ${
                      ((Number(formData[sf.key] || sf.min) - sf.min) / (sf.max - sf.min)) * 100
                    }%, #e2e8f0 100%)`,
                  }}
                />
                <div className="flex justify-between text-xs mt-1" style={{ color: "#94a3b8" }}>
                  <span>{sf.min}</span>
                  <span>{sf.max}</span>
                </div>
              </div>
            ))}

            <SelectField
              label="Education"
              value={formData.Education}
              options={EDUCATION_OPTIONS}
              onChange={(v) => handleChange("Education", v)}
            />
            <SelectField
              label="Marital Status"
              value={formData.MaritalStatus}
              options={MARITAL_OPTIONS}
              onChange={(v) => handleChange("MaritalStatus", v)}
            />
            <SelectField
              label="Has Dependents"
              value={formData.HasDependents}
              options={YES_NO_OPTIONS}
              onChange={(v) => handleChange("HasDependents", v)}
            />
            <SelectField
              label="Employment Type"
              value={formData.EmploymentType}
              options={EMPLOYMENT_OPTIONS}
              onChange={(v) => handleChange("EmploymentType", v)}
            />
          </div>

          {/* Financial Info */}
          <SectionLabel>Financial Information</SectionLabel>
          <div className="grid gap-5 sm:grid-cols-2 mb-8">
            {numericFields.slice(0, 4).map((f) => (
              <NumericInput
                key={f.key}
                label={f.label}
                placeholder={f.placeholder}
                value={formData[f.key]}
                onChange={(v) => handleChange(f.key, v)}
              />
            ))}
          </div>

          {/* Credit Info */}
          <SectionLabel>Credit &amp; Loan Details</SectionLabel>
          <div className="grid gap-5 sm:grid-cols-2 mb-8">
            {numericFields.slice(4).map((f) => (
              <NumericInput
                key={f.key}
                label={f.label}
                placeholder={f.placeholder}
                value={formData[f.key]}
                onChange={(v) => handleChange(f.key, v)}
              />
            ))}
            <SelectField
              label="Loan Purpose"
              value={formData.LoanPurpose}
              options={LOAN_PURPOSE_OPTIONS}
              onChange={(v) => handleChange("LoanPurpose", v)}
            />
            <SelectField
              label="Has Mortgage"
              value={formData.HasMortgage}
              options={YES_NO_OPTIONS}
              onChange={(v) => handleChange("HasMortgage", v)}
            />
            <SelectField
              label="Has Co-Signer"
              value={formData.HasCoSigner}
              options={YES_NO_OPTIONS}
              onChange={(v) => handleChange("HasCoSigner", v)}
            />
          </div>

          {/* Predict Button */}
          <button
            onClick={handlePredict}
            disabled={!isFormValid || loading}
            className="w-full flex items-center justify-center gap-2.5 rounded-2xl px-6 py-4 text-base font-semibold text-white transition-all duration-300 hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:hover:scale-100"
            style={{
              background: isFormValid
                ? "linear-gradient(135deg, #0d9488, #14b8a6)"
                : "#cbd5e1",
              boxShadow: isFormValid ? "0 4px 14px rgba(13,148,136,0.3)" : "none",
            }}
          >
            {loading ? (
              <>
                <Loader2 className="size-5" style={{ animation: "spin-slow 1s linear infinite" }} />
                Analyzing...
              </>
            ) : (
              <>
                Run Prediction
                <ArrowRight className="size-5" />
              </>
            )}
          </button>

          {error && (
            <div
              className="mt-4 flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium"
              style={{ background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca" }}
            >
              <AlertTriangle className="size-4" />
              {error}
            </div>
          )}
        </div>

        {/* ── RIGHT: Result Card ── */}
        <div
          className="lg:col-span-2 rounded-3xl p-6 sm:p-8 self-start lg:sticky lg:top-24"
          style={{
            background: "#ffffff",
            border: "1px solid #f1f5f9",
            boxShadow: "var(--shadow-card)",
            animation: "fadeInUp 0.6s ease-out 0.25s both",
          }}
        >
          <h2 className="text-xl font-semibold mb-6" style={{ color: "#0f172a" }}>
            Prediction Result
          </h2>

          {prediction ? (
            <div className="space-y-8" style={{ animation: "fadeInUp 0.5s ease-out both" }}>
              <div
                className="rounded-xl px-4 py-3"
                style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}
              >
                <p className="text-xs uppercase tracking-wider mb-1" style={{ color: "#94a3b8" }}>
                  Model Used
                </p>
                <p className="text-sm font-semibold" style={{ color: "#0f172a" }}>
                  {prediction.model_name || "Random Forest"}
                </p>
              </div>

              {/* Status Badge */}
              <div className="text-center">
                <div
                  className="inline-flex items-center gap-3 rounded-2xl px-6 py-4"
                  style={{
                    background: isLowRisk ? "#f0fdf4" : "#fef2f2",
                    border: `1px solid ${isLowRisk ? "#bbf7d0" : "#fecaca"}`,
                  }}
                >
                  {isLowRisk ? (
                    <CheckCircle2 className="size-7" style={{ color: "#16a34a" }} />
                  ) : (
                    <AlertTriangle className="size-7" style={{ color: "#dc2626" }} />
                  )}
                  <span
                    className="text-2xl font-bold"
                    style={{ color: isLowRisk ? "#16a34a" : "#dc2626" }}
                  >
                    {isLowRisk ? "Low Risk" : "High Risk"}
                  </span>
                </div>
              </div>

              {/* Confidence Circle */}
              <div className="flex flex-col items-center">
                <svg width="140" height="140" viewBox="0 0 128 128" className="mb-3">
                  <circle
                    cx="64"
                    cy="64"
                    r={circleR}
                    fill="none"
                    stroke="#f1f5f9"
                    strokeWidth="10"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r={circleR}
                    fill="none"
                    stroke={isLowRisk ? "#16a34a" : "#dc2626"}
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={circleC}
                    strokeDashoffset={circleOffset}
                    transform="rotate(-90 64 64)"
                    style={{ transition: "stroke-dashoffset 1s ease-out" }}
                  />
                  <text
                    x="64"
                    y="60"
                    textAnchor="middle"
                    fill="#0f172a"
                    fontSize="22"
                    fontWeight="700"
                    fontFamily="Inter, sans-serif"
                  >
                    {confidencePercent.toFixed(1)}%
                  </text>
                  <text
                    x="64"
                    y="78"
                    textAnchor="middle"
                    fill="#94a3b8"
                    fontSize="10"
                    fontFamily="Inter, sans-serif"
                  >
                    Confidence
                  </text>
                </svg>
              </div>

              {/* Probability Bar */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span style={{ color: "#64748b" }}>Default Probability</span>
                  <span className="font-semibold" style={{ color: "#0f172a" }}>
                    {(prediction.probability_default * 100).toFixed(1)}%
                  </span>
                </div>
                <div
                  className="h-3 w-full rounded-full overflow-hidden"
                  style={{ background: "#f1f5f9" }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${prediction.probability_default * 100}%`,
                      background: `linear-gradient(90deg, ${
                        isLowRisk ? "#16a34a, #22c55e" : "#dc2626, #ef4444"
                      })`,
                      transition: "width 1s ease-out",
                    }}
                  />
                </div>
              </div>

              {/* Detail Cards */}
              <div className="grid grid-cols-2 gap-3">
                <DetailMini
                  label="No Default"
                  value={`${(prediction.probability_no_default * 100).toFixed(1)}%`}
                  color="#16a34a"
                />
                <DetailMini
                  label="Default"
                  value={`${(prediction.probability_default * 100).toFixed(1)}%`}
                  color="#dc2626"
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div
                className="mb-5 flex size-20 items-center justify-center rounded-3xl"
                style={{ background: "#f0fdfa" }}
              >
                <BarChartIcon />
              </div>
              <p className="text-base font-medium" style={{ color: "#94a3b8" }}>
                Fill all fields and click
              </p>
              <p className="text-base font-medium" style={{ color: "#94a3b8" }}>
                "Run Prediction" to see results
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Subcomponents ── */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="h-px flex-1" style={{ background: "#e2e8f0" }} />
      <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#94a3b8" }}>
        {children}
      </span>
      <div className="h-px flex-1" style={{ background: "#e2e8f0" }} />
    </div>
  );
}

function NumericInput({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5" style={{ color: "#475569" }}>
        {label}
      </label>
      <input
        type="number"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl px-4 py-3 text-sm transition-all duration-200 outline-none"
        style={{
          background: "#f8fafc",
          border: "1px solid #e2e8f0",
          color: "#0f172a",
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = "#0d9488";
          e.currentTarget.style.boxShadow = "0 0 0 3px rgba(13,148,136,0.1)";
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = "#e2e8f0";
          e.currentTarget.style.boxShadow = "none";
        }}
      />
    </div>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5" style={{ color: "#475569" }}>
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl px-4 py-3 text-sm transition-all duration-200 outline-none appearance-none cursor-pointer"
        style={{
          background: "#f8fafc",
          border: "1px solid #e2e8f0",
          color: "#0f172a",
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = "#0d9488";
          e.currentTarget.style.boxShadow = "0 0 0 3px rgba(13,148,136,0.1)";
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = "#e2e8f0";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

function DetailMini({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div
      className="rounded-xl p-3 text-center"
      style={{ background: "#f8fafc", border: "1px solid #f1f5f9" }}
    >
      <p className="text-xs mb-1" style={{ color: "#94a3b8" }}>
        {label}
      </p>
      <p className="text-lg font-bold" style={{ color }}>
        {value}
      </p>
    </div>
  );
}

function BarChartIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="12" width="4" height="9" rx="1" />
      <rect x="10" y="7" width="4" height="14" rx="1" />
      <rect x="17" y="3" width="4" height="18" rx="1" />
    </svg>
  );
}
