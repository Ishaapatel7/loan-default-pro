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
import { Trophy, Medal } from "lucide-react";

const modelData = [
  {
    model: "Random Forest",
    accuracy: 0.962,
    precision: 0.958,
    recall: 0.965,
    f1Score: 0.961,
    cvScore: 0.948,
    isBest: true,
  },
  {
    model: "XGBoost",
    accuracy: 0.941,
    precision: 0.938,
    recall: 0.943,
    f1Score: 0.94,
    cvScore: 0.932,
    isBest: false,
  },
  {
    model: "SVM",
    accuracy: 0.912,
    precision: 0.908,
    recall: 0.915,
    f1Score: 0.911,
    cvScore: 0.905,
    isBest: false,
  },
  {
    model: "Logistic Regression",
    accuracy: 0.883,
    precision: 0.879,
    recall: 0.886,
    f1Score: 0.882,
    cvScore: 0.875,
    isBest: false,
  },
  {
    model: "Decision Tree",
    accuracy: 0.851,
    precision: 0.847,
    recall: 0.854,
    f1Score: 0.85,
    cvScore: 0.842,
    isBest: false,
  },
];

const chartData = modelData.map((m) => ({
  name: m.model,
  Accuracy: m.accuracy * 100,
  Precision: m.precision * 100,
  Recall: m.recall * 100,
  "F1 Score": m.f1Score * 100,
}));

export function ModelComparison() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Model Comparison</h1>
        <p className="mt-2 text-slate-400">
          Compare performance metrics across different machine learning models
        </p>
      </div>

      {/* Comparison Table */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/50 shadow-2xl backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                  Model
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                  Accuracy
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                  Precision
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                  Recall
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                  F1 Score
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                  CV Score
                </th>
              </tr>
            </thead>
            <tbody>
              {modelData.map((model, index) => (
                <tr
                  key={index}
                  className={`border-b border-white/5 transition-colors hover:bg-white/5 ${
                    model.isBest
                      ? "bg-gradient-to-r from-blue-500/10 to-purple-600/10"
                      : ""
                  }`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {model.isBest && (
                        <div className="flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-yellow-500 to-orange-600 shadow-lg shadow-yellow-500/50">
                          <Trophy className="size-4 text-white" />
                        </div>
                      )}
                      <span className={`font-medium ${model.isBest ? "text-blue-400" : "text-white"}`}>
                        {model.model}
                      </span>
                      {model.isBest && (
                        <span className="rounded-full bg-blue-500/20 px-2 py-0.5 text-xs font-medium text-blue-400">
                          Best
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-white">
                    {(model.accuracy * 100).toFixed(1)}%
                  </td>
                  <td className="px-6 py-4 text-white">
                    {(model.precision * 100).toFixed(1)}%
                  </td>
                  <td className="px-6 py-4 text-white">
                    {(model.recall * 100).toFixed(1)}%
                  </td>
                  <td className="px-6 py-4 text-white">
                    {(model.f1Score * 100).toFixed(1)}%
                  </td>
                  <td className="px-6 py-4 text-white">
                    {(model.cvScore * 100).toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Performance Chart */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-6 shadow-2xl backdrop-blur-xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">
            Performance Comparison
          </h2>
          <div className="flex items-center gap-2 rounded-lg bg-blue-500/20 px-3 py-1.5">
            <Medal className="size-4 text-blue-400" />
            <span className="text-sm font-medium text-blue-400">
              Higher is better
            </span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis
              dataKey="name"
              stroke="#94a3b8"
              fontSize={12}
              angle={-15}
              textAnchor="end"
              height={80}
            />
            <YAxis stroke="#94a3b8" fontSize={12} domain={[80, 100]} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1e293b",
                border: "1px solid #334155",
                borderRadius: "8px",
                color: "#fff",
              }}
              formatter={(value: number) => `${value.toFixed(1)}%`}
            />
            <Legend wrapperStyle={{ paddingTop: "20px" }} />
            <Bar dataKey="Accuracy" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Precision" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Recall" fill="#06b6d4" radius={[4, 4, 0, 0]} />
            <Bar dataKey="F1 Score" fill="#ec4899" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
