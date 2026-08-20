import { HiOutlineSearch } from 'react-icons/hi';

export default function SearchBar({ value, onChange, placeholder = 'Search...', className = '' }) {
  return (
    <div className={`relative ${className}`}>
      <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 app-text-muted" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-9 pr-3 py-2 text-sm app-text rounded-md border app-border focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-colors"
        style={{ backgroundColor: 'var(--app-input-bg)' }}
      />
    </div>
  );
}
