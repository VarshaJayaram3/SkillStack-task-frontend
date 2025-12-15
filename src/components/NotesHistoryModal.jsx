export default function NotesHistoryModal({ skill, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-md p-6">
        <h3 className="font-semibold mb-4">
          Notes History – {skill.name}
        </h3>

        <ul className="text-sm space-y-2 max-h-64 overflow-y-auto">
          {skill.notes.map(note => (
            <li key={note.id} className="border-b pb-1">
              {note.content}
            </li>
          ))}

          {skill.notes.length === 0 && (
            <p className="text-gray-400">No notes available</p>
          )}
        </ul>

        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="px-4 py-1 border rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
