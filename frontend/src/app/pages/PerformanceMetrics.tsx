import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, Target } from "lucide-react";

// ROC Curve data
const rocData = [
  { fpr: 0, tpr: 0 },
  { fpr: 0.05, tpr: 0.42 },
  { fpr: 0.1, tpr: 0.68 },
  { fpr: 0.15, tpr: 0.82 },
  { fpr: 0.2, tpr: 0.9 },
  { fpr: 0.25, tpr: 0.94 },
  { fpr: 0.3, tpr: 0.96 },
  { fpr: 0.4, tpr: 0.98 },
  { fpr: 0.5, tpr: 0.99 },
  { fpr: 1, tpr: 1 },
];

// Confusion Matrix data
const confusionMatrix = [
  [95, 3, 2],
  [4, 92, 4],
  [1, 2, 97],
];

const classLabels = ["Class A", "Class B", "Class C"];

export function PerformanceMetrics() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Performance Metrics</h1>
        <p className="mt-2 text-slate-400">
          Detailed performance analysis of the best model
        </p>
      </div>

      {/* Top Metrics */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* AUC Score Card */}
        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-blue-500/10 to-purple-600/10 p-8 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="flex size-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/50">
              <TrendingUp className="size-7 text-white" />
            </div>
            <div>
              <p className="text-sm text-slate-400">AUC Score</p>
              <p className="text-4xl font-bold text-white">0.975</p>
            </div>
          </div>
          <p className="mt-4 text-sm text-slate-400">
            Excellent model discrimination capability
          </p>
        </div>

        {/* Train vs Test Accuracy */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-8 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex size-14 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/50">
              <Target className="size-7 text-white" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Accuracy Comparison</p>
              <p className="text-xl font-bold text-white">Train vs Test</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Training Accuracy</span>
              <span className="font-semibold text-white">97.8%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Test Accuracy</span>
              <span className="font-semibold text-white">96.2%</span>
            </div>
            <div className="mt-2 rounded-lg bg-green-500/20 px-3 py-2">
              <p className="text-sm text-green-400">
                ✓ Low overfitting detected (1.6% difference)
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Confusion Matrix */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-6 shadow-2xl backdrop-blur-xl">
          <h2 className="mb-6 text-xl font-semibold text-white">
            Confusion Matrix
          </h2>
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full">
              <div className="mb-2 text-center text-sm text-slate-400">
                Predicted Class
              </div>
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="w-24"></th>
                    {classLabels.map((label, i) => (
                      <th
                        key={i}
                        className="px-4 py-2 text-center text-sm font-medium text-slate-300"
                      >
                        {label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {confusionMatrix.map((row, i) => (
                    <tr key={i}>
                      {i === 0 && (
                        <td
                          rowSpan={3}
                          className="px-2 text-center text-sm text-slate-400 [writing-mode:vertical-lr] [text-orientation:mixed]"
                        >
                          Actual Class
                        </td>
                      )}
                      {row.map((value, j) => {
                        const isCorrect = i === j;
                        const total = row.reduce((a, b) => a + b, 0);
                        const percentage = ((value / total) * 100).toFixed(1);
                        const intensity = value / 100;

                        return (
                          <td key={j} className="border border-white/10 p-0">
                            <div
                              className={`flex size-24 flex-col items-center justify-center transition-all hover:scale-105 ${
                                isCorrect
                                  ? "bg-gradient-to-br from-green-500/30 to-green-600/30"
                                  : "bg-red-500/20"
                              }`}
                              style={{
                                opacity: 0.4 + intensity * 0.6,
                              }}
                            >
                              <span className="text-2xl font-bold text-white">
                                {value}
                              </span>
                              <span className="text-xs text-slate-400">
                                {percentage}%
                              </span>
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ROC Curve */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-6 shadow-2xl backdrop-blur-xl">
          <h2 className="mb-6 text-xl font-semibold text-white">ROC Curve</h2>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={rocData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis
                dataKey="fpr"
                stroke="#94a3b8"
                fontSize={12}
                label={{
                  value: "False Positive Rate",
                  position: "insideBottom",
                  offset: -5,
                  fill: "#94a3b8",
                }}
              />
              <YAxis
                stroke="#94a3b8"
                fontSize={12}
                label={{
                  value: "True Positive Rate",
                  angle: -90,
                  position: "insideLeft",
                  fill: "#94a3b8",
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #334155",
                  borderRadius: "8px",
                  color: "#fff",
                }}
                formatter={(value: number) => value.toFixed(2)}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="tpr"
                stroke="#3b82f6"
                strokeWidth={3}
                name="ROC Curve (AUC = 0.975)"
                dot={false}
              />
              <Line
                type="monotone"
                data={[
                  { fpr: 0, tpr: 0 },
                  { fpr: 1, tpr: 1 },
                ]}
                dataKey="tpr"
                stroke="#64748b"
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Random Classifier"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
