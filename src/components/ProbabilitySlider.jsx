export function ProbabilitySlider({ label, value, onChange, color = 'green', icon }) {
  const colorClasses = {
    green: 'bg-green-500',
    yellow: 'bg-yellow-400',
    red: 'bg-red-500'
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <span className="text-lg">{icon}</span>
          {label}
        </label>
        <span className="text-lg font-bold text-gray-800">{value}%</span>
      </div>
      <input
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-500"
        style={{
          background: `linear-gradient(to right, ${color === 'green' ? '#22c55e' : color === 'yellow' ? '#facc15' : '#ef4444'} 0%, ${color === 'green' ? '#22c55e' : color === 'yellow' ? '#facc15' : '#ef4444'} ${value}%, #e5e7eb ${value}%, #e5e7eb 100%)`
        }}
      />
    </div>
  );
}
