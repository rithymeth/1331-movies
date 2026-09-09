interface FilterButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

export default function FilterButton({ label, isActive, onClick }: FilterButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-300 border ${
        isActive
          ? 'bg-cyan-300 text-slate-950 border-cyan-300'
            : 'bg-white/5 text-gray-300 border-white/10 hover:text-white hover:border-cyan-300/40 hover:bg-cyan-300/10'
      }`}
    >
      {label}
    </button>
  );
}
