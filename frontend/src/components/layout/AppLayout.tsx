import { Link, Outlet } from "react-router-dom"

import AccountMenu from "./AccountMenu"
import Sidebar from "./Sidebar"

type AppLayoutProps = {
  onLogout: () => void
  isDemo: boolean
}

function AppLayout({ onLogout, isDemo }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-[#f4f6fa] text-slate-900 lg:flex">
      {/* Keyboard users can bypass repeated navigation */}
      <a
        href="#main-content"
        className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white shadow-lg transition-transform focus:translate-y-0 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2"
      >
        Skip to main content
      </a>

      <Sidebar />

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8 xl:px-10">
            <Link
              to="/dashboard"
              aria-label="PartsPilot dashboard"
              className="flex items-center gap-2.5 text-slate-900 no-underline lg:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2"
            >
              <span
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#111827] text-violet-300"
                aria-hidden="true"
              >
                ⌬
              </span>

              <span className="font-bold">
                PartsPilot
              </span>
            </Link>

            <div className="hidden lg:block" />

            <AccountMenu onLogout={onLogout} />
          </div>
        </header>

        <main
          id="main-content"
          tabIndex={-1}
          aria-label="PartsPilot application content"
          className="min-w-0 px-4 pb-24 pt-5 sm:px-6 lg:px-8 lg:pb-8 lg:pt-7 xl:px-10"
        >
          {isDemo && (
            <div
              role="status"
              className="mx-auto mb-5 w-full max-w-[1600px] rounded-xl border border-violet-200 bg-violet-50 px-4 py-3 text-sm text-violet-950"
            >
              <span className="font-semibold">
                Demo mode
              </span>

              <span className="ml-1">
                — Inventory is read-only. You can explore
                the dashboard, reports, inventory and
                suppliers, but changes are disabled.
              </span>
            </div>
          )}

          <div className="mx-auto w-full max-w-[1600px]">
            <Outlet context={{ isDemo }}/>
          </div>
        </main>
      </div>
    </div>
  )
}

export default AppLayout