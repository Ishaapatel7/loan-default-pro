import { useState } from "react";
import { Outlet, NavLink, Link } from "react-router";
import { Shield, Menu, X } from "lucide-react";

const navItems = [
  { to: "/", label: "Home", exact: true },
  { to: "/predict", label: "Prediction" },
  { to: "/models", label: "Model Info" },
  { to: "/about", label: "About" },
];

export function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--background)" }}>
      {/* ── Top Navigation Bar ── */}
      <header
        className="sticky top-0 z-50 backdrop-blur-xl border-b"
        style={{
          background: "var(--glass-bg)",
          borderColor: "var(--border)",
          boxShadow: "var(--shadow-soft)",
        }}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div
              className="flex size-9 items-center justify-center rounded-xl transition-transform group-hover:scale-110"
              style={{ background: "linear-gradient(135deg, #0d9488, #14b8a6)" }}
            >
              <Shield className="size-5 text-white" />
            </div>
            <span className="text-lg font-bold" style={{ color: "var(--foreground)" }}>
              CreditRisk<span style={{ color: "var(--primary)" }}> Insight</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.exact}
                className={({ isActive }) =>
                  `relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "text-teal-700 bg-teal-50"
                      : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Mobile toggle */}
          <button
            className="md:hidden flex items-center justify-center size-10 rounded-xl hover:bg-slate-100 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="size-5 text-slate-600" /> : <Menu className="size-5 text-slate-600" />}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div
            className="md:hidden border-t px-4 pb-4 pt-2"
            style={{ borderColor: "var(--border)", background: "var(--card)" }}
          >
            <nav className="flex flex-col gap-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.exact}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? "text-teal-700 bg-teal-50"
                        : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* ── Main Content ── */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* ── Footer ── */}
      <footer
        className="border-t py-8"
        style={{ borderColor: "var(--border)", background: "var(--card)" }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="size-4" style={{ color: "var(--primary)" }} />
            <span className="text-sm font-medium" style={{ color: "var(--muted-foreground)" }}>
              CreditRisk Insight
            </span>
          </div>
          <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
            Powered by Machine Learning · Built with Flask &amp; React
          </p>
        </div>
      </footer>
    </div>
  );
}
