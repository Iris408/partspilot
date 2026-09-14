import { Link } from "react-router-dom"

type NotFoundProps = {
  isAuthenticated: boolean
}

export default function NotFound({
  isAuthenticated,
}: NotFoundProps) {
  return (
    <main className="not-found">
      <section className="not-found__card">
        <span className="not-found__code">404</span>

        <h1 className="not-found__title">
          Page not found
        </h1>

        <p className="not-found__text">
          The page you're looking for doesn't exist.
        </p>

        <Link
          to={isAuthenticated ? "/dashboard" : "/login"}
          className="not-found__button"
        >
          {isAuthenticated
            ? "Back to dashboard"
            : "Go to login"}
        </Link>
      </section>
    </main>
  )
}