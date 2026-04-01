import { useEffect, useState } from "react";
import axios from "../services/api";
import toast from "react-hot-toast";
import Loader from "../components/Loader";

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      const res = await axios.get("/dashboard");
      setData(res.data);
    } catch {
      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) return <Loader />;

  const stats = data?.stats ?? {};
  const recentActivity = data?.recentActivity ?? { leads: [], tasks: [] };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-lg font-semibold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500">Overview of your CRM activity.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={stats.totalUsers ?? 0}
          accent="bg-violet-500"
        />
        <StatCard
          title="Total Leads"
          value={stats.totalLeads ?? 0}
          accent="bg-sky-500"
        />
        <StatCard
          title="Total Tasks"
          value={stats.totalTasks ?? 0}
          accent="bg-amber-500"
        />
        <StatCard
          title="Total Deals"
          value={stats.totalDeals ?? 0}
          accent="bg-emerald-500"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Leads */}
        <Panel title="Recent Leads" subtitle="Latest created/updated leads">
          {recentActivity.leads.length === 0 ? (
            <EmptyRow text="No recent leads." />
          ) : (
            <ul className="divide-y divide-gray-200">
              {recentActivity.leads.map((lead) => (
                <li
                  key={lead._id}
                  className="flex items-center justify-between gap-3 py-3"
                >
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-gray-900 truncate">
                      {lead.name}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {lead.company || "—"}
                    </div>
                  </div>
                  <span className="shrink-0 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                    Lead
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        {/* Tasks */}
        <Panel title="Recent Tasks" subtitle="Latest created/updated tasks">
          {recentActivity.tasks.length === 0 ? (
            <EmptyRow text="No recent tasks." />
          ) : (
            <ul className="divide-y divide-gray-200">
              {recentActivity.tasks.map((task) => (
                <li
                  key={task._id}
                  className="flex items-center justify-between gap-3 py-3"
                >
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-gray-900 truncate">
                      {task.title}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      Status: {task.status || "—"}
                    </div>
                  </div>
                  <span className={taskPill(task.status)}>{task.status}</span>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </div>
  );
};

const Panel = ({ title, subtitle, children }) => (
  <section className="bg-white border border-gray-200 rounded-lg shadow-sm">
    <div className="px-4 py-3 border-b border-gray-200">
      <div className="text-sm font-semibold text-gray-900">{title}</div>
      {subtitle ? <div className="text-xs text-gray-500">{subtitle}</div> : null}
    </div>
    <div className="p-4">{children}</div>
  </section>
);

const EmptyRow = ({ text }) => (
  <div className="px-3 py-8 text-sm text-center text-gray-600 border border-gray-300 border-dashed rounded-md bg-gray-50">
    {text}
  </div>
);

const StatCard = ({ title, value, accent = "bg-blue-500" }) => (
  <div className="relative p-4 overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm">
    <div className="flex items-start justify-between gap-3">
      <div>
        <div className="text-xs font-medium text-gray-500">{title}</div>
        <div className="mt-1 text-2xl font-semibold text-gray-900">{value}</div>
      </div>
      <div className={`h-10 w-10 rounded-lg ${accent} opacity-90`} />
    </div>

    <div className="absolute w-24 h-24 bg-gray-100 rounded-full pointer-events-none -right-10 -top-10" />
  </div>
);

const taskPill = (status) => {
  const base =
    "shrink-0 inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset";
  switch (status) {
    case "completed":
      return `${base} bg-emerald-50 text-emerald-700 ring-emerald-200`;
    case "in-progress":
      return `${base} bg-sky-50 text-sky-700 ring-sky-200`;
    case "pending":
      return `${base} bg-amber-50 text-amber-700 ring-amber-200`;
    default:
      return `${base} bg-gray-50 text-gray-700 ring-gray-200`;
  }
};

export default Dashboard;