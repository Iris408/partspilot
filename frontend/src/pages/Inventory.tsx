import {
  useCallback,
  useEffect,
  useState,
} from "react"

import { apiFetch } from "../services/api"
import type {
  Item,
  NewItem,
} from "../types/inventory"
import { useOutletContext } from "react-router-dom"

type AppOutletContext = {
  isDemo: boolean
}

function PartsInventory() {
  const { isDemo } =
    useOutletContext<AppOutletContext>()
  const [items, setItems] = useState<Item[]>([])
  const [totalItems, setTotalItems] = useState(0)

  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("")
  const [categories, setCategories] = useState<string[]>([])
  const [sortBy, setSortBy] = useState("id")
  const [order, setOrder] = useState("ascending")

  const [isDeleting, setIsDeleting] = useState(false)

  const [showForm, setShowForm] = useState(false)
  const [editItem, setEditItem] =
    useState<Item | null>(null)

  const [error, setError] =
    useState<string | null>(null)

  const [deleteTarget, setDeleteTarget] =
    useState<Item | null>(null)  

  const [loading, setLoading] = useState(true)

  const [page, setPage] = useState(1)

  const [form, setForm] = useState<NewItem>({
    name: "",
    sku: "",
    category: "",
    quantity: 0,
    min_threshold: 0,
    price: 0,
  })

  const itemsPerPage = 10

  async function fetchTotalItems() {
    try {
      const response = await apiFetch("/items/stats")

      if (!response.ok) {
        throw new Error("Unable to load inventory total")
      }

      const data = await response.json()

      setTotalItems(data.total_products)
    } catch (error) {
      console.error(error)
    }
  }

  const fetchItems = useCallback(async () => {
    try {
      setError(null)
      setLoading(true)

      const params = new URLSearchParams()

      params.append(
        "limit",
        String(itemsPerPage)
      )

      params.append(
        "offset",
        String((page - 1) * itemsPerPage)
      )

      if (search) {
        params.append("search", search)
      }

      if (category) {
        params.append("category", category)
      }

      params.append("sort_by", sortBy)
      params.append("order", order)

      const response = await apiFetch(
        `/items?${params.toString()}`
      )

      if (!response.ok) {
        throw new Error(
          "Failed to fetch inventory"
        )
      }

      const data: Item[] =
        await response.json()

      setItems(data)
    } catch {
      setError("Could not load inventory.")
    } finally {
      setLoading(false)
    }
  }, [page, search, category, sortBy, order])

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  useEffect(() => {
    fetchTotalItems()
  }, [])

  const totalPages = Math.max(
    1,
    Math.ceil(totalItems / itemsPerPage)
  )

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await apiFetch(
          "/items/category-summary"
        )

        if (!response.ok) {
          return
        }

        const data: Record<string, number> =
          await response.json()

        setCategories(
          Object.keys(data).sort()
        )
      } catch {
        // Inventory can still work without
        // category filter options.
      }
    }

    fetchCategories()
  }, [])

  useEffect(() => {
    setPage(1)
  }, [search, category, sortBy, order])

  useEffect(() => {
    if (!deleteTarget) {
      return
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setDeleteTarget(null)
      }
    }

    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [deleteTarget])

  async function addItem() {
    try {
      setError(null)

      const response = await apiFetch(
        "/items",
        {
          method: "POST",
          body: JSON.stringify({
            name: form.name,
            sku: form.sku,
            category: form.category,
            quantity: Number(form.quantity),
            min_threshold: Number(
              form.min_threshold
            ),
            price: Number(form.price),
          }),
        }
      )

      if (!response.ok) {
        if (response.status === 409) {
          throw new Error("duplicate-sku")
        }

        throw new Error("add-failed")
      }

      setForm({
        name: "",
        sku: "",
        category: "",
        quantity: 0,
        min_threshold: 0,
        price: 0,
      })

      setShowForm(false)

      await fetchItems()
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === "duplicate-sku"
      ) {
        setError(
          "An inventory item with this SKU already exists."
        )
      } else {
        setError("Could not add item.")
      }
    }
  }

  async function updateItem() {
    if (!editItem) {
      return
    }

    try {
      setError(null)

      const response = await apiFetch(
        `/items/${editItem.id}`,
        {
          method: "PUT",
          body: JSON.stringify({
            name: editItem.name,
            sku: editItem.sku,
            category: editItem.category,
            quantity: Number(
              editItem.quantity
            ),
            min_threshold: Number(
              editItem.min_threshold
            ),
            price: Number(editItem.price),
          }),
        }
      )

      if (!response.ok) {
        if (response.status === 409) {
          throw new Error("duplicate-sku")
        }

        throw new Error("update-failed")
      }

      setEditItem(null)

      await fetchItems()
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === "duplicate-sku"
      ) {
        setError(
          "Another inventory item already uses this SKU."
        )
      } else {
        setError("Could not update item.")
      }
    }
  }

  async function deleteItem(id: number) {
    try {
      setError(null)

      const response = await apiFetch(
        `/items/${id}`,
        {
          method: "DELETE",
        }
      )

      if (!response.ok) {
        throw new Error(
          "Failed to delete item"
        )
      }

      await fetchItems()
    } catch {
      setError("Could not delete item.")
    }
  }

  async function confirmDelete() {
    if (!deleteTarget || isDeleting) {
      return
    }

    setIsDeleting(true)

    try {
      await deleteItem(deleteTarget.id)

      setDeleteTarget(null)

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  function getStatusStyle(status: string) {
    if (status === "In Stock") {
      return "bg-emerald-50 text-emerald-700"
    }

    if (status === "Low Stock") {
      return "bg-orange-50 text-orange-700"
    }

    return "bg-red-50 text-red-700"
  }

  function handleEdit(item: Item) {
  setEditItem(item)

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  })
}

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-600">
            Inventory
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Inventory Management
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            Track and manage vehicle parts,
            stock levels, thresholds and
            pricing.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            setShowForm((current) => !current)
          }
          aria-expanded={showForm}
          disabled={isDemo}
          title={
            isDemo
              ? "Disable in public demo"
              : undefined
          }
          className={`rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-violet-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 ${
            isDemo
              ? "cursor-not-allowed opacity-50"
              : ""
          }`}
        >
          {showForm
            ? "Cancel"
            : "+ Add inventory item"}
        </button>
      </header>

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {/* Add form */}
      {showForm && (
        <section
          aria-labelledby="new-item-heading"
          className="rounded-2xl border border-slate-200 bg-white p-6"
        >
          <h2
            id="new-item-heading"
            className="text-lg font-semibold text-slate-900"
          >
            New inventory item
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Add a part and define its minimum
            stock threshold.
          </p>

          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label
                htmlFor="new-name"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Part name
              </label>

              <input
                id="new-name"
                value={form.name}
                onChange={(event) =>
                  setForm({
                    ...form,
                    name: event.target.value,
                  })
                }
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
              />
            </div>

            <div>
              <label
                htmlFor="new-sku"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                SKU
              </label>

              <input
                id="new-sku"
                value={form.sku}
                onChange={(event) =>
                  setForm({
                    ...form,
                    sku: event.target.value,
                  })
                }
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
              />
            </div>

            <div>
              <label
                htmlFor="new-category"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Category
              </label>

              <input
                id="new-category"
                value={form.category}
                onChange={(event) =>
                  setForm({
                    ...form,
                    category:
                      event.target.value,
                  })
                }
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
              />
            </div>

            <div>
              <label
                htmlFor="new-quantity"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Quantity
              </label>

              <input
                id="new-quantity"
                type="number"
                min="0"
                value={form.quantity}
                onChange={(event) =>
                  setForm({
                    ...form,
                    quantity: Number(
                      event.target.value
                    ),
                  })
                }
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
              />
            </div>

            <div>
              <label
                htmlFor="new-threshold"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Minimum stock threshold
              </label>

              <input
                id="new-threshold"
                type="number"
                min="0"
                value={form.min_threshold}
                onChange={(event) =>
                  setForm({
                    ...form,
                    min_threshold: Number(
                      event.target.value
                    ),
                  })
                }
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
              />
            </div>

            <div>
              <label
                htmlFor="new-price"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Unit price (£)
              </label>

              <input
                id="new-price"
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(event) =>
                  setForm({
                    ...form,
                    price: Number(
                      event.target.value
                    ),
                  })
                }
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={addItem}
            disabled={isDemo}
            title={
              isDemo
                ? "Disabled in public demo"
                : undefined
            }
            className={`mt-5 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 ${
              isDemo
                ? "cursor-not-allowed opacity-50"
                : ""
            }`}
          >
            Save item
          </button>
        </section>
      )}

      {/* Edit form */}
      {editItem && (
        <section
          aria-labelledby="edit-item-heading"
          className="rounded-2xl border border-violet-200 bg-white p-6"
        >
          <h2
            id="edit-item-heading"
            className="text-lg font-semibold text-slate-900"
          >
            Edit {editItem.name}
          </h2>

          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="text-sm font-medium text-slate-700">
              Part name
              <input
                className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm"
                value={editItem.name}
                onChange={(event) =>
                  setEditItem({
                    ...editItem,
                    name: event.target.value,
                  })
                }
              />
            </label>

            <label className="text-sm font-medium text-slate-700">
              SKU
              <input
                className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm"
                value={editItem.sku}
                onChange={(event) =>
                  setEditItem({
                    ...editItem,
                    sku: event.target.value,
                  })
                }
              />
            </label>

            <label className="text-sm font-medium text-slate-700">
              Category
              <input
                className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm"
                value={editItem.category}
                onChange={(event) =>
                  setEditItem({
                    ...editItem,
                    category:
                      event.target.value,
                  })
                }
              />
            </label>

            <label className="text-sm font-medium text-slate-700">
              Quantity
              <input
                type="number"
                min="0"
                className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm"
                value={editItem.quantity}
                onChange={(event) =>
                  setEditItem({
                    ...editItem,
                    quantity: Number(
                      event.target.value
                    ),
                  })
                }
              />
            </label>

            <label className="text-sm font-medium text-slate-700">
              Minimum threshold
              <input
                type="number"
                min="0"
                className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm"
                value={editItem.min_threshold}
                onChange={(event) =>
                  setEditItem({
                    ...editItem,
                    min_threshold: Number(
                      event.target.value
                    ),
                  })
                }
              />
            </label>

            <label className="text-sm font-medium text-slate-700">
              Unit price (£)
              <input
                type="number"
                min="0"
                step="0.01"
                className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm"
                value={editItem.price}
                onChange={(event) =>
                  setEditItem({
                    ...editItem,
                    price: Number(
                      event.target.value
                    ),
                  })
                }
              />
            </label>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={updateItem}
              disabled={isDemo}
              title={isDemo ? "Disabled in public demo" : undefined}
              className={`rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white hover:bg-violet-700 ${
                isDemo
                  ? "cursor-not-allowed opacity-50"
                  : ""
              }`}
            >
              Save changes
            </button>

            <button
              type="button"
              onClick={() =>
                setEditItem(null)
              }
              className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
        </section>
      )}

      {/* Filters */}
      <section
        aria-label="Inventory filters"
        className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label
              htmlFor="inventory-search"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Search inventory
            </label>

            <input
              id="inventory-search"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm"
              placeholder="Part Name or SKU"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />
          </div>

          <div>
            <label
              htmlFor="category-filter"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Category
            </label>

            <select
              id="category-filter"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm"
              value={category}
              onChange={(event) =>
                setCategory(
                  event.target.value
                )
              }
            >
              <option value="">
                All categories
              </option>

              {categories.map(
                (categoryName) => (
                  <option
                    key={categoryName}
                    value={categoryName}
                  >
                    {categoryName}
                  </option>
                )
              )}
            </select>
          </div>

          <div>
            <label
              htmlFor="inventory-sort"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Sort by
            </label>

            <select
              id="inventory-sort"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm"
              value={sortBy}
              onChange={(event) =>
                setSortBy(
                  event.target.value
                )
              }
            >
              <option value="id">
                Item ID
              </option>

              <option value="price">
                Price
              </option>

              <option value="quantity">
                Quantity
              </option>
            </select>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() =>
              setOrder(
                order === "ascending"
                  ? "descending"
                  : "ascending"
              )
            }
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            {order === "ascending"
              ? "Ascending ↑"
              : "Descending ↓"}
          </button>

          {(search || category) && (
            <button
              type="button"
              onClick={() => {
                setSearch("")
                setCategory("")
              }}
              className="text-sm font-semibold text-violet-600 hover:text-violet-700"
            >
              Clear filters
            </button>
          )}
        </div>
      </section>

      {/* Inventory table */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-6 py-5">
          <h2 className="font-bold text-slate-900">
            Inventory
          </h2>

          <p
            className="mt-1 text-sm text-slate-500"
            aria-live="polite"
          >
            {loading
              ? "Loading inventory…"
              : `Showing ${items.length} of ${totalItems} items`}
          </p>
        </div>

        {/* MOBILE VERSION */}
        <div className="divide-y divide-slate-100 md:hidden">
          {loading ? (
            <div
              className="px-5 py-10 text-center text-sm text-slate-500"
              role="status"
            >
              Loading inventory…
            </div>
          ) : items.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <p className="font-semibold text-slate-700">
                No parts found
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Try adjusting your filters or add a new inventory item.
              </p>
            </div>
          ) : (
            items.map((item) => (
              <article
                key={item.id}
                className="p-5"
                aria-labelledby={`mobile-item-${item.id}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h3
                      id={`mobile-item-${item.id}`}
                      className="truncate font-semibold text-slate-900"
                    >
                      {item.name}
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                      {item.sku}
                    </p>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusStyle(
                      item.stock_status
                    )}`}
                  >
                    {item.stock_status}
                  </span>
                </div>

                <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-4">
                  <div>
                    <dt className="text-xs font-medium text-slate-500">
                      Category
                    </dt>

                    <dd className="mt-1 text-sm font-medium text-slate-800">
                      {item.category}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-xs font-medium text-slate-500">
                      Unit price
                    </dt>

                    <dd className="mt-1 text-sm font-medium text-slate-800">
                      £{item.price.toFixed(2)}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-xs font-medium text-slate-500">
                      Quantity
                    </dt>

                    <dd className="mt-1 text-sm font-medium text-slate-800">
                      {item.quantity}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-xs font-medium text-slate-500">
                      Minimum stock
                    </dt>

                    <dd className="mt-1 text-sm font-medium text-slate-800">
                      {item.min_threshold}
                    </dd>
                  </div>
                </dl>

                <div className="mt-5 flex gap-2 border-t border-slate-100 pt-4">
                  <button
                    type="button"
                    onClick={() => handleEdit(item)}
                    disabled={isDemo}
                    title={
                      isDemo
                        ? "Disabled in public demo"
                        : undefined
                    }
                    className={`flex-1 rounded-xl border border-slate-300 px-3 py-2.5 text-sm font-semibold text-slate-700 ${
                      isDemo
                        ? "cursor-not-allowed opacity-50"
                        : ""
                    }`}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeleteTarget(item)}
                    disabled={isDemo}
                    title={
                      isDemo
                        ? "Disabled in public demo"
                        : undefined
                    }
                    className={`flex-1 rounded-xl border border-red-200 px-3 py-2.5 text-sm font-semibold text-red-600 ${
                      isDemo
                        ? "cursor-not-allowed opacity-50"
                        : ""
                    }`}
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))
          )}
        </div>

        {/* DESKTOP/TABLET VERSION */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">
              PartsPilot inventory showing part
              identifiers, stock quantities,
              prices and stock status.
            </caption>

            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-4"
                >
                  SKU
                </th>

                <th
                  scope="col"
                  className="px-6 py-4"
                >
                  Part
                </th>

                <th
                  scope="col"
                  className="px-6 py-4"
                >
                  Category
                </th>

                <th
                  scope="col"
                  className="px-6 py-4"
                >
                  Quantity
                </th>

                <th
                  scope="col"
                  className="px-6 py-4"
                >
                  Minimum
                </th>

                <th
                  scope="col"
                  className="px-6 py-4"
                >
                  Unit price
                </th>

                <th
                  scope="col"
                  className="px-6 py-4"
                >
                  Status
                </th>

                <th
                  scope="col"
                  className="px-6 py-4"
                >
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {!loading &&
              items.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-12 text-center"
                  >
                    <p className="font-semibold text-slate-600">
                      No parts found
                    </p>

                    <p className="mt-1 text-sm text-slate-400">
                      Try adjusting your
                      filters or add a new
                      inventory item.
                    </p>
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr
                    key={item.id}
                    className="transition hover:bg-slate-50"
                  >
                    <td className="px-6 py-4">
                      <p className="mt-0.5 text-xs text-slate-400">
                        {item.sku}
                      </p>
                    </td>

                    <th
                      scope="row"
                      className="px-6 py-4 font-semibold text-slate-800"
                    >
                      {item.name}
                    </th>

                    <td className="px-6 py-4 text-slate-600">
                      {item.category}
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {item.quantity}
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {item.min_threshold}
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      £
                      {item.price.toFixed(
                        2
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                          item.stock_status
                        )}`}
                      >
                        {item.stock_status}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(item)}
                          disabled={isDemo}
                          title={
                            isDemo
                              ? "Disabled in public demo"
                              : undefined
                          }
                          className={`flex-1 rounded-xl border border-slate-300 px-3 py-2.5 text-sm font-semibold text-slate-700 ${
                            isDemo
                              ? "cursor-not-allowed opacity-50"
                              : ""
                          }`}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => setDeleteTarget(item)}
                          disabled={isDemo}
                          title={
                            isDemo
                              ? "Disabled in public demo"
                              : undefined
                          }
                          className={`flex-1 rounded-xl border border-red-200 px-3 py-2.5 text-sm font-semibold text-red-600 ${
                            isDemo
                              ? "cursor-not-allowed opacity-50"
                              : ""
                          }`}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p
            className="text-sm text-slate-500"
            aria-live="polite"
          >
            Page {page} / {totalPages}
          </p>

          <div className="flex gap-2">
            <button
              type="button"
              disabled={page === 1}
              onClick={() =>
                setPage((current) =>
                  Math.max(1, current - 1)
                )
              }
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>

            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() =>
                setPage((current) => current + 1)
              }
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </section>

      {deleteTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setDeleteTarget(null)
            }
          }}
        >
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-title"
            aria-describedby="delete-description"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-50 text-red-600">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <path d="M3 6h18" />
                <path d="M8 6V4h8v2" />
                <path d="M19 6l-1 14H6L5 6" />
                <path d="M10 11v5M14 11v5" />
              </svg>
            </div>

            <h2
              id="delete-title"
              className="mt-5 text-xl font-bold text-slate-950"
            >
              Delete {deleteTarget.name}?
            </h2>

            <p
              id="delete-description"
              className="mt-2 text-sm leading-6 text-slate-500"
            >
              This will permanently remove the item from
              your inventory. This action cannot be undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                autoFocus
                onClick={() => setDeleteTarget(null)}
                className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isDeleting}
                onClick={confirmDelete}
                className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
              >
                {isDeleting ? "Deleting..." : "Delete item"}
              </button>
            </div>
          </div>
        </div>
      )} 
    </div>
  )
}

export default PartsInventory