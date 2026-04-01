import { useEffect, useState } from "react";
import axios from "../services/api";
import toast from "react-hot-toast";
import Loader from "../components/Loader";
import { useAuth } from "../context/AuthContext";

const rolePill = (role) => {
  const base =
    "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset";
  if (role === "admin") return `${base} bg-violet-50 text-violet-700 ring-violet-200`;
  return `${base} bg-gray-50 text-gray-700 ring-gray-200`;
};

const Users = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/users");
      setUsers(res.data.users || []);
    } catch {
      toast.error("Access denied or failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "admin") fetchUsers();
    else setLoading(false);
  }, [user]);

  const handleDelete = async (id) => {
    const ok = window.confirm("Delete this user?");
    if (!ok) return;

    try {
      await axios.delete(`/users/${id}`);
      toast.success("User deleted");
      fetchUsers();
    } catch {
      toast.error("Delete failed");
    }
  };

  if (loading) return <Loader />;

  if (user?.role !== "admin") {
    return (
      <div className="px-4 py-10 text-sm text-center border rounded-lg border-rose-200 bg-rose-50 text-rose-700">
        Access denied (Admin only).
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-lg font-semibold text-gray-900">User Management</h1>
        <p className="text-sm text-gray-500">View and remove users.</p>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-gray-200">
          <div>
            <div className="text-sm font-semibold text-gray-900">Users</div>
            <div className="text-xs text-gray-500">Total: {users.length}</div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-50">
              <tr className="text-xs font-semibold tracking-wider text-left text-gray-600 uppercase">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {users.length === 0 ? (
                <tr>
                  <td className="px-4 py-6 text-sm text-gray-500" colSpan={4}>
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {u.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{u.email}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={rolePill(u.role)}>{u.role}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-right">
                      <button
                        onClick={() => handleDelete(u._id)}
                        className="rounded-md px-2.5 py-1.5 font-medium text-rose-700 hover:bg-rose-50"
                        type="button"
                      >
                        Delete
                      </button>
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

export default Users;