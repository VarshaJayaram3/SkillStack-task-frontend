import { useEffect, useState } from "react";
import API from "../services/api";
import PlatformBreakdown from "../components/PlatformBreakdown";
import ResourceBreakdown from "../components/ResourceBreakdown";
import jsPDF from "jspdf";

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [skills, setSkills] = useState([]);
  const [platformData, setPlatformData] = useState([]);
  const [resourceData, setResourceData] = useState([]);

  useEffect(() => {
    API.get("/dashboard").then(res => setSummary(res.data));
    API.get("/skills").then(res => setSkills(res.data));
    API.get("/dashboard/platform-breakdown").then(res => setPlatformData(res.data));
    API.get("/dashboard/resource-breakdown").then(res => setResourceData(res.data));
  }, []);

  // Loading state (important for mobile)
  if (!summary) {
    return (
      <div className="p-6 text-center text-gray-500">
        Loading dashboard...
      </div>
    );
  }

  // ---------------------------
  // AI Insight (Rule-based, Multi-line)
  // ---------------------------
  const insights = [];

  // 1️⃣ Active skill prediction
  const activeSkill = skills
    .filter(s => s.spent_hours > 0 && s.spent_hours < s.goal_hours)
    .sort((a, b) => b.spent_hours - a.spent_hours)[0];

  if (activeSkill) {
    const remaining = activeSkill.goal_hours - activeSkill.spent_hours;
    const avgPerDay = activeSkill.spent_hours / 7 || 1;
    const days = Math.ceil(remaining / avgPerDay);

    insights.push(
      `You are progressing well in ${activeSkill.name}. At the current pace, it may be completed in ~${days} days.`
    );
  }

  // 2️⃣ Over-achieved skill
  const overAchievedSkill = skills.find(
    s => s.spent_hours > s.goal_hours
  );

  if (overAchievedSkill) {
    const extra = Math.round(
      overAchievedSkill.spent_hours - overAchievedSkill.goal_hours
    );

    insights.push(
      `You have exceeded your goal for ${overAchievedSkill.name} by ${extra} hours. Consider updating your target.`
    );
  }

  // 3️⃣ Not started skill
  const notStartedSkill = skills.find(
    s => s.goal_hours > 0 && s.spent_hours === 0
  );

  if (notStartedSkill) {
    insights.push(
      `${notStartedSkill.name} has not been started yet. Scheduling small daily sessions could help.`
    );
  }

  // 4️⃣ Platform dominance
  const platformCount = {};
  skills.forEach(skill => {
    if (skill.platform) {
      platformCount[skill.platform] =
        (platformCount[skill.platform] || 0) + 1;
    }
  });

  const dominantPlatform = Object.keys(platformCount).sort(
    (a, b) => platformCount[b] - platformCount[a]
  )[0];

  if (dominantPlatform && platformCount[dominantPlatform] > 2) {
    insights.push(
      `Most of your learning happens on ${dominantPlatform}. Consider balancing with other platforms.`
    );
  }

  // Final AI message
  const aiMessages =
    insights.length > 0
      ? insights.slice(0, 3) // limit to 3 for cleanliness
      : ["Add more learning data to see AI insights"];


  // Export Dashboard Summary
  // ---------------------------
  // Export Dashboard as DATA PDF
  // ---------------------------
  const exportDashboardPDF = () => {
    const pdf = new jsPDF();
    let y = 15;

    // Title
    pdf.setFontSize(16);
    pdf.text("SkillStack – Dashboard Summary", 14, y);
    y += 10;

    pdf.setFontSize(10);
    pdf.text(`Generated on: ${new Date().toLocaleString()}`, 14, y);
    y += 10;

    // ---------------------------
    // Summary Section
    // ---------------------------
    pdf.setFontSize(14);
    pdf.text("Overview", 14, y);
    y += 8;

    pdf.setFontSize(11);
    pdf.text(`Total Skills: ${summary.total_skills}`, 14, y); y += 6;
    pdf.text(`Completed Skills: ${summary.completed}`, 14, y); y += 6;
    pdf.text(`In Progress Skills: ${summary.in_progress}`, 14, y); y += 6;
    pdf.text(`Total Hours Spent: ${summary.total_hours}`, 14, y); y += 6;
    pdf.text(`Today's Hours: ${summary.today_hours}`, 14, y); y += 10;

    // ---------------------------
    // Platform Breakdown
    // ---------------------------
    pdf.setFontSize(14);
    pdf.text("Learning Platform", 14, y);
    y += 8;

    pdf.setFontSize(11);
    platformData.forEach(item => {
      pdf.text(`• ${item.label}: ${item.value} skills`, 14, y);
      y += 6;
    });

    if (platformData.length === 0) {
      pdf.text("No platform data available", 14, y);
      y += 6;
    }

    y += 6;

    // ---------------------------
    // Resource Breakdown
    // ---------------------------
    pdf.setFontSize(14);
    pdf.text("Learning Resource Type", 14, y);
    y += 8;

    pdf.setFontSize(11);
    resourceData.forEach(item => {
      pdf.text(`• ${item.label}: ${item.value} skills`, 14, y);
      y += 6;
    });

    if (resourceData.length === 0) {
      pdf.text("No resource data available", 14, y);
      y += 6;
    }

    y += 6;

    // ---------------------------
    // AI Insights
    // ---------------------------
    pdf.setFontSize(14);
    pdf.text("AI Insights", 14, y);
    y += 8;

    pdf.setFontSize(11);
    aiMessages.forEach(msg => {
      const lines = pdf.splitTextToSize(`• ${msg}`, 180);
      pdf.text(lines, 14, y);
      y += lines.length * 6;
    });

    if (aiMessages.length === 0) {
      pdf.text("No insights available", 14, y);
    }

    // Save
    pdf.save("skillstack-dashboard-summary.pdf");
  };


  return (
    <div id="dashboard-pdf" className="space-y-6 p-4 md:p-0 pb-24">

      {/* Export Button */}
      <div className="flex justify-end">
        <button
          onClick={exportDashboardPDF}
          className="text-sm bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition w-full md:w-auto"
        >
          Export Summary
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Card title="Total Skills" value={summary.total_skills} />
        <Card title="Completed" value={summary.completed} />
        <Card title="In Progress" value={summary.in_progress} />
        <Card title="Total Hours" value={summary.total_hours} />
      </div>

      {/* Skill Growth */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h3 className="font-semibold mb-4">Skill Growth</h3>

        <div className="space-y-3">
          {skills.map(skill => {
            const percent = Math.min(
              Math.round((skill.spent_hours / skill.goal_hours) * 100),
              100
            );

            return (
              <div key={skill.id}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="truncate">{skill.name}</span>
                  <span>{percent}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            );
          })}

          {skills.length === 0 && (
            <p className="text-gray-400">No skills added yet</p>
          )}
        </div>
      </div>

      {/* Platform + Resource Breakdown + AI */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <PlatformBreakdown data={platformData} />

        <ResourceBreakdown data={resourceData} />

        {/* AI Insight */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white p-6 rounded-2xl shadow">
          <h3 className="font-semibold mb-2">✨ AI Insight</h3>

          <p className="text-xs opacity-80 mb-2">
            Based on your recent learning activity
          </p>

          <ul className="text-sm space-y-2 list-disc list-inside">
            {aiMessages.map((msg, index) => (
              <li key={index}>{msg}</li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="bg-white p-4 rounded-2xl shadow">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  );
}
