import { HiOutlineChevronUp, HiOutlineChevronDown } from 'react-icons/hi';

export default function DataTable({
  columns, data, onSort, sortKey, sortDir, selectable, selectedIds, onSelect, onSelectAll,
  stickyHeader = true, emptyMessage = 'No data found',
}) {
  const allSelected = data.length > 0 && selectedIds?.length === data.length;

  return (
    <div className="overflow-x-auto rounded-xl">
      <table className={`w-full text-sm tracking-tight ${stickyHeader ? 'table-sticky' : ''}`}>
        <thead>
          <tr className="border-b app-border">
            {selectable && (
              <th className="px-4 py-3 w-10">
                <input type="checkbox" checked={allSelected} onChange={(e) => onSelectAll?.(e.target.checked)} className="rounded border-gray-300" />
              </th>
            )}
            {columns.map((col) => (
              <th
                key={col.key}
                className={`px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider app-text-muted ${col.sortable ? 'cursor-pointer select-none hover:text-primary-600' : ''} ${col.className || ''}`}
                onClick={() => col.sortable && onSort?.(col.key)}
                style={{ width: col.width }}
              >
                <span className="inline-flex items-center gap-1">
                  {col.label}
                  {col.sortable && sortKey === col.key && (
                    sortDir === 'asc' ? <HiOutlineChevronUp className="w-3.5 h-3.5" /> : <HiOutlineChevronDown className="w-3.5 h-3.5" />
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (selectable ? 1 : 0)} className="px-4 py-12 text-center app-text-muted text-sm">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr key={row.id || idx} className="border-b app-border hover-surface transition-colors">
                {selectable && (
                  <td className="px-4 py-3.5">
                    <input
                      type="checkbox"
                      checked={selectedIds?.includes(row.id)}
                      onChange={() => onSelect?.(row.id)}
                      className="rounded border-gray-300"
                    />
                  </td>
                )}
                {columns.map((col) => (
                  <td key={col.key} className={`px-4 py-3.5 app-text ${col.className || ''}`}>
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
