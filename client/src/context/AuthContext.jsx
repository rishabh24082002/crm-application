import { createContext, useContext, useEffect, useState } from "react";
import axios from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (data) => {
    const res = await axios.post("/auth/login", data);
    localStorage.setItem("token", res.data.token);
    setUser(res.data.user);
  };

  const register = async (data) => {
    const res = await axios.post("/auth/register", data);
    localStorage.setItem("token", res.data.token);
    setUser(res.data.user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const loadUser = async () => {
    try {
      const res = await axios.get("/auth/me");
      setUser(res.data);
    } catch {
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);