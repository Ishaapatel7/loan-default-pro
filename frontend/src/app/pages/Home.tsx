import { Link } from "react-router";
import { ShieldCheck, Zap, BarChart3, ArrowRight } from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "Accurate Predictions",
    description:
      "Our Gradient Boosting model delivers highly accurate loan default predictions based on comprehensive borrower data.",
    color: "#0d9488",
    bg: "#f0fdfa",
  },
  {
    icon: Zap,
    title: "Real-time Processing",
    description:
      "Get instant credit risk assessments through our optimized Flask backend — results in under a second.",
    color: "#f97316",
    bg: "#fff7ed",
  },
  {
    icon: BarChart3,
    title: "Data-driven Insights",
    description:
      "Compare multiple ML models, explore performance metrics, and understand the factors that drive predictions.",
    color: "#6366f1",
    bg: "#eef2ff",
  },
];

export function Home() {
  return (
    <div>
      {/* ── Hero Section ── */}
      <section
        className="relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #f0fdfa 0%, #f8fafc 40%, #fff7ed 100%)",
        }}
      >
        {/* Decorative circles */}
        <div
          className="absolute -top-24 -right-24 size-96 rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, #14b8a6, transparent)" }}
        />
        <div
          className="absolute -bottom-32 -left-32 size-80 rounded-full opacity-15 blur-3xl"
          style={{ background: "radial-gradient(circle, #f97316, transparent)" }}
        />

        <div
          className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36 text-center"
          style={{ animation: "fadeInUp 0.8s ease-out both" }}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium mb-8"
            style={{ background: "#f0fdfa", color: "#0d9488", border: "1px solid #ccfbf1" }}
          >
            <ShieldCheck className="size-4" />
            ML-Powered Risk Assessment
          </div>

          <h1
            className="mx-auto max-w-4xl text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight"
            style={{ color: "#0f172a" }}
          >
            Smart Credit Risk{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #0d9488, #14b8a6)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Assessment Platform
            </span>
          </h1>

          <p
            className="mx-auto mt-6 max-w-2xl text-lg sm:text-xl leading-relaxed"
            style={{ color: "#64748b" }}
          >
            Predict loan default risk with machine learning. Enter borrower details and get instant,
            data-driven credit risk assessments powered by our trained Gradient Boosting model.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/predict"
              className="group inline-flex items-center gap-2 rounded-2xl px-8 py-4 text-base font-semibold text-white transition-all duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: "linear-gradient(135deg, #0d9488, #14b8a6)",
                boxShadow: "0 4px 14px rgba(13, 148, 136, 0.3)",
              }}
            >
              Try Prediction
              <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/models"
              className="inline-flex items-center gap-2 rounded-2xl px-8 py-4 text-base font-semibold transition-all duration-300 hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: "#ffffff",
                color: "#0f172a",
                border: "1px solid #e2e8f0",
              }}
            >
              Explore Models
            </Link>
          </div>
        </div>
      </section>

      {/* ── Feature Cards ── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
        <div className="text-center mb-16" style={{ animation: "fadeInUp 0.8s ease-out 0.2s both" }}>
          <h2 className="text-3xl sm:text-4xl font-bold" style={{ color: "#0f172a" }}>
            Why CreditRisk Insight?
          </h2>
          <p className="mt-4 text-lg" style={{ color: "#64748b" }}>
            Built with precision, speed, and transparency in mind.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group relative rounded-3xl p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              style={{
                background: "#ffffff",
                border: "1px solid #f1f5f9",
                boxShadow: "var(--shadow-card)",
                animation: `fadeInUp 0.6s ease-out ${0.3 + index * 0.15}s both`,
              }}
            >
              {/* Icon */}
              <div
                className="mb-6 inline-flex size-14 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110"
                style={{ background: feature.bg }}
              >
                <feature.icon className="size-7" style={{ color: feature.color }} />
              </div>

              <h3 className="text-xl font-semibold mb-3" style={{ color: "#0f172a" }}>
                {feature.title}
              </h3>
              <p className="leading-relaxed" style={{ color: "#64748b" }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Stats Section ── */}
      <section
        className="py-16"
        style={{ background: "linear-gradient(135deg, #f0fdfa, #f8fafc)" }}
      >
        <div
          className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
          style={{ animation: "fadeInUp 0.8s ease-out 0.5s both" }}
        >
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Best Model Accuracy", value: "96.2%" },
              { label: "Models Compared", value: "5" },
              { label: "Input Features", value: "16" },
              { label: "AUC Score", value: "0.975" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl sm:text-4xl font-bold" style={{ color: "#0d9488" }}>
                  {stat.value}
                </p>
                <p className="mt-2 text-sm font-medium" style={{ color: "#64748b" }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
