import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { TOKEN_STORAGE_KEY } from "../constants/auth"

import LoginFooter from "../components/LoginFooter"
import { authenticate } from "../services/auth"

type LoginForm = {
  username: string
  password: string
}

type LoginProps = {
  onLogin: (token: string) => void
}

type PreviewMetricProps = {
  label: string
  value: string
  detail: string
  delay?: number
}

function PreviewMetric({
  label,
  value,
  detail,
  delay = 0,
}: PreviewMetricProps) {
  return (
    <div
      className="animate-fade-up rounded-2xl border border-slate-200 bg-slate-50 p-4"
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

      <p className="mt-1 text-xs text-slate-500">
        {detail}
      </p>
    </div>
  )
}

type ActivityItemProps = {
  name: string
  detail: string
  status: string
}

function ActivityItem({
  name,
  detail,
  status,
}: ActivityItemProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-slate-800">
          {name}
        </p>

        <p className="text-xs text-slate-500">
          {detail}
        </p>
      </div>

      <span className="text-xs font-semibold text-blue-600">
        {status}
      </span>
    </div>
  )
}

function Login({ onLogin }: LoginProps) {
  const navigate = useNavigate()

  const [loginForm, setLoginForm] = useState<LoginForm>({
    username: "",
    password: "",
  })

  const [loginError, setLoginError] =
    useState<string | null>(null)

  const [isLoading, setIsLoading] =
    useState(false)

  async function login() {
    try {
      setLoginError(null)
      setIsLoading(true)

      const accessToken = await authenticate(
        loginForm.username,
        loginForm.password
      )

      localStorage.setItem(
        TOKEN_STORAGE_KEY,
        accessToken
      )

      onLogin(accessToken)

      setLoginForm({
        username: "",
        password: "",
      })

      navigate("/dashboard")
    } catch {
      setLoginError(
        "Login failed. Check your username and password and try again."
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f4f6fa] lg:grid lg:h-screen lg:grid-rows-[1fr_auto] lg:overflow-hidden">
      <div className="min-h-0 md:grid md:grid-cols-1 lg:grid-cols-[minmax(0,40%)_minmax(0,60%)]">

        {/* =========================================
        EN: Left login panel
        JP: 左側ログインパネル
        ========================================= */}
        <section className="flex min-h-screen min-w-0 flex-col bg-gradient-to-b from-[#3B3F4A] to-[#74625D] px-5 py-6 sm:px-8 md:min-h-0 md:py-10 lg:h-full lg:px-10 lg:py-5">
          <div className="flex flex-1 items-start justify-center pt-3 lg:pt-5">
            <div className="animate-fade-up w-full max-w-md">

              {/* Brand */}
              <div className="mb-7 text-center">
                <div
                  className="rotate-[-15deg] text-6xl text-white"
                  aria-hidden="true"
                >
                  ⌬
                </div>

                <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-100">
                  PartsPilot
                </h1>

                <p className="mx-auto mt-2 max-w-sm text-sm font-semibold leading-6 text-slate-200">
                  Your co-pilot for automotive inventory —
                  stock levels, valuation, and trends,
                  always in view.
                </p>
              </div>

              {/* Login error */}
              {loginError && (
                <div
                  role="alert"
                  className="mb-4 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                  {loginError}
                </div>
              )}

              {/* Login form */}
              <form
                className="space-y-4"
                onSubmit={(event) => {
                  event.preventDefault()
                  login()
                }}
              >
                <div>
                  <label
                    htmlFor="username"
                    className="mb-1 block text-sm font-medium text-slate-100"
                  >
                    Username
                  </label>

                  <input
                    id="username"
                    name="username"
                    autoComplete="username"
                    required
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
                    placeholder="Enter your username"
                    value={loginForm.username}
                    onChange={(event) =>
                      setLoginForm({
                        ...loginForm,
                        username:
                          event.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <div className="mb-1 flex items-center justify-between gap-4">
                    <label
                      htmlFor="password"
                      className="text-sm font-medium text-slate-100"
                    >
                      Password
                    </label>

                    <Link
                      to="/forgot-password"
                      className="text-xs font-semibold text-slate-200 transition hover:text-white"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <input
                    id="password"
                    name="password"
                    autoComplete="current-password"
                    required
                    type="password"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
                    placeholder="Enter your password"
                    value={loginForm.password}
                    onChange={(event) =>
                      setLoginForm({
                        ...loginForm,
                        password:
                          event.target.value,
                      })
                    }
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-xl bg-blue-600 px-4 py-2.5 font-semibold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-[#74625D] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                >
                  {isLoading
                    ? "Signing in..."
                    : "Sign in"}
                </button>
              </form>

              {/* Create account */}
              <div className="mt-6 border-t border-white/20 pt-5 text-center">
                <p className="text-sm text-slate-200">
                  New to PartsPilot?{" "}
                  <Link
                    to="/register"
                    className="font-semibold text-white underline underline-offset-4 transition hover:text-blue-200"
                  >
                    Create account
                  </Link>
                </p>
              </div>

              {/* Back to public site */}
              <div className="mt-4 text-center">
                <Link
                  to="/"
                  className="text-sm font-medium text-slate-300 transition hover:text-white"
                >
                  ← Back to PartsPilot
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================
        EN: Right dashboard preview
        JP: 右側ダッシュボードプレビュー
        ========================================= */}
        <section className="relative hidden min-w-0 overflow-hidden bg-[#eaf0f7] px-5 py-8 md:flex md:flex-col md:px-8 lg:h-full lg:px-8 lg:py-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(37,99,235,0.16),_transparent_42%)]" />

          <div className="relative flex flex-1 items-center justify-center overflow-hidden">
            <div className="animate-fade-left min-w-0 w-full max-w-4xl">

              {/* Intro */}
              <div className="mb-4 max-w-2xl">
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-600">
                  Inventory intelligence
                </p>

                <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 xl:text-4xl">
                  See what is in stock, what is moving,
                  and what needs attention.
                </h2>

                <p className="mt-3 text-sm leading-6 text-slate-600 xl:text-base">
                  PartsPilot brings inventory operations,
                  stock alerts and business analytics
                  into one clear dashboard.
                </p>
              </div>

              {/* Dashboard preview */}
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl shadow-slate-300/50">

                {/* Dashboard heading */}
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                      Dashboard overview
                    </p>

                    <h3 className="mt-1 text-xl font-semibold text-slate-900">
                      PartsPilot Analytics
                    </h3>
                  </div>

                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                    Live
                  </span>
                </div>

                {/* KPI cards */}
                <div className="grid grid-cols-2 gap-3">
                  <PreviewMetric
                    label="Inventory value"
                    value="£128,450"
                    detail="+8.4% this month"
                    delay={0}
                  />

                  <PreviewMetric
                    label="Low-stock items"
                    value="14"
                    detail="Needs attention"
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
                    delay={210}
                  />
                </div>

                {/* Analytics row */}
                <div className="mt-3 grid gap-3 xl:grid-cols-[1.55fr_0.9fr]">

                  {/* Combined chart */}
                  <div className="rounded-2xl border border-slate-200 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          Inventory value &amp; stock trend
                        </p>

                        <p className="text-xs text-slate-500">
                          Six-month overview
                        </p>
                      </div>

                      <div className="flex gap-3 text-[10px] text-slate-500">
                        <span className="flex items-center gap-1">
                          <span className="h-2 w-2 rounded-sm bg-blue-500" />
                          Value
                        </span>

                        <span className="flex items-center gap-1">
                          <span className="h-0.5 w-3 bg-slate-700" />
                          Stock
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 flex">

                      {/* Y axis */}
                      <div className="flex h-32 w-10 flex-col justify-between pb-5 text-[9px] text-slate-400">
                        <span>£150k</span>
                        <span>£100k</span>
                        <span>£50k</span>
                        <span>£0</span>
                      </div>

                      <div className="relative h-32 flex-1">

                        {/* Grid */}
                        <div className="absolute inset-x-0 top-0 border-t border-slate-200" />
                        <div className="absolute inset-x-0 top-1/3 border-t border-slate-100" />
                        <div className="absolute inset-x-0 top-2/3 border-t border-slate-100" />
                        <div className="absolute inset-x-0 bottom-5 border-t border-slate-200" />

                        {/* Bars */}
                        <div className="absolute inset-x-0 bottom-5 top-0 flex items-end gap-3 px-2">
                          {[
                            44,
                            56,
                            51,
                            69,
                            77,
                            88,
                          ].map(
                            (
                              height,
                              index
                            ) => (
                              <div
                                key={
                                  index
                                }
                                className="flex-1 origin-bottom rounded-t bg-blue-500/80 transition-all duration-500"
                                style={{
                                  height: `${height}%`,
                                }}
                              />
                            )
                          )}
                        </div>

                        {/* Trend line */}
                        <svg
                          viewBox="0 0 600 100"
                          preserveAspectRatio="none"
                          className="pointer-events-none absolute inset-x-2 top-1 h-[85px] w-[calc(100%-1rem)]"
                          aria-hidden="true"
                        >
                          <polyline
                            points="10,72 125,62 240,67 355,43 470,35 590,19"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            vectorEffect="non-scaling-stroke"
                            className="text-slate-700"
                          />

                          {[
                            [10, 72],
                            [125, 62],
                            [240, 67],
                            [355, 43],
                            [470, 35],
                            [590, 19],
                          ].map(
                            (
                              [cx, cy],
                              index
                            ) => (
                              <circle
                                key={
                                  index
                                }
                                cx={cx}
                                cy={cy}
                                r="4"
                                className="fill-white stroke-slate-700"
                                strokeWidth="2"
                              />
                            )
                          )}
                        </svg>

                        {/* X axis */}
                        <div className="absolute inset-x-0 bottom-0 grid grid-cols-6 px-2 text-center text-[9px] text-slate-400">
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

                  {/* Recent activity */}
                  <div className="rounded-2xl border border-slate-200 p-4">
                    <p className="text-sm font-semibold text-slate-900">
                      Recent stock activity
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Latest inventory changes
                    </p>

                    <div className="mt-4 space-y-4">
                      <ActivityItem
                        name="Brake pads"
                        detail="24 units received"
                        status="+24"
                      />

                      <ActivityItem
                        name="Oil filters"
                        detail="8 units dispatched"
                        status="-8"
                      />

                      <ActivityItem
                        name="Alternators"
                        detail="Low-stock threshold"
                        status="Alert"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <LoginFooter />
    </div>
  )
}

export default Login