import { memo, useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { useDebounce } from '@/shared/hooks/useDebounce';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

function SearchInputInner({ value, onChange, placeholder = 'Search...' }: SearchInputProps) {
  const [local, setLocal] = useState(value);
  const debounced = useDebounce(local);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    setLocal(value);
  }, [value]);

  useEffect(() => {
    onChangeRef.current(debounced);
  }, [debounced]);

  return (
    <div className="relative w-full sm:max-w-sm">
      <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        placeholder={placeholder}
        className="h-11 w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-12 pr-4 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
      />
    </div>
  );
}

export const SearchInput = memo(SearchInputInner);
