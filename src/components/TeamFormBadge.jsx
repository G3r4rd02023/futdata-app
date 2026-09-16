export function TeamFormBadge({ form }) {
  if (!form || form.length === 0) return <span className="text-gray-400 text-sm">-</span>;

  return (
    <div className="flex gap-0.5">
      {form.split('').map((result, i) => {
        const colors = {
          W: 'bg-green-500 text-white',
          D: 'bg-yellow-400 text-gray-800',
          L: 'bg-red-500 text-white'
        };
        const labels = { W: 'V', D: 'E', L: 'D' };

        return (
          <span
            key={i}
            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${colors[result] || 'bg-gray-200'}`}
            title={result === 'W' ? 'Victoria' : result === 'D' ? 'Empate' : 'Derrota'}
          >
            {labels[result] || result}
          </span>
        );
      })}
    </div>
  );
}
