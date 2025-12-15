import { useEffect, useState } from "react";
import API from "../services/api";
import SkillCard from "../components/SkillCard";

export default function MySkills({ setDashboardRefresh }) {
  const [skills, setSkills] = useState([]);

  // Fetch latest skills from backend
  const refresh = async () => {
    try {
      const res = await API.get("/skills");
      setSkills(res.data);
    } catch (err) {
      console.error("Failed to fetch skills", err);
    }
  };

  // Fetch once when page loads
 useEffect(() => {
  (async () => {
    await refresh();
  })();
}, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">My Skills</h2>

      {skills.length === 0 && (
        <p className="text-gray-500">No skills added yet.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {skills.map((skill) => (
          <SkillCard
            key={skill.id}
            skill={skill}
            refresh={refresh}
            setDashboardRefresh={setDashboardRefresh}
          />
        ))}
      </div>
    </div>
  );
}
