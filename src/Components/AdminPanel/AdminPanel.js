import { Routes, Route } from "react-router-dom";
import "./AdminPanel.css";
import Statistics from "../Statistics/Statistics";
import Accounts from "../Accounts/Accounts";
import { useNavigate } from "react-router-dom";

function AdminPanel({ data }) {
  const nav = useNavigate();
  const stats = {
    conducted: 12,
    scheduled: 7,
    declined: 3
  };
  return (
    <div className="admin-panel-page">
      <div className="ad-menu">
        <button className="btn-ad-menu" onClick={() => nav("/admin-panel")}>
          Загальна статистика
        </button>
        <button
          className="btn-ad-menu"
          onClick={() => nav("/admin-panel/accounts")}
        >
          Управління обліковими записами
        </button>
      </div>
      <div className="ad-p-block">
        <Routes>
          <Route index element={<Statistics data={stats} />} />
          <Route path="accounts" element={<Accounts />} />
        </Routes>
      </div>
    </div>
  );
}
export default AdminPanel;
