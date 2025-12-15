import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="w-64 bg-white shadow-md hidden md:block">
      <h1 className="text-xl font-bold p-6 border-b">SkillStack</h1>

      <nav className="p-4 space-y-3">
        <NavLink to="/" className="block p-2 rounded hover:bg-slate-100">
          📊 Dashboard
        </NavLink>
        <NavLink to="/add-skill" className="block p-2 rounded hover:bg-slate-100">
          ➕ Add Skill
        </NavLink>
        <NavLink to="/skills" className="block p-2 rounded hover:bg-slate-100">
          📚 My Skills
        </NavLink>
        <NavLink to="/options" className="block p-2 rounded hover:bg-slate-100">
          ⚙️ Manage Options
        </NavLink>
      </nav>
    </div>
  );
}
