import { useEffect, useState } from "react";
import API from "../services/api";

export default function EditSkillModal({ skill, onClose, refresh }) {
  const [form, setForm] = useState({ ...skill });
  const [options, setOptions] = useState({ resource: [], platform: [] });

  useEffect(() => {
    API.get("/options").then(res => {
      setOptions({
        resource: res.data.filter(o => o.type === "resource"),
        platform: res.data.filter(o => o.type === "platform")
      });
    });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    await API.put(`/skills/${skill.id}`, {
      name: form.name,
      resource_type: form.resource_type,
      platform: form.platform,
      status: form.status,
      goal_hours: Number(form.goal_hours),
      spent_hours: Number(form.spent_hours),
      difficulty: Number(form.difficulty)
    });

    onClose();
    refresh();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-lg p-6 space-y-4">
        <h2 className="text-lg font-semibold">Edit Skill</h2>

        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <select
          name="resource_type"
          value={form.resource_type}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          {options.resource.map(o => (
            <option key={o.id} value={o.value}>{o.value}</option>
          ))}
        </select>

        <select
          name="platform"
          value={form.platform}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          {options.platform.map(o => (
            <option key={o.id} value={o.value}>{o.value}</option>
          ))}
        </select>

        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option>Started</option>
          <option>In Progress</option>
          <option>Completed</option>
        </select>

        <div className="grid grid-cols-2 gap-3">
          <input
            type="number"
            name="goal_hours"
            value={form.goal_hours}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            type="number"
            name="spent_hours"
            value={form.spent_hours}
            onChange={handleChange}
            className="border p-2 rounded"
          />
        </div>

        <select
          name="difficulty"
          value={form.difficulty}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value={1}>Very Easy</option>
          <option value={2}>Easy</option>
          <option value={3}>Medium</option>
          <option value={4}>Hard</option>
          <option value={5}>Very Hard</option>
        </select>

        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-1 rounded border"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-1 rounded bg-blue-600 text-white"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
