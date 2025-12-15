export default function ExportDashboardButton({ onExport }) {
  return (
    <div className="flex justify-end">
      <button
        onClick={onExport}
        className="text-sm bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition w-full md:w-auto"
      >
        Export Summary
      </button>
    </div>
  );
}
