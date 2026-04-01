import { useEffect, useMemo, useState } from "react";
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
    case "pending":
      return `${base} bg-amber-50 text-amber-700 ring-amber-200`;
    case "in-progress":
      return `${base} bg-sky-50 text-sky-700 ring-sky-200`;
    case "completed":
      return `${base} bg-emerald-50 text-emerald-700 ring-emerald-200`;
    default:
      return `${base} bg-gray-50 text-gray-700 ring-gray-200`;
  }
};

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    title: "",
    assignedTo: "",
    status: "pending",
    dueDate: "",
  });

  const [editingId, setEditingId] = useState(null);

  const assignedUserName = useMemo(() => {
    if (!form.assignedTo) return "";
    return users.find((u) => u._id === form.assignedTo)?.name ?? "";
  }, [form.assignedTo, users]);

  const fetchData = async () => {
  try {
    setLoading(true);

    const taskRes = await axios.get("/tasks");
    setTasks(taskRes.data.tasks || []);

    try {
      const userRes = await axios.get("/users");
      setUsers(userRes.data.users || []);
    } catch {
      setUsers([]); // ✅ fallback for non-admin
    }

  } catch {
    toast.error("Failed to load tasks");
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchData();
  }, []);

  const resetForm = () => {
    setForm({
      title: "",
      assignedTo: "",
      status: "pending",
      dueDate: "",
    });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }

    try {
      if (editingId) {
        await axios.put(`/tasks/${editingId}`, form);
        toast.success("Task updated");
      } else {
        await axios.post("/tasks", form);
        toast.success("Task created");
      }

      resetForm();
      fetchData();
    } catch {
      toast.error("Action failed");
    }
  };

  const handleEdit = (task) => {
    setForm({
      title: task?.title ?? "",
      assignedTo: task?.assignedTo?._id ?? "",
      status: task?.status ?? "pending",
      dueDate: task?.dueDate?.slice(0, 10) ?? "",
    });
    setEditingId(task._id);
  };

  const handleCancelEdit = () => resetForm();

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/tasks/${id}`);
      toast.success("Deleted");
      fetchData();
    } catch {
      toast.error("Delete failed");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-lg font-semibold text-gray-900">Tasks</h1>
        <p className="text-sm text-gray-500">Create tasks and assign them to users.</p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm"
      >
        <div className="flex items-center justify-between gap-3 mb-3">
          <div>
            <div className="text-sm font-semibold text-gray-900">
              {editingId ? "Edit Task" : "Add Task"}
            </div>
            <div className="text-xs text-gray-500">
              {editingId
                ? `Editing${assignedUserName ? ` (assigned to ${assignedUserName})` : ""}`
                : "Fill details and submit."}
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
          <div className="md:col-span-2">
            <div className={labelClass}>Title</div>
            <input
              className={inputClass}
              placeholder="Task title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>

          <div>
            <div className={labelClass}>Assign to</div>
            <select
              className={selectClass}
              value={form.assignedTo}
              onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
            >
              <option value="">Unassigned</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className={labelClass}>Status</div>
            <select
              className={selectClass}
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div>
            <div className={labelClass}>Due date</div>
            <input
              className={inputClass}
              type="date"
              value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
            />
          </div>

          <div className="md:col-span-2">
            <button
              className="w-full rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
              type="submit"
            >
              {editingId ? "Update Task" : "Add Task"}
            </button>
          </div>
        </div>
      </form>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="px-4 py-3 border-b border-gray-200">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-sm font-semibold text-gray-900">Task List</div>
              <div className="text-xs text-gray-500">Manage and track tasks.</div>
            </div>
            <div className="text-sm text-gray-600">
              Total: <span className="font-semibold text-gray-900">{tasks.length}</span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-50">
              <tr className="text-xs font-semibold tracking-wider text-left text-gray-600 uppercase">
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Assigned To</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Due Date</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {tasks.length === 0 ? (
                <tr>
                  <td className="px-4 py-6 text-sm text-gray-500" colSpan={5}>
                    No tasks found.
                  </td>
                </tr>
              ) : (
                tasks.map((task) => (
                  <tr key={task._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {task.title}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {task.assignedTo?.name || "Unassigned"}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className={statusPill(task.status)}>{task.status}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {task.dueDate?.slice(0, 10) || "-"}
                    </td>
                    <td className="px-4 py-3 text-sm text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(task)}
                          className="rounded-md px-2.5 py-1.5 font-medium text-blue-700 hover:bg-blue-50"
                          type="button"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(task._id)}
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

export default Tasks;