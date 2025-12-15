import API from "../services/api";
import { useState } from "react";
import EditSkillModal from "./EditSkillModal";
import NotesHistoryModal from "./NotesHistoryModal";
import DifficultyStars from "../utils/DifficultyStars";


export default function SkillCard({ skill, refresh, setDashboardRefresh }) {
    const [hours, setHours] = useState("");
    const [editOpen, setEditOpen] = useState(false);
    const [note, setNote] = useState("");
    const [notesOpen, setNotesOpen] = useState(false);

    const exceeded = skill.spent_hours > skill.goal_hours;
    const progress = Math.min(
        Math.round((skill.spent_hours / skill.goal_hours) * 100),
        100
    );

    const addHours = async () => {
        if (!hours) return;

        await API.post(`/skills/${skill.id}/add-hours?hours=${hours}`);
        setHours("");
        refresh();
        setDashboardRefresh(v => v + 1);
    };

    const deleteSkill = async () => {
        if (!window.confirm("Delete this skill?")) return;
        await API.delete(`/skills/${skill.id}`);
        refresh();
    };

    const addNote = async () => {
        if (!note.trim()) return;

        await API.post(`/skills/${skill.id}/add-note`, {
            content: note,
        });

        setNote("");
        refresh();
    };


    return (
        <>
            <div className="bg-white rounded-2xl shadow p-5 space-y-3">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-lg">{skill.name}</h3>
                    <span className="text-sm px-2 py-1 rounded-full bg-blue-100 text-blue-600">
                        {skill.status}
                    </span>
                </div>

                {/* Meta */}
                <p className="text-sm text-gray-500">
                    {skill.platform} • {skill.resource_type}
                </p>

                {/* Difficulty */}
                <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Difficulty</span>
                    <DifficultyStars level={skill.difficulty} />
                </div>

                {/* Progress */}
                <div>
                    <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span>{progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className={`h-2 rounded-full ${exceeded ? "bg-red-500" : "bg-green-500"
                                }`}
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* Hours */}
                <div className="text-sm flex flex-wrap md:flex-nowrap gap-x-3 gap-y-1">
                    <div className="shrink-0 whitespace-nowrap">
                        Goal: {skill.goal_hours}h
                    </div>

                    <div className="shrink-0 whitespace-nowrap">
                        Spent: {skill.spent_hours}h
                    </div>

                    <div className="shrink-0 whitespace-nowrap">
                        {exceeded
                            ? `Exceeded: ${skill.spent_hours - skill.goal_hours}h 🔥`
                            : `Remaining: ${skill.goal_hours - skill.spent_hours}h`}
                    </div>
                </div>



                {/* Latest Note */}
                <div className="text-xs text-gray-600 flex gap-1">
                    <span className="font-medium shrink-0">Recent update:</span>

                    <span
                        className="max-w-[180px] truncate whitespace-nowrap overflow-hidden cursor-pointer"
                        title={
                            skill.notes.length > 0
                                ? skill.notes[skill.notes.length - 1].content
                                : ""
                        }
                    >
                        {skill.notes.length > 0
                            ? skill.notes[skill.notes.length - 1].content
                            : "No updates yet"}
                    </span>
                </div>

                {/* View History Button */}
                <button
                    onClick={() => setNotesOpen(true)}
                    className="text-xs text-blue-600 underline w-fit"
                >
                    View Notes
                </button>

                {/* Add Hours */}
                <div className="flex gap-2">
                    <input
                        type="number"
                        placeholder="Add spent hours"
                        className="border rounded px-2 h-9 w-full text-sm"
                        value={hours}
                        onChange={(e) => setHours(e.target.value)}
                    />
                    <button
                        onClick={addHours}
                        className="h-9 px-4 rounded bg-green-600 text-white text-sm flex items-center justify-center"
                    >
                        +
                    </button>
                </div>

                {/* Add Note */}
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Add note"
                        className="border rounded px-2 h-9 w-full text-sm"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                    />
                    <button
                        onClick={addNote}
                        className="h-9 px-4 rounded bg-blue-600 text-white text-sm flex items-center justify-center"
                    >
                        +
                    </button>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 text-sm">
                    <button
                        className="text-blue-600"
                        onClick={() => setEditOpen(true)}
                    >
                        Edit
                    </button>

                    <button onClick={deleteSkill} className="text-red-600">
                        Delete
                    </button>
                </div>
            </div>

            {editOpen && (
                <EditSkillModal
                    skill={skill}
                    onClose={() => setEditOpen(false)}
                    refresh={refresh}
                />
            )}

            {notesOpen && (
                <NotesHistoryModal
                    skill={skill}
                    onClose={() => setNotesOpen(false)}
                />
            )}
        </>
    );


}
