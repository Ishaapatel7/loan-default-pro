import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ChevronDown, Trophy, Cpu, LineChart as LineChartIcon, Brain } from "lucide-react";

/* ── Data ── */
const modelData = [
  {
    model: "Random Forest",
    icon: Brain,
    accuracy: 0.962,
    precision: 0.958,
    recall: 0.965,
    f1Score: 0.961,
    cvScore: 0.948,
    isBest: true,
    description:
      "An ensemble of decision trees that reduces overfitting through bagging. Each tree votes on the prediction, and the majority class wins. Excellent for tabular data with mixed feature types.",
    strengths: ["Robust to outliers", "Low overfitting risk", "Handles missing data well"],
  },
  {
    model: "XGBoost",
    icon: Cpu,
    accuracy: 0.941,
    precision: 0.938,
    recall: 0.943,
    f1Score: 0.94,
    cvScore: 0.932,
    isBest: false,
    description:
      "Gradient-boosted decision trees with regularization. Iteratively optimizes errors from previous trees, making it highly effective for structured data classification tasks.",
    strengths: ["Fast training", "Built-in regularization", "Feature importance ranking"],
  },
  {
    model: "SVM",
    icon: LineChartIcon,
    accuracy: 0.912,
    precision: 0.908,
    recall: 0.915,
    f1Score: 0.911,
    cvScore: 0.905,
    isBest: false,
    description:
      "Finds the optimal hyperplane that maximizes the margin between classes. Works well in high-dimensional spaces and is effective for binary classification problems.",
    strengths: ["Effective in high dimensions", "Memory efficient", "Versatile kernel functions"],
  },
  {
    model: "Logistic Regression",
    icon: LineChartIcon,
    accuracy: 0.883,
    precision: 0.879,
    recall: 0.886,
    f1Score: 0.882,
    cvScore: 0.875,
    isBest: false,
    description:
      "A linear model that predicts probabilities using the logistic function. Despite its simplicity, it provides a strong baseline and highly interpretable results.",
    strengths: ["Interpretable coefficients", "Fast inference", "Calibrated probabilities"],
  },
];

const chartData = modelData.map((m) => ({
  name: m.model.length > 12 ? m.model.substring(0, 12) + "…" : m.model,
  Accuracy: m.accuracy * 100,
  Precision: m.precision * 100,
  Recall: m.recall * 100,
  "F1 Score": m.f1Score * 100,
}));

const PASTEL_COLORS = {
  Accuracy: "#14b8a6",
  Precision: "#f97316",
  Recall: "#6366f1",
  "F1 Score": "#ec4899",
};

