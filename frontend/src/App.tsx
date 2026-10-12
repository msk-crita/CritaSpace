import { BrowserRouter, Route, Routes } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import Dashboard from "./pages/Dashboard";
import Boardrooms from "./pages/Boardrooms";
import MyBookings from "./pages/MyBookings";
import AdminBoardrooms from "./pages/AdminBoardrooms";
import AdminUsers from "./pages/AdminUsers";
import AdminCompanies from "./pages/AdminCompanies";
import AdminAuditLogs from "./pages/AdminAuditLogs";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/boardrooms/:id" element={<Boardrooms />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/admin/boardrooms" element={<AdminBoardrooms />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/companies" element={<AdminCompanies />} />
          <Route path="/admin/audit-logs" element={<AdminAuditLogs />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
