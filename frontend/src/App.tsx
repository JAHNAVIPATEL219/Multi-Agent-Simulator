import type { ReactNode } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import NewNegotiation from "./pages/NewNegotiation";
import LiveNegotiation from "./pages/LiveNegotiation";
import Simulation from "./pages/Simulation";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";

function Protected({ children }: { children: ReactNode }) {
  const location = useLocation();
  const loggedIn = localStorage.getItem("logged_in") === "true";
  if (!loggedIn) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return <Layout>{children}</Layout>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Protected><Dashboard /></Protected>} />
      <Route path="/new-negotiation" element={<Protected><NewNegotiation /></Protected>} />
      <Route path="/live" element={<Protected><LiveNegotiation /></Protected>} />
      <Route path="/simulation" element={<Protected><Simulation /></Protected>} />
      <Route path="/reports" element={<Protected><Reports /></Protected>} />
      <Route path="/settings" element={<Protected><Settings /></Protected>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
