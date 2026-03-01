import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Trophy, Target, CheckCircle2, Database, Grid3x3 } from "lucide-react";

const modelAccuracies = [
  { name: "Random Forest", accuracy: 0.96 },
  { name: "XGBoost", accuracy: 0.94 },
  { name: "SVM", accuracy: 0.91 },
  { name: "Logistic Reg", accuracy: 0.88 },
  { name: "Decision Tree", accuracy: 0.85 },
];

const targetDistribution = [
  { name: "Class 0", value: 340 },
  { name: "Class 1", value: 280 },
  { name: "Class 2", value: 380 },
];

const COLORS = ["#3b82f6", "#8b5cf6", "#06b6d4"];

export function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="mt-2 text-slate-400">
          Overview of your machine learning classification project
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
        <SummaryCard
          icon={Trophy}
          label="Best Model"
          value="Random Forest"
          color="from-blue-500 to-blue-600"
        />
        <SummaryCard
          icon={Target}
          label="Final Accuracy"
          value="96.2%"
          color="from-purple-500 to-purple-600"
        />
        <SummaryCard
          icon={CheckCircle2}
          label="CV Score"
          value="94.8%"
          color="from-cyan-500 to-cyan-600"
        />
        <SummaryCard
          icon={Database}
          label="Dataset Size"
          value="1,000"
          color="from-blue-500 to-purple-600"
        />
        <SummaryCard
          icon={Grid3x3}
          label="Features"
          value="12"
          color="from-purple-500 to-pink-600"
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Model Accuracies Chart */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-6 shadow-2xl backdrop-blur-xl">
            <h2 className="mb-6 text-xl font-semibold text-white">
              Model Accuracy Comparison
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={modelAccuracies}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} domain={[0.8, 1]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #334155",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                  formatter={(value: number) => `${(value * 100).toFixed(1)}%`}
                />
                <Bar
                  dataKey="accuracy"
                  fill="url(#colorGradient)"
                  radius={[8, 8, 0, 0]}
                />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity={1} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Target Distribution */}
        <div>
          <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-6 shadow-2xl backdrop-blur-xl">
            <h2 className="mb-6 text-xl font-semibold text-white">
              Target Distribution
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={targetDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {targetDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #334155",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

interface SummaryCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  color: string;
}

function SummaryCard({ icon: Icon, label, value, color }: SummaryCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/50 p-6 shadow-2xl backdrop-blur-xl transition-all hover:border-white/20 hover:shadow-blue-500/20">
      <div className="absolute right-0 top-0 size-24 translate-x-8 -translate-y-8 rounded-full bg-gradient-to-br opacity-20 blur-2xl" style={{ backgroundImage: `linear-gradient(to bottom right, ${color})` }} />
      <div className={`mb-4 inline-flex rounded-lg bg-gradient-to-br ${color} p-3 shadow-lg`}>
        <Icon className="size-6 text-white" />
      </div>
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-bold text-white">{value}</p>
    </div>
  );
}
