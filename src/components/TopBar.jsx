import { useEffect, useState } from "react";
import API from "../services/api";
import { useLocation } from "react-router-dom";

export default function TopBar({ dashboardRefresh }) {
    const location = useLocation();
  const [summary, setSummary] = useState({ today: 0, total: 0 });

 useEffect(() => {
  API.get("/dashboard").then(res => {
    setSummary({
      today: res.data.today_hours,
      total: res.data.total_hours
    });
  });
}, [dashboardRefresh]);

  const getTitle = () => {
    switch (location.pathname) {
      case "/":
        return "Dashboard";
      case "/add-skill":
        return "Add Skill";
      case "/skills":
        return "My Skills";
      case "/options":
        return "Manage Options";
      default:
        return "SkillStack";
    }
  };

  return (
    <div className="bg-white shadow p-4 flex justify-between">
      <h2 className="font-semibold">{getTitle()}</h2>
      <div className="text-sm">
        ⏱ Today: {summary.today} hrs | 📊 Total: {summary.total} hrs
      </div>
    </div>
  );
}
