import { useEffect, useState } from "react"
import { useOutletContext } from "react-router-dom"

import { createSupplier, deleteSupplier, fetchSuppliers, updateSupplier } from "../services/suppliers"

import type { Supplier } from "../types/supplier"

type AppOutletContext = {
  isDemo: boolean
}

function Suppliers() {
  // =========================================
  // EN: Read demo mode from the app layout
  // JP: アプリレイアウトからデモモードを取得
  // =========================================

  const { isDemo } =
    useOutletContext<AppOutletContext>()

  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [categoryFilter, setCategoryFilter] = useState("All")

  const [showAddForm, setShowAddForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const [editingSupplier, setEditingSupplier] =
    useState<Supplier | null>(null)

  const [supplierToDelete, setSupplierToDelete] =
    useState<Supplier | null>(null)

  const [deleting, setDeleting] = useState(false)

  const [newSupplier, setNewSupplier] = useState({
    name: "",
    contact_name: "",
    email: "",
    phone: "",
    website: "",
    category: "",
    status: "Active",
    notes: "",
  })

  const activeSuppliers = suppliers.filter(
    (supplier) => supplier.status === "Active"
  ).length

  const inactiveSuppliers = suppliers.filter(
    (supplier) => supplier.status === "Inactive"
  ).length

  const supplierCategories = new Set(
    suppliers.map((supplier) => supplier.category)
  ).size

  const categories = Array.from(
    new Set(suppliers.map((supplier) => supplier.category))
  ).sort()

  const filteredSuppliers = suppliers.filter((supplier) => {
    const searchTerm = search.toLowerCase().trim()

    const matchesSearch =
      !searchTerm ||
      supplier.name.toLowerCase().includes(searchTerm) ||
      supplier.category.toLowerCase().includes(searchTerm) ||
      supplier.contact_name?.toLowerCase().includes(searchTerm) ||
      supplier.email?.toLowerCase().includes(searchTerm)

    const matchesStatus =
      statusFilter === "All" ||
      supplier.status === statusFilter

    const matchesCategory =
      categoryFilter === "All" ||
      supplier.category === categoryFilter

    return (
      matchesSearch &&
      matchesStatus &&
      matchesCategory
    )
  })

  useEffect(() => {
    async function loadSuppliers() {
      try {
        setLoading(true)
        setError(null)

        const data = await fetchSuppliers()

        setSuppliers(data)
      } catch (err) {
        console.error(err)
        setError("Unable to load suppliers.")
      } finally {
        setLoading(false)
      }
    }

    loadSuppliers()
  }, [])

  function resetSupplierForm() {
    setNewSupplier({
      name: "",
      contact_name: "",
      email: "",
      phone: "",
      website: "",
      category: "",
      status: "Active",
      notes: "",
    })

    setEditingSupplier(null)
  }

  function handleAddSupplierClick() {
    if (showAddForm) {
      setShowAddForm(false)
      resetSupplierForm()
      return
    }

    resetSupplierForm()
    setShowAddForm(true)
  }

  function handleEditSupplier(supplier: Supplier) {
    setEditingSupplier(supplier)
    setShowAddForm(true)

    setNewSupplier({
      name: supplier.name,
      contact_name: supplier.contact_name ?? "",
      email: supplier.email ?? "",
      phone: supplier.phone ?? "",
      website: supplier.website ?? "",
      category: supplier.category,
      status: supplier.status,
      notes: supplier.notes ?? "",
    })

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  async function handleSupplierSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    try {
      setSubmitting(true)
      setError(null)

      if (editingSupplier) {
        const updatedSupplier = await updateSupplier(
          editingSupplier.id,
          newSupplier
        )

        setSuppliers((currentSuppliers) =>
          currentSuppliers.map((supplier) =>
            supplier.id === updatedSupplier.id
              ? updatedSupplier
              : supplier
          )
        )
      } else {
        const createdSupplier = await createSupplier(newSupplier)

        setSuppliers((currentSuppliers) => [
          ...currentSuppliers,
          createdSupplier,
        ])
      }

      resetSupplierForm()
      setShowAddForm(false)
    } catch (err) {
      console.error(err)

      setError(
        editingSupplier
          ? "Unable to update supplier."
          : "Unable to add supplier."
      )
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDeleteSupplier() {
    if (!supplierToDelete) {
      return
    }

    try {
      setDeleting(true)
      setError(null)

      await deleteSupplier(supplierToDelete.id)

      setSuppliers((currentSuppliers) =>
        currentSuppliers.filter(
          (supplier) =>
            supplier.id !== supplierToDelete.id
        )
      )

      setSupplierToDelete(null)
    } catch (err) {
      console.error(err)
      setError("Unable to delete supplier.")
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-violet-600">
            Supply Network
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
            Suppliers
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Manage automotive suppliers, contact information and sourcing
            categories.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddSupplierClick}
          disabled={isDemo}
          title={
            isDemo
              ? "Disabled in public demo"
              : undefined
          }
          className={`rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700 ${
            isDemo
            ? "cursor-not-allowed opacity-50"
            : ""
          }`}
        >
          {showAddForm ? "Cancel" : "Add supplier"}
        </button>
      </header>

      {/* Add / Edit Supplier Form */}
      {showAddForm && (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">
              {editingSupplier
                ? "Edit supplier"
                : "Add supplier"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {editingSupplier
                ? "Update supplier information."
                : "Add a supplier to the PartsPilot supply network."}
            </p>
          </div>

          <form
            onSubmit={handleSupplierSubmit}
            className="mt-6 grid gap-4 sm:grid-cols-2"
          >
            <div>
              <label
                htmlFor="supplier-name"
                className="text-sm font-medium text-slate-700"
              >
                Supplier Name
              </label>

              <input
                id="supplier-name"
                required
                value={newSupplier.name}
                onChange={(event) =>
                  setNewSupplier({
                    ...newSupplier,
                    name: event.target.value,
                  })
                }
                className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
              />
            </div>

            <div>
              <label
                htmlFor="supplier-category-input"
                className="text-sm font-medium text-slate-700"
              >
                Category
              </label>

              <input
                id="supplier-category-input"
                required
                value={newSupplier.category}
                onChange={(event) =>
                  setNewSupplier({
                    ...newSupplier,
                    category: event.target.value,
                  })
                }
                className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
              />
            </div>

            <div>
              <label
                htmlFor="supplier-contact"
                className="text-sm font-medium text-slate-700"
              >
                Contact Name
              </label>

              <input
                id="supplier-contact"
                value={newSupplier.contact_name}
                onChange={(event) =>
                  setNewSupplier({
                    ...newSupplier,
                    contact_name: event.target.value,
                  })
                }
                className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
              />
            </div>

            <div>
              <label
                htmlFor="supplier-email-input"
                className="text-sm font-medium text-slate-700"
              >
                Email
              </label>

              <input
                id="supplier-email-input"
                type="email"
                value={newSupplier.email}
                onChange={(event) =>
                  setNewSupplier({
                    ...newSupplier,
                    email: event.target.value,
                  })
                }
                className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
              />
            </div>

            <div>
              <label
                htmlFor="supplier-phone-input"
                className="text-sm font-medium text-slate-700"
              >
                Phone
              </label>

              <input
                id="supplier-phone-input"
                value={newSupplier.phone}
                onChange={(event) =>
                  setNewSupplier({
                    ...newSupplier,
                    phone: event.target.value,
                  })
                }
                className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
              />
            </div>

            <div>
              <label
                htmlFor="supplier-status-input"
                className="text-sm font-medium text-slate-700"
              >
                Status
              </label>

              <select
                id="supplier-status-input"
                value={newSupplier.status}
                onChange={(event) =>
                  setNewSupplier({
                    ...newSupplier,
                    status: event.target.value,
                  })
                }
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
              >
                <option value="Active">
                  Active
                </option>

                <option value="Preferred">
                  Preferred
                </option>

                <option value="Inactive">
                  Inactive
                </option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="supplier-website-input"
                className="text-sm font-medium text-slate-700"
              >
                Website URL
              </label>

              <input
                id="supplier-website-input"
                value={newSupplier.website}
                onChange={(event) =>
                  setNewSupplier({
                    ...newSupplier,
                    website: event.target.value,
                  })
                }
                placeholder="https://..."
                className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
              />
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="supplier-notes"
                className="text-sm font-medium text-slate-700"
              >
                Notes
              </label>

              <textarea
                id="supplier-notes"
                rows={3}
                value={newSupplier.notes}
                onChange={(event) =>
                  setNewSupplier({
                    ...newSupplier,
                    notes: event.target.value,
                  })
                }
                className="mt-1.5 w-full resize-none rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
              />
            </div>

            <div className="flex justify-end sm:col-span-2">
              <button
                type="submit"
                disabled={submitting || isDemo}
                title={
                  isDemo
                    ? "Disabled in public demo"
                    : undefined
                }
                className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting
                  ? editingSupplier
                    ? "Saving..."
                    : "Adding..."
                  : editingSupplier
                    ? "Save changes"
                    : "Add supplier"}
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Supplier Summary */}
      <section
        aria-label="Supplier summary"
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Total Suppliers
          </p>

          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
            {suppliers.length}
          </p>

          <p className="mt-2 text-sm text-slate-500">
            Suppliers in the Demo Network
          </p>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Active Suppliers
          </p>

          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
            {activeSuppliers}
          </p>

          <p className="mt-2 text-sm text-slate-500">
            Currently Active Suppliers
          </p>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Categories Supplied
          </p>

          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
            {supplierCategories}
          </p>

          <p className="mt-2 text-sm text-slate-500">
            Automotive Sourcing Categories
          </p>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Inactive Suppliers
          </p>

          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
            {inactiveSuppliers}
          </p>

          <p className="mt-2 text-sm text-slate-500">
            Suppliers Currently Inactive
          </p>
        </article>
      </section>

      {/* Loading */}
      {loading && (
        <div
          role="status"
          className="rounded-2xl border border-slate-200 bg-white p-8 text-sm text-slate-500"
        >
          Loading suppliers...
        </div>
      )}

      {/* Error */}
      {error && (
        <div
          role="alert"
          className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700"
        >
          {error}
        </div>
      )}

      {/* Supplier Directory */}
      {!loading && !error && (
        <section
          aria-labelledby="supplier-list-heading"
          className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
        >
          <div className="border-b border-slate-200 px-5 py-4 sm:px-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2
                  id="supplier-list-heading"
                  className="font-semibold text-slate-950"
                >
                  Supplier Directory
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {filteredSuppliers.length} of{" "}
                  {suppliers.length} Suppliers
                </p>
              </div>

              <div className="grid w-full gap-3 text-sm sm:grid-cols-3 lg:max-w-3xl">
                {/* Search */}
                <div>
                  <label
                    htmlFor="supplier-search"
                    className="sr-only"
                  >
                    Search Suppliers
                  </label>

                  <input
                    id="supplier-search"
                    type="search"
                    value={search}
                    onChange={(event) =>
                      setSearch(event.target.value)
                    }
                    placeholder="Search suppliers..."
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                  />
                </div>

                {/* Status Filter */}
                <div>
                  <label
                    htmlFor="supplier-status"
                    className="sr-only"
                  >
                    Filter by status
                  </label>

                  <select
                    id="supplier-status"
                    value={statusFilter}
                    onChange={(event) =>
                      setStatusFilter(event.target.value)
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                  >
                    <option value="All">
                      All statuses
                    </option>

                    <option value="Active">
                      Active
                    </option>

                    <option value="Preferred">
                      Preferred
                    </option>

                    <option value="Inactive">
                      Inactive
                    </option>
                  </select>
                </div>

                {/* Category Filter */}
                <div>
                  <label
                    htmlFor="supplier-category"
                    className="sr-only"
                  >
                    Filter by category
                  </label>

                  <select
                    id="supplier-category"
                    value={categoryFilter}
                    onChange={(event) =>
                      setCategoryFilter(event.target.value)
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                  >
                    <option value="All">
                      All categories
                    </option>

                    {categories.map((category) => (
                      <option
                        key={category}
                        value={category}
                      >
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Column Headers */}
          <div className="hidden border-b border-slate-200 bg-slate-50/70 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 sm:px-6 lg:grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)_minmax(140px,0.6fr)_auto] lg:gap-4">
            <div>Supplier</div>
            <div>Contact</div>
            <div>Phone</div>
            <div>
              Actions
            </div>
          </div>

          {/* Supplier Rows */}
          <div className="divide-y divide-slate-200">
            {filteredSuppliers.map((supplier) => (
              <article
                key={supplier.id}
                className="grid gap-4 px-5 py-5 transition-colors hover:bg-slate-50/70 sm:px-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_minmax(140px,0.6fr)_auto]"
              >
                {/* Supplier */}
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-slate-950">
                      {supplier.name}
                    </h3>

                    <span
                      className={[
                        "rounded-full px-2.5 py-1 text-xs font-semibold",
                        supplier.status === "Preferred"
                          ? "bg-violet-50 text-violet-700"
                          : supplier.status === "Inactive"
                            ? "bg-slate-100 text-slate-600"
                            : "bg-emerald-50 text-emerald-700",
                      ].join(" ")}
                    >
                      {supplier.status}
                    </span>
                  </div>

                  <p className="mt-1 text-sm text-slate-500">
                    {supplier.category}
                  </p>
                </div>

                {/* Contact */}
                <div className="text-sm">
                  <p className="font-medium text-slate-700">
                    {supplier.contact_name ||
                      "No contact name"}
                  </p>

                  {supplier.email ? (
                    <a
                      href={`mailto:${supplier.email}`}
                      className="mt-1 block text-slate-500 transition hover:text-violet-600"
                    >
                      {supplier.email}
                    </a>
                  ) : (
                    <p className="mt-1 text-slate-500">
                      No email
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div className="text-sm text-slate-500 lg:text-left">
                  {supplier.phone ? (
                    <a
                      href={`tel:${supplier.phone}`}
                      className="transition hover:text-violet-600"
                    >
                      {supplier.phone}
                    </a>
                  ) : (
                    <p>No phone</p>
                  )}
                </div>

                {/* Actions */}
                <div className="lg:justify-end text-[14px]">
                  <button
                    type="button"
                    onClick={() =>
                      handleEditSupplier(supplier)
                    }
                    disabled={isDemo}
                    title={
                      isDemo
                        ? "Disabled in public demo"
                        : undefined
                    }
                    className={`px-3 py-1.5 font-semibold text-slate-700 transition hover:text-violet-700 ${
                      isDemo
                        ? "cursor-not-allowed opacity-50"
                        : ""
                    }`}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setSupplierToDelete(supplier)
                    }
                    disabled={isDemo}
                    title={
                      isDemo
                        ? "Disabled in public demo"
                        : undefined
                    }
                    className={`px-3 py-1.5 font-semibold text-slate-500 transition hover:text-red-600 ${
                      isDemo
                        ? "cursor-not-allowed opacity-50"
                        : ""
                    }`}
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}

            {/* Empty State */}
            {filteredSuppliers.length === 0 && (
              <div className="px-6 py-12 text-center">
                <p className="text-sm font-medium text-slate-700">
                  No suppliers found
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Try changing your search or filters.
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Delete Confirmation */}
      {supplierToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-supplier-title"
        >
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2
              id="delete-supplier-title"
              className="text-lg font-semibold text-slate-950"
            >
              Delete supplier?
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-slate-700">
                {supplierToDelete.name}?
              </span>
            </p>
            <p className="text-sm text-red-600/80">  
              This action cannot be undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                disabled={deleting}
                onClick={() =>
                  setSupplierToDelete(null)
                }
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDeleteSupplier}
                disabled={isDemo || deleting}
                title={
                  isDemo
                    ? "Disabled in public demo"
                    : undefined
                }
                className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deleting
                  ? "Deleting..."
                  : "Delete supplier"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Suppliers