import { HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi';

export default function Pagination({ currentPage, totalPages, onPageChange, totalItems, perPage, onPerPageChange }) {
  const pages = [];
  const maxVisible = 5;
  let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages, start + maxVisible - 1);
  if (end - start + 1 < maxVisible) start = Math.max(1, end - maxVisible + 1);
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-1 py-3 border-t border-gray-100">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <span>Rows:</span>
        <select
          value={perPage}
          onChange={(e) => onPerPageChange?.(Number(e.target.value))}
          className="border border-gray-300 rounded-md px-2 py-1 text-sm bg-white"
        >
          {[5, 10, 25, 50].map((n) => <option key={n} value={n}>{n}</option>)}
        </select>
        <span className="ml-1">
          {totalItems > 0
            ? `${(currentPage - 1) * perPage + 1}–${Math.min(currentPage * perPage, totalItems)} of ${totalItems}`
            : '0 results'}
        </span>
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="p-1.5 rounded-md border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <HiOutlineChevronLeft className="w-4 h-4" />
        </button>
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`min-w-[32px] h-8 rounded-md text-sm font-medium ${
              page === currentPage
                ? 'bg-primary-600 text-white'
                : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="p-1.5 rounded-md border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <HiOutlineChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
