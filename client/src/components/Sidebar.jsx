import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const linkBase =
  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors";
const linkInactive = "text-gray-300 hover:bg-gray-800 hover:text-white";
const linkActive = "bg-gray-800 text-white";

const Sidebar = () => {
  const { user } = useAuth();

  return (
    <aside className="sticky top-0 w-64 h-screen text-white bg-gray-900 border-r border-gray-800">
      <div className="p-4">
        <div className="mb-6">
          <h2 className="text-xl font-bold tracking-wide">CRM</h2>
          <p className="mt-1 text-xs text-gray-400">Manage leads, tasks, users</p>
        </div>

        <nav className="space-y-1">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : linkInactive}`
            }
            end
          >
            <span className="w-2 h-2 rounded-full bg-sky-400" />
            Dashboard
          </NavLink>

          <NavLink
            to="/leads"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : linkInactive}`
            }
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            Leads
          </NavLink>

          <NavLink
            to="/tasks"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : linkInactive}`
            }
          >
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            Tasks
          </NavLink>

          {user?.role === "admin" && (
            <>
              <div className="my-3 border-t border-gray-800" />
              <NavLink
                to="/users"
                className={({ isActive }) =>
                  `${linkBase} ${isActive ? linkActive : linkInactive}`
                }
              >
                <span className="w-2 h-2 rounded-full bg-violet-400" />
                Users
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;