import { useEffect, useState } from "react";
import API from "../services/api";

export default function AddSkill() {
  const [form, setForm] = useState({
    name: "",
    resource_type: "",
    platform: "",
    status: "Started",
    goal_hours: "",
    spent_hours: "",
    difficulty: 3,
    note: "",
  });

  const [options, setOptions] = useState({
    resourceTypes: [],
    platforms: [],
  });

  // Fetch dropdown options
  useEffect(() => {
    API.get("/options").then((res) => {
      const resourceTypes = res.data.filter(o => o.type === "resource");
      const platforms = res.data.filter(o => o.type === "platform");

      setOptions({ resourceTypes, platforms });
    });
  }, []);

  // Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 1. Create skill
      const skillRes = await API.post("/skills", {
        name: form.name,
        resource_type: form.resource_type,
        platform: form.platform,
        status: form.status,
        goal_hours: Number(form.goal_hours),
        spent_hours: Number(form.spent_hours || 0),
        difficulty: Number(form.difficulty),
      });

      // 2. Add initial note (optional)
      if (form.note.trim()) {
        await API.post(`/skills/${skillRes.data.id}/add-note`, {
          content: form.note,
        });
      }

      alert("Skill added successfully ✅");

      setForm({
        name: "",
        resource_type: "",
        platform: "",
        status: "Started",
        goal_hours: "",
        spent_hours: "",
        difficulty: 3,
        note: "",
      });

    } catch (err) {
      alert("Error adding skill");
      console.error(err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow">
      <h2 className="text-xl font-semibold mb-6">Add Skill</h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Skill Name */}
        <input
          type="text"
          name="name"
          placeholder="Skill Name"
          className="w-full p-2 border rounded"
          value={form.name}
          onChange={handleChange}
          required
        />

        {/* Resource Type */}
        <select
          name="resource_type"
          className="w-full p-2 border rounded"
          value={form.resource_type}
          onChange={handleChange}
          required
        >
          <option value="">Select Resource Type</option>
          {options.resourceTypes.map(rt => (
            <option key={rt.id} value={rt.value}>{rt.value}</option>
          ))}
        </select>

        {/* Platform */}
        <select
          name="platform"
          className="w-full p-2 border rounded"
          value={form.platform}
          onChange={handleChange}
          required
        >
          <option value="">Select Platform</option>
          {options.platforms.map(p => (
            <option key={p.id} value={p.value}>{p.value}</option>
          ))}
        </select>

        {/* Status */}
        <select
          name="status"
          className="w-full p-2 border rounded"
          value={form.status}
          onChange={handleChange}
        >
          <option>Started</option>
          <option>In Progress</option>
          <option>Completed</option>
        </select>

        {/* Goal & Spent */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="number"
            name="goal_hours"
            placeholder="Goal Hours"
            className="p-2 border rounded"
            value={form.goal_hours}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="spent_hours"
            placeholder="Initial Spent Hours"
            className="p-2 border rounded"
            value={form.spent_hours}
            onChange={handleChange}
          />
        </div>

        {/* Difficulty */}
        <select
          name="difficulty"
          className="w-full p-2 border rounded"
          value={form.difficulty}
          onChange={handleChange}
        >
          <option value={1}>Very Easy</option>
          <option value={2}>Easy</option>
          <option value={3}>Medium</option>
          <option value={4}>Hard</option>
          <option value={5}>Very Hard</option>
        </select>

        {/* Notes */}
        <textarea
          name="note"
          placeholder="Add initial note (optional)"
          className="w-full p-2 border rounded"
          rows="3"
          value={form.note}
          onChange={handleChange}
        />

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Save Skill
        </button>
      </form>
    </div>
  );
}
