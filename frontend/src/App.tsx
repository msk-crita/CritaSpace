import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useState } from "react";
import AppLayout from "./layouts/AppLayout";
import Dashboard from "./pages/Dashboard";
import Boardrooms from "./pages/Boardrooms";
import MyBookings from "./pages/MyBookings";
import AdminBoardrooms from "./pages/AdminBoardrooms";
import AdminUsers from "./pages/AdminUsers";
import AdminCompanies from "./pages/AdminCompanies";
import AdminAuditLogs from "./pages/AdminAuditLogs";
import { CompanyProvider } from "./context/CompanyContext";
import AdminMaintenance from "./pages/AdminMaintenance";
import Notifications from "./pages/Notifications";

function App() {
  const [unreadCount, setUnreadCount] = useState(0);
  return (
    <BrowserRouter>
      <CompanyProvider>
        <Routes>
          <Route element={<AppLayout unreadCount={unreadCount} />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/boardrooms/:id" element={<Boardrooms />} />
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="/admin/boardrooms" element={<AdminBoardrooms />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/companies" element={<AdminCompanies />} />
            <Route path="/admin/maintenance" element={<AdminMaintenance />} />
            <Route path="/admin/audit-logs" element={<AdminAuditLogs />} />
            <Route
              path="/notifications"
              element={<Notifications setUnreadCount={setUnreadCount} />}
            />
          </Route>
        </Routes>
      </CompanyProvider>
    </BrowserRouter>
  );
}

export default App;
