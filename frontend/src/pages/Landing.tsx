import { useState } from "react"
import {
  Link,
  useNavigate,
} from "react-router-dom"
import { TOKEN_STORAGE_KEY } from "../constants/auth"

import {
  authenticate,
  DEMO_PASSWORD,
  DEMO_USERNAME,
} from "../services/auth"

type LandingProps = {
  onLogin: (token: string) => void
}

type PreviewMetricProps = {
  label: string
  value: string
  detail: string
  tone?: "neutral" | "success" | "warning"
  delay?: number
}

function PreviewMetric({
  label,
  value,
  detail,
  tone = "neutral",
  delay = 0,
}: PreviewMetricProps) {
  return (
    <div
      className="animate-fade-up rounded-2xl border border-slate-200 bg-white p-4"
      style={{
        animationDelay: `${delay}ms`,
      }}
    >
      <p className="text-xs font-medium text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-2xl font-bold text-slate-900">
        {value}
      </p>

      <p
        className={`mt-1 text-xs ${
          tone === "success"
            ? "font-medium text-emerald-600"
            : tone === "warning"
              ? "font-medium text-orange-500"
              : "text-slate-500"
        }`}
      >
        {detail}
      </p>
    </div>
  )
}

const features = [
  {
    title: "Inventory Management",
    description:
      "Add, update and track automotive parts and stock from one place.",
    icon: "inventory" as const,
  },
  {
    title: "Stock Insights",
    description:
      "Monitor inventory value, category performance and stock trends.",
    icon: "insights" as const,
  },
  {
    title: "Low Stock Alerts",
    description:
      "Surface low-stock and out-of-stock items before they become a problem.",
    icon: "alerts" as const,
  },
  {
    title: "Reports & Analytics",
    description:
      "Use application analytics and Power BI reporting for deeper insight.",
    icon: "reports" as const,
  },
]

const technologies = [
  "Python",
  "FastAPI",
  "React",
  "TypeScript",
  "PostgreSQL",
  "SQLAlchemy",
  "Docker",
  "GitHub Actions",
  "Power BI",
]

type FeatureIconProps = {
  type:
    | "inventory"
    | "insights"
    | "alerts"
    | "reports"
}

function FeatureIcon({
  type,
}: FeatureIconProps) {
  if (type === "inventory") {
    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="M4 7.5 12 3l8 4.5v9L12 21l-8-4.5v-9Z" />
        <path d="m4 7.5 8 4.5 8-4.5" />
        <path d="M12 12v9" />
      </svg>
    )
  }

  if (type === "insights") {
    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="M4 19V10" />
        <path d="M10 19V5" />
        <path d="M16 19v-7" />
        <path d="M22 19V8" />
      </svg>
    )
  }

  if (type === "alerts") {
    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9Z" />
        <path d="M10 21h4" />
      </svg>
    )
  }

  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M4 19V9" />
      <path d="M9 19V5" />
      <path d="M14 19v-7" />
      <path d="M19 19V3" />
      <path d="M2 19h20" />
    </svg>
  )
}

