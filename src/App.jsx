/* eslint-disable no-unused-vars */
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import AddSkill from "./pages/AddSkill";
import MySkills from "./pages/MySkills";
import ManageOptions from "./pages/ManageOptions";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import { useState } from "react";

function App() {
  const [dashboardRefresh, setDashboardRefresh] = useState(0);
  return (
    <BrowserRouter>
      <div className="flex h-screen bg-slate-50">
        <Sidebar />

        <div className="flex-1 flex flex-col">
          <TopBar dashboardRefresh={dashboardRefresh} />

          <div className="p-6 overflow-y-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/add-skill" element={<AddSkill />} />
              <Route path="/skills" element={<MySkills setDashboardRefresh={setDashboardRefresh}/>} />
              <Route path="/options" element={<ManageOptions />} />
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
