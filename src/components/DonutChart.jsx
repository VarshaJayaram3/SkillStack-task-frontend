function generateColor(index, total) {
  const hue = Math.round((index / total) * 360);
  return `hsl(${hue}, 70%, 50%)`;
}

export default function DonutChart({ title, data }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow">
        <h3 className="font-semibold mb-2">{title}</h3>
        <p className="text-sm text-gray-400">No data available</p>
      </div>
    );
  }

  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bg-white p-6 rounded-2xl shadow">
      <h3 className="font-semibold mb-4">{title}</h3>

      <div className="flex flex-col sm:flex-row items-center gap-6">
        {/* Donut */}
        <div className="flex-shrink-0">
          <svg
            viewBox="0 0 36 36"
            width="120"
            height="120"
            className="rotate-[-90deg]"
          >
            <circle
              cx="18"
              cy="18"
              r="15.915"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="3"
            />

            {data.map((item, index) => {
              const percentage = (item.value / total) * 100;

              const previousTotal = data
                .slice(0, index)
                .reduce(
                  (sum, d) => sum + (d.value / total) * 100,
                  0
                );

              const dashArray = `${percentage} ${100 - percentage}`;
              const dashOffset = 25 - previousTotal;

              return (
                <circle
                  key={item.label}
                  cx="18"
                  cy="18"
                  r="15.915"
                  fill="none"
                  stroke={generateColor(index, data.length)}
                  strokeWidth="3"
                  strokeDasharray={dashArray}
                  strokeDashoffset={dashOffset}
                />
              );
            })}
          </svg>
        </div>

        {/* Legend */}
        <div className="space-y-2 text-sm max-h-32 overflow-y-auto">
          {data.map((item, index) => (
            <div key={item.label} className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: generateColor(index, data.length) }}
              />
              <span className="text-gray-700">
                {item.label} ({item.value})
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
