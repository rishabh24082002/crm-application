import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const titleByPath = (path) => {
    if (path.startsWith("/dashboard")) return "Dashboard";
    if (path.startsWith("/leads")) return "Leads";
    if (path.startsWith("/tasks")) return "Tasks";
    if (path.startsWith("/users")) return "Users";
    return "CRM";
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true }); // fixed typo: navi -> navigate
  };

  return (
    <header className="sticky top-0 z-20 border-b border-gray-200 bg-white/80 backdrop-blur">
      <div className="flex items-center justify-between gap-4 px-4 py-3 mx-auto max-w-7xl">
        <div className="min-w-0">
          <h1 className="text-base font-semibold text-gray-900 truncate">
            {titleByPath(location.pathname)}
          </h1>
          <p className="text-xs text-gray-500 truncate">
            {user?.name ? `Signed in as ${user.name}` : " "}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleLogout}
            className="inline-flex items-center px-3 py-2 text-sm font-medium transition border rounded-md border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-200"
            type="button"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;