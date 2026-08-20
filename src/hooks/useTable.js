import { useState, useMemo } from 'react';

export const usePagination = (data, itemsPerPage = 10) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(itemsPerPage);

  const totalPages = Math.ceil(data.length / perPage) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * perPage;
    return data.slice(start, start + perPage);
  }, [data, currentPage, perPage]);

  const goToPage = (page) => setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  const nextPage = () => goToPage(currentPage + 1);
  const prevPage = () => goToPage(currentPage - 1);

  return { currentPage, totalPages, paginatedData, perPage, setPerPage, goToPage, nextPage, prevPage, totalItems: data.length };
};

export const useSort = (data, defaultKey = 'createdAt', defaultDir = 'desc') => {
  const [sortKey, setSortKey] = useState(defaultKey);
  const [sortDir, setSortDir] = useState(defaultDir);

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      const aVal = a[sortKey] ?? '';
      const bVal = b[sortKey] ?? '';
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
      }
      const cmp = String(aVal).localeCompare(String(bVal));
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [data, sortKey, sortDir]);

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('asc'); }
  };

  return { sortedData, sortKey, sortDir, toggleSort };
};

export const useFilter = (data, filterFn) => {
  const [filters, setFilters] = useState({});
  const [search, setSearch] = useState('');

  const filteredData = useMemo(() => {
    let result = data;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((item) =>
        Object.values(item).some((v) => String(v).toLowerCase().includes(q))
      );
    }
    if (filterFn) result = result.filter((item) => filterFn(item, filters));
    return result;
  }, [data, search, filters, filterFn]);

  return { filteredData, filters, setFilters, search, setSearch };
};
