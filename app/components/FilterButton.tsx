interface FilterButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

export default function FilterButton({ label, isActive, onClick }: FilterButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300 border ${
        isActive
          ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white border-purple-500/50 shadow-lg shadow-purple-500/25 scale-105'
          : 'glass-dark text-gray-300 hover:text-white border-white/10 hover:border-purple-500/30 hover:bg-white/10 hover:scale-105'
      }`}
    >
      {label}
    </button>
  );
}
