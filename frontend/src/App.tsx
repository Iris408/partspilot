import { useState } from "react"
import { Navigate, Route, Routes } from "react-router-dom"
import { TOKEN_STORAGE_KEY } from "./constants/auth"
import { getTokenRole } from "./services/auth"

import AppLayout from "./components/layout/AppLayout"

import Dashboard from "./pages/Dashboard"
import Inventory from "./pages/Inventory"
import Landing from "./pages/Landing"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Reports from "./pages/Reports"
import Settings from "./pages/Settings"
import Suppliers from "./pages/Suppliers"

function App() {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem(TOKEN_STORAGE_KEY)
  )

  const isDemo = token
    ? getTokenRole(token) === "demo"
    : false

  function logout() {
    localStorage.removeItem(TOKEN_STORAGE_KEY)
    setToken(null)
  }

  return (
    <Routes>
      {/* =========================================
      EN: Public routes
      JP: 公開ルート
      ========================================= */}

      <Route
        path="/"
        element={<Landing onLogin={setToken} />}
      />

      <Route
        path="/login"
        element={
          token ? (
            <Navigate
              to="/dashboard"
              replace
            />
          ) : (
            <Login onLogin={setToken} />
          )
        }
      />

      <Route
        path="/register"
        element={<Register />}
      />

      {/* =========================================
      EN: Authenticated application
      JP: 認証済みアプリケーション
      ========================================= */}

      <Route
        element={
          token ? (
            <AppLayout 
              onLogout={logout}
              isDemo={isDemo}
            />
          ) : (
            <Navigate
              to="/login"
              replace
            />
          )
        }
      >
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/inventory"
          element={<Inventory />}
        />

        <Route
          path="/suppliers"
          element={<Suppliers />}
        />

        <Route
          path="/reports"
          element={<Reports />}
        />

        <Route
          path="/settings"
          element={<Settings />}
        />
      </Route>

      {/* =========================================
      EN: Unknown routes return to public landing page
      JP: 不明なルートは公開トップページへ戻す
      ========================================= */}

      <Route
        path="*"
        element={
          <Navigate
            to="/"
            replace
          />
        }
      />
    </Routes>
  )
}

export default App