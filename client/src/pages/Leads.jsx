import { useEffect, useState } from "react";
import axios from "../services/api";
import toast from "react-hot-toast";
import Loader from "../components/Loader";

const inputClass =
  "w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200";
const selectClass =
  "w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200";
const labelClass = "text-xs font-medium text-gray-600";

const statusPill = (status) => {
  const base =
    "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset";
  switch (status) {
    case "new":
      return `${base} bg-sky-50 text-sky-700 ring-sky-200`;
    case "contacted":
      return `${base} bg-amber-50 text-amber-700 ring-amber-200`;
    case "qualified":
      return `${base} bg-emerald-50 text-emerald-700 ring-emerald-200`;
    case "lost":
      return `${base} bg-rose-50 text-rose-700 ring-rose-200`;
    default:
      return `${base} bg-gray-50 text-gray-700 ring-gray-200`;
  }
};

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    status: "new",
    source: "",
    notes: "",
  });

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchInput), 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `/leads?search=${encodeURIComponent(debouncedSearch)}&status=${encodeURIComponent(
          status
        )}&sort=latest`
      );
      setLeads(res.data.leads);
    } catch {
      toast.error("Failed to fetch leads");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [debouncedSearch, status]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await axios.put(`/leads/${editingId}`, form);
        toast.success("Lead updated");
      } else {
        await axios.post("/leads", form);
        toast.success("Lead created");
      }

      setForm({
        name: "",
        email: "",
        phone: "",
        company: "",
        status: "new",
        source: "",
        notes: "",
      });

      setEditingId(null);
      fetchLeads();
    } catch {
      toast.error("Action failed");
    }
  };

  const handleEdit = (lead) => {
    setForm({
      name: lead?.name ?? "",
      email: lead?.email ?? "",
      phone: lead?.phone ?? "",
      company: lead?.company ?? "",
      status: lead?.status ?? "new",
      source: lead?.source ?? "",
      notes: lead?.notes ?? "",
    });
    setEditingId(lead._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/leads/${id}`);
      toast.success("Deleted");
      fetchLeads();
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm({
      name: "",
      email: "",
      phone: "",
      company: "",
      status: "new",
      source: "",
      notes: "",
    });
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-lg font-semibold text-gray-900">Leads</h1>
        <p className="text-sm text-gray-500">Search, add, and manage leads.</p>
      </div>
      <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="grid w-full grid-cols-1 gap-3 md:max-w-2xl md:grid-cols-2">
            <div>
              <div className={labelClass}>Search</div>
              <input
                placeholder="Name, email, company..."
                className={inputClass}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>

            <div>
              <div className={labelClass}>Status</div>
              <select
                className={selectClass}
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="">All</option>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="lost">Lost</option>
              </select>
            </div>
          </div>

          <div className="text-sm text-gray-600">
            Total: <span className="font-semibold text-gray-900">{leads.length}</span>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm"
      >
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-sm font-semibold text-gray-900">
              {editingId ? "Edit Lead" : "Add Lead"}
            </div>
            <div className="text-xs text-gray-500">
              Fill the details below and submit.
            </div>
          </div>

          {editingId && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <div className={labelClass}>Name</div>
            <input
              className={inputClass}
              placeholder="Full name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div>
            <div className={labelClass}>Email</div>
            <input
              className={inputClass}
              placeholder="email@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div>
            <div className={labelClass}>Phone</div>
            <input
              className={inputClass}
              placeholder="Phone number"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>

          <div>
            <div className={labelClass}>Company</div>
            <input
              className={inputClass}
              placeholder="Company"
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
            />
          </div>

          <div>
            <div className={labelClass}>Status</div>
            <select
              className={selectClass}
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="lost">Lost</option>
            </select>
          </div>

          <div>
            <div className={labelClass}>Source</div>
            <input
              className={inputClass}
              placeholder="LinkedIn, Referral, Website..."
              value={form.source}
              onChange={(e) => setForm({ ...form, source: e.target.value })}
            />
          </div>

          <div className="md:col-span-2">
            <div className={labelClass}>Notes</div>
            <textarea
              className={`${inputClass} min-h-22 resize-y`}
              placeholder="Additional notes..."
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </div>

          <div className="md:col-span-2">
            <button
              className="w-full rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
              type="submit"
            >
              {editingId ? "Update Lead" : "Add Lead"}
            </button>
          </div>
        </div>
      </form>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="px-4 py-3 border-b border-gray-200">
          <div className="text-sm font-semibold text-gray-900">Lead List</div>
          <div className="text-xs text-gray-500">Click edit to update a lead.</div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-50">
              <tr className="text-xs font-semibold tracking-wider text-left text-gray-600 uppercase">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Company</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {leads.length === 0 ? (
                <tr>
                  <td className="px-4 py-6 text-sm text-gray-500" colSpan={6}>
                    No leads found.
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {lead.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {lead.company || "-"}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className={statusPill(lead.status)}>{lead.status}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {lead.email || "-"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {lead.phone || "-"}
                    </td>
                    <td className="px-4 py-3 text-sm text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(lead)}
                          className="rounded-md px-2.5 py-1.5 font-medium text-blue-700 hover:bg-blue-50"
                          type="button"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(lead._id)}
                          className="rounded-md px-2.5 py-1.5 font-medium text-rose-700 hover:bg-rose-50"
                          type="button"
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
      </div>
    </div>
  );
};

export default Leads;