export function ModelInfo() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* Header */}
      <div className="mb-10" style={{ animation: "fadeInUp 0.6s ease-out both" }}>
        <h1 className="text-3xl sm:text-4xl font-bold" style={{ color: "#0f172a" }}>
          Model Information
        </h1>
        <p className="mt-2 text-base" style={{ color: "#64748b" }}>
          Explore and compare the machine learning models evaluated in this project.
        </p>
      </div>

      {/* ── Accordion Panels ── */}
      <div className="space-y-4 mb-12" style={{ animation: "fadeInUp 0.6s ease-out 0.1s both" }}>
        {modelData.map((model, index) => {
          const isOpen = openIndex === index;
          const Icon = model.icon;
          return (
            <div
              key={model.model}
              className="rounded-3xl overflow-hidden transition-all duration-300"
              style={{
                background: "#ffffff",
                border: `1px solid ${isOpen ? "#ccfbf1" : "#f1f5f9"}`,
                boxShadow: isOpen ? "var(--shadow-elevated)" : "var(--shadow-soft)",
              }}
            >
              {/* Accordion Header */}
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full flex items-center gap-4 px-6 sm:px-8 py-5 text-left transition-colors hover:bg-slate-50/50"
              >
                <div
                  className="flex size-11 shrink-0 items-center justify-center rounded-xl"
                  style={{
                    background: model.isBest ? "#f0fdfa" : "#f8fafc",
                    border: `1px solid ${model.isBest ? "#ccfbf1" : "#f1f5f9"}`,
                  }}
                >
                  <Icon className="size-5" style={{ color: model.isBest ? "#0d9488" : "#64748b" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold" style={{ color: "#0f172a" }}>
                      {model.model}
                    </span>
                    {model.isBest && (
                      <span
                        className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium"
                        style={{ background: "#f0fdfa", color: "#0d9488", border: "1px solid #ccfbf1" }}
                      >
                        <Trophy className="size-3" />
                        Best Model
                      </span>
                    )}
                  </div>
                  <span className="text-sm" style={{ color: "#94a3b8" }}>
                    Accuracy: {(model.accuracy * 100).toFixed(1)}%
                  </span>
                </div>
                <ChevronDown
                  className="size-5 shrink-0 transition-transform duration-300"
                  style={{
                    color: "#94a3b8",
                    transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                />
              </button>

              {/* Accordion Content */}
              {isOpen && (
                <div
                  className="px-6 sm:px-8 pb-6"
                  style={{ animation: "fadeInUp 0.3s ease-out both" }}
                >
                  <div className="border-t pt-5" style={{ borderColor: "#f1f5f9" }}>
                    <p className="leading-relaxed mb-5" style={{ color: "#64748b" }}>
                      {model.description}
                    </p>

                    {/* Strengths */}
                    <div className="mb-5">
                      <h4 className="text-sm font-semibold mb-2" style={{ color: "#475569" }}>
                        Key Strengths
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {model.strengths.map((s) => (
                          <span
                            key={s}
                            className="rounded-full px-3 py-1 text-xs font-medium"
                            style={{ background: "#f0fdfa", color: "#0d9488" }}
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Metrics inline */}
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                      {(
                        [
                          ["Accuracy", model.accuracy],
                          ["Precision", model.precision],
                          ["Recall", model.recall],
                          ["F1 Score", model.f1Score],
                          ["CV Score", model.cvScore],
                        ] as [string, number][]
                      ).map(([label, val]) => (
                        <div
                          key={label}
                          className="rounded-xl p-3 text-center"
                          style={{ background: "#f8fafc", border: "1px solid #f1f5f9" }}
                        >
                          <p className="text-xs mb-1" style={{ color: "#94a3b8" }}>
                            {label}
                          </p>
                          <p className="text-lg font-bold" style={{ color: "#0f172a" }}>
                            {(val * 100).toFixed(1)}%
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Comparison Table ── */}
      <div
        className="rounded-3xl overflow-hidden mb-12"
        style={{
          background: "#ffffff",
          border: "1px solid #f1f5f9",
          boxShadow: "var(--shadow-card)",
          animation: "fadeInUp 0.6s ease-out 0.2s both",
        }}
      >
        <div className="px-6 sm:px-8 py-5 border-b" style={{ borderColor: "#f1f5f9" }}>
          <h2 className="text-xl font-semibold" style={{ color: "#0f172a" }}>
            Performance Comparison
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                {["Model", "Accuracy", "Precision", "Recall", "F1 Score", "CV Score"].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider"
                      style={{ color: "#94a3b8" }}
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {modelData.map((m, i) => (
                <tr
                  key={i}
                  className="transition-colors hover:bg-slate-50/50"
                  style={{
                    borderTop: "1px solid #f1f5f9",
                    background: m.isBest ? "#f0fdfa" : "transparent",
                  }}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="font-medium" style={{ color: "#0f172a" }}>
                        {m.model}
                      </span>
                      {m.isBest && (
                        <Trophy className="size-4" style={{ color: "#0d9488" }} />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium" style={{ color: m.isBest ? "#0d9488" : "#0f172a" }}>
                    {(m.accuracy * 100).toFixed(1)}%
                  </td>
                  <td className="px-6 py-4" style={{ color: "#475569" }}>
                    {(m.precision * 100).toFixed(1)}%
                  </td>
                  <td className="px-6 py-4" style={{ color: "#475569" }}>
                    {(m.recall * 100).toFixed(1)}%
                  </td>
                  <td className="px-6 py-4" style={{ color: "#475569" }}>
                    {(m.f1Score * 100).toFixed(1)}%
                  </td>
                  <td className="px-6 py-4" style={{ color: "#475569" }}>
                    {(m.cvScore * 100).toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Chart ── */}
      <div
        className="rounded-3xl p-6 sm:p-8"
        style={{
          background: "#ffffff",
          border: "1px solid #f1f5f9",
          boxShadow: "var(--shadow-card)",
          animation: "fadeInUp 0.6s ease-out 0.3s both",
        }}
      >
        <h2 className="text-xl font-semibold mb-6" style={{ color: "#0f172a" }}>
          Visual Comparison
        </h2>
        <ResponsiveContainer width="100%" height={380}>
          <BarChart data={chartData} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis
              dataKey="name"
              stroke="#94a3b8"
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: "#e2e8f0" }}
            />
            <YAxis
              stroke="#94a3b8"
              fontSize={12}
              domain={[80, 100]}
              tickLine={false}
              axisLine={{ stroke: "#e2e8f0" }}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: "16px",
                boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                color: "#0f172a",
              }}
              formatter={(value: number) => `${value.toFixed(1)}%`}
            />
            <Legend
              wrapperStyle={{ paddingTop: "16px" }}
              iconType="circle"
              iconSize={8}
            />
            <Bar dataKey="Accuracy" fill={PASTEL_COLORS.Accuracy} radius={[8, 8, 0, 0]} />
            <Bar dataKey="Precision" fill={PASTEL_COLORS.Precision} radius={[8, 8, 0, 0]} />
            <Bar dataKey="Recall" fill={PASTEL_COLORS.Recall} radius={[8, 8, 0, 0]} />
            <Bar dataKey="F1 Score" fill={PASTEL_COLORS["F1 Score"]} radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
