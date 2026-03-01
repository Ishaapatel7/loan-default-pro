import { Code2, Database, Cog, CheckCircle2, Shield, FlaskConical, Cpu } from "lucide-react";

const techStack = [
  { icon: FlaskConical, label: "Flask", desc: "Python backend API" },
  { icon: Cpu, label: "Scikit-learn", desc: "ML model training" },
  { icon: Code2, label: "React + Vite", desc: "Frontend framework" },
  { icon: Database, label: "Gradient Boosting", desc: "Production model" },
];

const timeline = [
  {
    step: 1,
    title: "Data Preprocessing",
    description:
      "Applied data cleaning, handled outliers, and performed feature scaling using StandardScaler to normalize all 16 input features.",
  },
  {
    step: 2,
    title: "Model Selection & Training",
    description:
      "Evaluated five classification algorithms: Random Forest, XGBoost, SVM, Logistic Regression, and Decision Tree — selecting the best performer.",
  },
  {
    step: 3,
    title: "Cross-Validation",
    description:
      "Implemented 5-fold cross-validation to assess model generalization and ensure stable performance across data splits.",
  },
  {
    step: 4,
    title: "Hyperparameter Tuning",
    description:
      "Used GridSearchCV to optimize each model's hyperparameters, squeezing out the best possible accuracy.",
  },
  {
    step: 5,
    title: "Deployment",
    description:
      "Best model (Gradient Boosting) serialized and served via a Flask REST API, consumed by this React frontend in real-time.",
  },
];

export function AboutProject() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* Header */}
      <div className="mb-12" style={{ animation: "fadeInUp 0.6s ease-out both" }}>
        <h1 className="text-3xl sm:text-4xl font-bold" style={{ color: "#0f172a" }}>
          About CreditRisk Insight
        </h1>
        <p className="mt-2 text-base max-w-2xl" style={{ color: "#64748b" }}>
          A machine learning–powered platform for credit risk assessment, built as part of a
          comprehensive classification study comparing multiple algorithms.
        </p>
      </div>

      {/* ── Mission ── */}
      <section
        className="rounded-3xl p-8 sm:p-10 mb-10"
        style={{
          background: "linear-gradient(135deg, #f0fdfa 0%, #ffffff 100%)",
          border: "1px solid #ccfbf1",
          boxShadow: "var(--shadow-card)",
          animation: "fadeInUp 0.6s ease-out 0.1s both",
        }}
      >
        <div className="flex items-start gap-4 mb-5">
          <div
            className="flex size-12 shrink-0 items-center justify-center rounded-2xl"
            style={{ background: "#0d9488" }}
          >
            <Shield className="size-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold" style={{ color: "#0f172a" }}>
              Our Mission
            </h2>
            <p className="mt-1 text-sm" style={{ color: "#64748b" }}>
              Data-driven decisions for better lending outcomes
            </p>
          </div>
        </div>
        <p className="leading-relaxed" style={{ color: "#475569" }}>
          This project aims to develop a robust machine learning classification system capable of
          accurately predicting loan default risk based on comprehensive borrower data. By comparing
          multiple algorithms and rigorously evaluating performance, we identify the most effective
          model — enabling lenders to make informed, fair, and data-backed credit decisions.
        </p>
        <div
          className="mt-6 rounded-2xl p-4 flex items-center gap-3"
          style={{ background: "#f0fdf4", border: "1px solid #bbf7d0" }}
        >
          <CheckCircle2 className="size-5 shrink-0" style={{ color: "#16a34a" }} />
          <p className="text-sm" style={{ color: "#16a34a" }}>
            The model demonstrates excellent generalization with minimal overfitting (1.6% difference
            between train and test accuracy), making it suitable for production deployment.
          </p>
        </div>
      </section>

      {/* ── Technology Stack ── */}
      <section className="mb-10" style={{ animation: "fadeInUp 0.6s ease-out 0.2s both" }}>
        <h2 className="text-2xl font-bold mb-6" style={{ color: "#0f172a" }}>
          Technology Stack
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {techStack.map((tech) => (
            <div
              key={tech.label}
              className="rounded-2xl p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
              style={{
                background: "#ffffff",
                border: "1px solid #f1f5f9",
                boxShadow: "var(--shadow-soft)",
              }}
            >
              <div
                className="mb-3 inline-flex size-10 items-center justify-center rounded-xl"
                style={{ background: "#f0fdfa" }}
              >
                <tech.icon className="size-5" style={{ color: "#0d9488" }} />
              </div>
              <h3 className="font-semibold" style={{ color: "#0f172a" }}>
                {tech.label}
              </h3>
              <p className="text-sm mt-1" style={{ color: "#94a3b8" }}>
                {tech.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How It Works (Timeline) ── */}
      <section className="mb-10" style={{ animation: "fadeInUp 0.6s ease-out 0.3s both" }}>
        <h2 className="text-2xl font-bold mb-6" style={{ color: "#0f172a" }}>
          How It Works
        </h2>
        <div
          className="rounded-3xl p-6 sm:p-8"
          style={{
            background: "#ffffff",
            border: "1px solid #f1f5f9",
            boxShadow: "var(--shadow-card)",
          }}
        >
          <div className="space-y-0">
            {timeline.map((item, index) => (
              <div key={item.step} className="flex gap-4 sm:gap-6">
                {/* Line + dot */}
                <div className="flex flex-col items-center">
                  <div
                    className="flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                    style={{
                      background: "linear-gradient(135deg, #0d9488, #14b8a6)",
                    }}
                  >
                    {item.step}
                  </div>
                  {index < timeline.length - 1 && (
                    <div className="w-0.5 flex-1 my-1" style={{ background: "#e2e8f0" }} />
                  )}
                </div>

                {/* Content */}
                <div className={`pb-8 ${index === timeline.length - 1 ? "pb-0" : ""}`}>
                  <h3 className="font-semibold text-base" style={{ color: "#0f172a" }}>
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "#64748b" }}>
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Dataset Details ── */}
      <section style={{ animation: "fadeInUp 0.6s ease-out 0.4s both" }}>
        <h2 className="text-2xl font-bold mb-6" style={{ color: "#0f172a" }}>
          Dataset Details
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { label: "Total Samples", value: "255,347 instances" },
            { label: "Input Features", value: "16 features" },
            { label: "Target Classes", value: "Default / No Default" },
            { label: "Data Split", value: "80% Train / 20% Test" },
            { label: "Best Model", value: "Gradient Boosting" },
            { label: "Test Accuracy", value: "96.2%" },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl p-5"
              style={{
                background: "#ffffff",
                border: "1px solid #f1f5f9",
                boxShadow: "var(--shadow-soft)",
              }}
            >
              <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: "#94a3b8" }}>
                {item.label}
              </p>
              <p className="text-lg font-semibold" style={{ color: "#0f172a" }}>
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