export default function Landing({
  onLogin,
}: LandingProps) {
  const navigate = useNavigate()

  const [demoLoading, setDemoLoading] =
    useState(false)

  const [demoError, setDemoError] =
    useState<string | null>(null)

  async function openDemo() {
    try {
      setDemoLoading(true)
      setDemoError(null)

      const accessToken = await authenticate(
        DEMO_USERNAME,
        DEMO_PASSWORD
      )

      localStorage.setItem(
        TOKEN_STORAGE_KEY,
        accessToken
      )

      onLogin(accessToken)

      navigate("/dashboard")
    } catch {
      setDemoError(
        "The demo is temporarily unavailable. Please try again."
      )
    } finally {
      setDemoLoading(false)
    }
  }
  return (
    <main className="landing">
      {/* Header */}
      <header className="landing__header">
        <div className="landing__container landing__header-inner">
          <Link to="/" className="landing__brand">
            <span className="landing__brand-mark">⬡</span>
            <span>PartsPilot</span>
          </Link>

          <nav className="landing__nav" aria-label="Main navigation">
            <a href="#features">Features</a>
            <a href="#demo">Demo</a>
            <a href="#technology">Tech Stack</a>
            <a href="#about">About</a>
          </nav>

          <div className="landing__header-actions">
            <button
              type="button"
              onClick={openDemo}
              disabled={demoLoading}
              aria-busy={demoLoading}
              className="landing__button landing__button--secondary"
            >
              {demoLoading ? "Opening demo..." : "View Live Demo"}
            </button>

            <Link
              to="/login"
              className="landing__button landing__button--primary"
            >
              Sign in
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="landing__hero">
        <div className="landing__container landing__hero-grid">
          <div className="landing__hero-content">
            <p className="landing__eyebrow">
              Automotive Inventory Intelligence
            </p>

            <h1>
              Smart inventory.
              <span> Stronger business.</span>
            </h1>

            <p className="landing__hero-description">
              PartsPilot helps automotive businesses track stock levels,
              monitor performance and make data-driven decisions — all
              in one place.
            </p>

            <div className="landing__hero-actions">
              <button
                type="button"
                onClick={openDemo}
                disabled={demoLoading}
                className="landing__button landing__button--primary"
              >
                {demoLoading ? "Opening demo..." : "View Live Demo"}
              </button>

              <Link
                to="/login"
                className="landing__button landing__button--secondary"
              >
                Sign in
              </Link>
            </div>

            {demoError && (
              <p
                role="alert"
                className="landing__demo-error"
              >
                {demoError}
              </p>
            )}

            <div className="landing__hero-points">
              <span>Real-time stock tracking</span>
              <span>Powerful analytics</span>
              <span>Built for automotive</span>
            </div>
          </div>

          <div className="landing__dashboard-preview" id="demo">
            <div className="landing__preview-shell">
              <aside className="landing__preview-sidebar">
                <strong>PartsPilot</strong>

                <nav>
                  <span className="is-active">Dashboard</span>
                  <span>Inventory</span>
                  <span>Suppliers</span>
                  <span>Reports</span>
                  <span>Settings</span>
                </nav>
              </aside>

              <div className="landing__preview-main">
                <div className="landing__preview-heading">
                  <div>
                    <p>Dashboard Overview</p>
                    <h2>Inventory performance</h2>
                  </div>

                  <span>Live</span>
                </div>

                <div className="landing__metric-grid">
                  <PreviewMetric
                    label="Inventory value"
                    value="£128,450"
                    detail="+8.4% this month"
                    tone="success"
                    delay={0}
                  />

                  <PreviewMetric
                    label="Low-stock items"
                    value="14"
                    detail="Needs attention"
                    tone="warning"
                    delay={70}
                  />

                  <PreviewMetric
                    label="Active products"
                    value="186"
                    detail="Across 12 categories"
                    delay={140}
                  />

                  <PreviewMetric
                    label="Stock turnover"
                    value="92%"
                    detail="Healthy inventory levels"
                    tone="success"
                    delay={210}
                  />
                </div>

                <div className="landing__chart-placeholder">
                  <div className="landing__chart-header">
                    <div>
                      <strong>
                        Inventory value &amp; stock trend
                      </strong>

                      <span>Six-month overview</span>
                    </div>

                    <div className="landing__chart-legend">
                      <span>
                        <i className="landing__legend-bar" />
                        Value
                      </span>

                      <span>
                        <i className="landing__legend-line" />
                        Stock
                      </span>
                    </div>
                  </div>

                  <div className="landing__chart">
                    <div className="landing__chart-y">
                      <span>£150k</span>
                      <span>£100k</span>
                      <span>£50k</span>
                      <span>£0</span>
                    </div>

                    <div className="landing__chart-area">
                      <div className="landing__chart-grid">
                        <span />
                        <span />
                        <span />
                        <span />
                      </div>

                      <div className="landing__chart-bars">
                        {[44, 56, 51, 69, 77, 88].map(
                          (height, index) => (
                            <span
                              key={index}
                              style={{
                                height: `${height}%`,
                              }}
                            />
                          )
                        )}
                      </div>

                      <svg
                        viewBox="0 0 600 100"
                        preserveAspectRatio="none"
                        className="landing__chart-line"
                        aria-hidden="true"
                      >
                        <polyline
                          points="10,72 125,62 240,67 355,43 470,35 590,19"
                        />

                        {[
                          [10, 72],
                          [125, 62],
                          [240, 67],
                          [355, 43],
                          [470, 35],
                          [590, 19],
                        ].map(([cx, cy], index) => (
                          <circle
                            key={index}
                            cx={cx}
                            cy={cy}
                            r="3"
                          />
                        ))}
                      </svg>

                      <div className="landing__chart-x">
                        <span>Mar</span>
                        <span>Apr</span>
                        <span>May</span>
                        <span>Jun</span>
                        <span>Jul</span>
                        <span>Aug</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section
        className="landing__features"
        id="features"
      >
        <div className="landing__container landing__features-grid">
          {features.map((feature) => (
            <article
              className="landing__feature"
              key={feature.title}
            >
              <div className="landing__feature-icon">
                <FeatureIcon type={feature.icon} />
              </div>  


              <div>
                <h2>{feature.title}</h2>
                <p>{feature.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Technology */}
      <section
        className="landing__technology"
        id="technology"
      >
        <div className="landing__container landing__technology-grid">
          <div>
            <p className="landing__section-eyebrow">
              Engineering
            </p>

            <h2>Built with modern technologies.</h2>

            <p>
              A full-stack application built around a React frontend,
              FastAPI backend and PostgreSQL database.
            </p>
          </div>

          <div className="landing__technology-list">
            {technologies.map((technology) => (
              <span key={technology}>
                {technology}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Demo CTA */}
      <section className="landing__demo-cta">
        <div className="landing__container">
          <div className="landing__demo-card">
            <div>
              <p className="landing__section-eyebrow">
                Live Product
              </p>

              <h2>See PartsPilot in action.</h2>

              <p>
                Explore the live demo or sign in to access the full
                dashboard experience.
              </p>
            </div>

            <div className="landing__demo-actions">
              <button
                type="button"
                onClick={openDemo}
                disabled={demoLoading}
                className="landing__button landing__button--primary"
              >
                {demoLoading ? "Opening demo..." : "View Live Demo"}
              </button>

              <Link
                to="/login"
                className="landing__button landing__button--secondary"
              >
                Log in
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section
        className="landing__about"
        id="about"
      >
        <div className="landing__container landing__about-grid">
          <div>
            <p className="landing__section-eyebrow">
              About PartsPilot
            </p>

            <h2>
              Your co-pilot for automotive inventory.
            </h2>
          </div>

          <p>
            PartsPilot is a full-stack automotive inventory management
            and analytics platform designed to combine everyday stock
            workflows with operational insight and business
            intelligence.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing__footer">
        <div className="landing__container landing__footer-grid">
          <div>
            <Link to="/" className="landing__brand">
              <span className="landing__brand-mark">⬡</span>
              <span>PartsPilot</span>
            </Link>

            <p>
              Your co-pilot for automotive inventory — stock levels,
              valuation and trends, always in view.
            </p>

            <small>
              © 2026 PartsPilot. Built by{" "}
              <a
                href="https://irisoak.dev"
                target="_blank"
                rel="noreferrer"
                className="landing__iris-link"
              >
                Iris & Oak
              </a>
              .
            </small>
          </div>

          <div>
            <strong>Product</strong>
            <a href="#features">Features</a>
            <a href="#demo">Demo</a>
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="landing__button landing__button--secondary"
            >
              Sign in
            </button>
          </div>

          <div>
            <strong>Resources</strong>
            <a
              href="https://inventory-management-system-1wcw.onrender.com/docs"
              target="_blank"
              rel="noreferrer"
            >
              API Docs
            </a>

            <a
              href="https://github.com/Iris408/partspilot"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>

            <Link to="/privacy">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </main>
  )
}