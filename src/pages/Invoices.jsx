import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiOutlinePlus, HiOutlineEye, HiOutlineDuplicate, HiOutlineTrash, HiOutlineFilter } from 'react-icons/hi';
import Swal from 'sweetalert2';
import { useApp } from '../context/AppContext';
import { useSort, useFilter, usePagination } from '../hooks/useTable';
import { PageHeader } from '../components/common/PageHeader';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import SearchBar from '../components/common/SearchBar';
import DataTable from '../components/common/DataTable';
import Pagination from '../components/common/Pagination';
import { StatusBadge } from '../components/common/FormField';
import { formatCurrency, formatDate } from '../utils/formatters';
import { exportToCSV } from '../utils/formatters';

export default function Invoices() {
  const { invoices, deleteInvoice, duplicateInvoice } = useApp();
  const navigate = useNavigate();
  const [selectedIds, setSelectedIds] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const { search, setSearch, filteredData } = useFilter(invoices);
  const statusFiltered = statusFilter ? filteredData.filter((i) => i.status === statusFilter) : filteredData;
  const { sortedData, sortKey, sortDir, toggleSort } = useSort(statusFiltered, 'invoiceDate');
  const { currentPage, totalPages, paginatedData, perPage, setPerPage, goToPage, totalItems } = usePagination(sortedData);

  const handleDelete = async (id) => {
    const result = await Swal.fire({ title: 'Delete Invoice?', text: 'This cannot be undone', icon: 'warning', showCancelButton: true, confirmButtonColor: '#1a5fb8' });
    if (result.isConfirmed) {
      try { await deleteInvoice(id); Swal.fire('Deleted!', 'Invoice has been deleted.', 'success'); }
      catch (err) { Swal.fire('Error', err.message || 'Request failed', 'error'); }
    }
  };

  const columns = [
    { key: 'invoiceNumber', label: 'Invoice #', sortable: true, render: (r) => <Link to={`/invoices/${r.id}`} className="font-medium text-primary-600 hover:underline">{r.invoiceNumber}</Link> },
    { key: 'customerName', label: 'Customer', sortable: true },
    { key: 'invoiceDate', label: 'Date', sortable: true, render: (r) => formatDate(r.invoiceDate) },
    { key: 'dueDate', label: 'Due Date', render: (r) => formatDate(r.dueDate) },
    { key: 'totals', label: 'Amount', sortable: true, render: (r) => <span className="font-semibold">{formatCurrency(r.totals?.grandTotal)}</span> },
    { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
    {
      key: 'actions', label: 'Actions', render: (r) => (
        <div className="flex gap-1">
          <button onClick={() => navigate(`/invoices/${r.id}`)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600" title="View"><HiOutlineEye className="w-4 h-4" /></button>
          <button onClick={() => { duplicateInvoice(r.id); Swal.fire('Duplicated!', 'Invoice duplicated as draft.', 'success'); }} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500" title="Duplicate"><HiOutlineDuplicate className="w-4 h-4" /></button>
          <button onClick={() => handleDelete(r.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500" title="Delete"><HiOutlineTrash className="w-4 h-4" /></button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <PageHeader
        title="Invoices"
        subtitle={`${invoices.length} total invoices`}
        action={<Link to="/invoices/create"><Button icon={HiOutlinePlus}>Create Invoice</Button></Link>}
      />

      <Card padding={false}>
        <div className="p-5 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <SearchBar value={search} onChange={setSearch} placeholder="Search invoices..." className="w-full sm:w-80" />
          <div className="flex gap-2">
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="text-sm border border-gray-300 rounded-md px-3 py-2 bg-white">
              <option value="">All Status</option>
              {['draft', 'sent', 'paid', 'partial', 'overdue'].map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
            </select>
            <Button variant="secondary" size="sm" icon={HiOutlineFilter}>Filters</Button>
            <Button variant="secondary" size="sm" onClick={() => exportToCSV(invoices.map((i) => ({ 'Invoice #': i.invoiceNumber, Customer: i.customerName, Date: i.invoiceDate, Amount: i.totals?.grandTotal, Status: i.status })), 'invoices')}>Export</Button>
          </div>
        </div>
        <DataTable
          columns={columns} data={paginatedData} sortKey={sortKey} sortDir={sortDir} onSort={toggleSort}
          selectable selectedIds={selectedIds}
          onSelect={(id) => setSelectedIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])}
          onSelectAll={(checked) => setSelectedIds(checked ? paginatedData.map((d) => d.id) : [])}
        />
        <div className="px-5 pb-3">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={goToPage} totalItems={totalItems} perPage={perPage} onPerPageChange={setPerPage} />
        </div>
      </Card>
    </div>
  );
}
