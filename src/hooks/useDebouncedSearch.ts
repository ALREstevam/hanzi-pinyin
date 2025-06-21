import { useState, useEffect } from 'react';

function useDebouncedSearch(initialValue: string, delay: number) {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(initialValue);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, delay);

    return () => {
      clearTimeout(timerId);
    };
  }, [searchTerm, delay]);

  return { searchTerm, setSearchTerm, debouncedSearchTerm };
}

export default useDebouncedSearch;