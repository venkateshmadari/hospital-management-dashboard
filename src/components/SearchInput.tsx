import { Input } from "@/components/ui/input";
import { useEffect, useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "react-router-dom";
import { FiSearch } from "react-icons/fi";

interface SearchInputProps {
  placeholder?: string;
  onSearch?: (value: string) => void;
  onClearSearch?: () => void;
}

const SearchInput = ({
  placeholder,
  onSearch,
  onClearSearch,
}: SearchInputProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("search") || "";
  const [searchData, setSearchData] = useState(initialQuery);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setSearchData(initialQuery);
  }, [initialQuery]);

  const updateUrlParams = (value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value.trim()) {
      newParams.set("search", value.trim());
    } else {
      newParams.delete("search");
    }
    setSearchParams(newParams);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setSearchData(newValue);

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      updateUrlParams(newValue);
      if (newValue.trim()) {
        onSearch?.(newValue.trim());
      } else {
        onClearSearch?.();
      }
    }, 300);
  };

  const handleSearchByButton = useCallback(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    updateUrlParams(searchData);
    if (searchData.trim()) {
      onSearch?.(searchData.trim());
    } else {
      onClearSearch?.();
    }
  }, [searchData, onSearch, onClearSearch]);

  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="relative flex items-center gap-1.5">
      <div className="absolute left-3 text-gray-400 dark:text-gray-500">
        <FiSearch size={18} />
      </div>
      <Input
        type="search"
        placeholder={placeholder}
        value={searchData}
        onChange={handleChange}
        className="w-full pl-10 pr-4 py-4 text-sm text-black bg-white border dark:border-gray-700 dark:bg-black dark:text-white rounded-md outline-none sm:text-base focus:ring-0 focus:shadow-none"
        onKeyDown={(e) => e.key === "Enter" && handleSearchByButton()}
      />
      <Button variant="default" className="text-white" onClick={handleSearchByButton}>
        <span>Search</span>
      </Button>
    </div>
  );
};

export default SearchInput;
