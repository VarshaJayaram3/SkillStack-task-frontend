import { useEffect, useState } from "react";
import API from "../services/api";

export default function ManageOptions() {
  const [options, setOptions] = useState([]);
  const [type, setType] = useState("resource");
  const [value, setValue] = useState("");

  const fetchOptions = () => {
    API.get("/options").then((res) => setOptions(res.data));
  };

  useEffect(() => {
    fetchOptions();
  }, []);

  const addOption = async () => {
    if (!value.trim()) return;

    try {
      await API.post("/options", { type, value });
      setValue("");
      fetchOptions();
    } catch (err) {
        console.log(err)
      alert("Option already exists");
    }
  };

  const deleteOption = async (id) => {
    if (!window.confirm("Delete this option?")) return;
    await API.delete(`/options/${id}`);
    fetchOptions();
  };

  const resourceOptions = options.filter(o => o.type === "resource");
  const platformOptions = options.filter(o => o.type === "platform");

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      <h2 className="text-xl font-semibold">Manage Options</h2>

      {/* Add Option */}
      <div className="bg-white p-4 rounded-2xl shadow space-y-3">
        <h3 className="font-medium">Add New Option</h3>

        <div className="flex flex-col md:flex-row gap-3">
          <select
            className="border p-2 rounded"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="resource">Resource Type</option>
            <option value="platform">Platform</option>
          </select>

          <input
            type="text"
            placeholder="Option value"
            className="border p-2 rounded flex-1"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />

          <button
            onClick={addOption}
            className="bg-blue-600 text-white px-4 rounded"
          >
            Add
          </button>
        </div>
      </div>

      {/* Resource Types */}
      <div className="bg-white p-4 rounded-2xl shadow">
        <h3 className="font-medium mb-3">Resource Types</h3>

        <div className="flex flex-wrap gap-2">
          {resourceOptions.map((o) => (
            <span
              key={o.id}
              className="bg-slate-100 px-3 py-1 rounded-full flex items-center gap-2 text-sm"
            >
              {o.value}
              <button
                onClick={() => deleteOption(o.id)}
                className="text-red-500"
              >
                ✕
              </button>
            </span>
          ))}

          {resourceOptions.length === 0 && (
            <p className="text-gray-400 text-sm">No resource types added</p>
          )}
        </div>
      </div>

      {/* Platforms */}
      <div className="bg-white p-4 rounded-2xl shadow">
        <h3 className="font-medium mb-3">Platforms</h3>

        <div className="flex flex-wrap gap-2">
          {platformOptions.map((o) => (
            <span
              key={o.id}
              className="bg-slate-100 px-3 py-1 rounded-full flex items-center gap-2 text-sm"
            >
              {o.value}
              <button
                onClick={() => deleteOption(o.id)}
                className="text-red-500"
              >
                ✕
              </button>
            </span>
          ))}

          {platformOptions.length === 0 && (
            <p className="text-gray-400 text-sm">No platforms added</p>
          )}
        </div>
      </div>
    </div>
  );
}
