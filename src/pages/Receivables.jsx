import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineCash, HiOutlineEye } from 'react-icons/hi';
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

export default function Receivables() {
  const { getOutstandingCustomers } = useApp();
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState('all');
  const outstanding = getOutstandingCustomers();
  const { search, setSearch, filteredData } = useFilter(outstanding);
  const statusFiltered = statusFilter === 'all' ? filteredData : filteredData.filter((c) => c.paymentFilter === statusFilter);
  const { sortedData, sortKey, sortDir, toggleSort } = useSort(statusFiltered, 'totalOutstanding');
  const { currentPage, totalPages, paginatedData, perPage, setPerPage, goToPage, totalItems } = usePagination(sortedData);

  const totalReceivable = outstanding.reduce((s, c) => s + c.totalOutstanding, 0);
  const overdueCount = outstanding.filter((c) => c.paymentFilter === 'overdue').length;

  const columns = [
    { key: 'name', label: 'Customer', sortable: true, render: (r) => <span className="font-medium">{r.name}</span> },
    { key: 'totalSales', label: 'Total Sales', sortable: true, render: (r) => formatCurrency(r.totalSales) },
    { key: 'totalReceived', label: 'Received', render: (r) => <span className="text-green-600">{formatCurrency(r.totalReceived)}</span> },
    { key: 'totalOutstanding', label: 'Outstanding', sortable: true, render: (r) => <span className="font-semibold text-amber-600">{formatCurrency(r.totalOutstanding)}</span> },
    { key: 'pendingInvoiceCount', label: 'Pending Invoices', render: (r) => r.pendingInvoiceCount },
    { key: 'oldestDays', label: 'Oldest (Days)', render: (r) => r.oldestDays > 0 ? <span className={r.oldestDays > 30 ? 'text-red-600 font-medium' : 'text-amber-600'}>{r.oldestDays}d</span> : '—' },
    { key: 'paymentFilter', label: 'Status', render: (r) => <StatusBadge status={r.paymentFilter} /> },
    {
      key: 'actions', label: 'Actions', render: (r) => (
        <div className="flex gap-1">
          <button onClick={() => navigate(`/customers/${r.id}`)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600" title="View Profile"><HiOutlineEye className="w-4 h-4" /></button>
          <button onClick={() => navigate(`/customer-payments?customerId=${r.id}`)} className="p-1.5 rounded-lg hover:bg-green-50 text-green-600" title="Receive Payment"><HiOutlineCash className="w-4 h-4" /></button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <PageHeader title="Customer Receivables" subtitle="Outstanding amounts from customers" />

      <div className="row g-3">
        <div className="col-12 col-md-4">
          <Card>
            <p className="label-caps">Total Receivable</p>
            <p className="kpi-value mt-1 text-amber-600">{formatCurrency(totalReceivable)}</p>
          </Card>
        </div>
        <div className="col-12 col-md-4">
          <Card>
            <p className="label-caps">Customers with Outstanding</p>
            <p className="kpi-value mt-1">{outstanding.length}</p>
          </Card>
        </div>
        <div className="col-12 col-md-4">
          <Card>
            <p className="label-caps">Overdue Customers</p>
            <p className="kpi-value mt-1 text-red-600">{overdueCount}</p>
          </Card>
        </div>
      </div>

      <Card padding={false}>
        <div className="p-5 flex flex-wrap gap-3 items-center justify-between">
          <SearchBar value={search} onChange={setSearch} placeholder="Search customers..." className="w-full sm:w-80" />
          <div className="flex gap-2">
            {['all', 'overdue', 'partial', 'pending', 'paid'].map((s) => (
              <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-1.5 text-xs rounded-lg capitalize ${statusFilter === s ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-600'}`}>{s}</button>
            ))}
          </div>
        </div>
        <DataTable columns={columns} data={paginatedData} sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
        <div className="px-5 pb-3"><Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={goToPage} totalItems={totalItems} perPage={perPage} onPerPageChange={setPerPage} /></div>
      </Card>
    </div>
  );
}
