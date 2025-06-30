interface FilterButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

export default function FilterButton({ label, isActive, onClick }: FilterButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ease-in-out
        ${isActive
          ? 'bg-blue-600 text-white shadow-lg transform hover:scale-105'
          : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
        }`}
    >
      {label}
    </button>
  );
}
