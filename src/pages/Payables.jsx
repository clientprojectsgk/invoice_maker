import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineCreditCard, HiOutlineEye } from 'react-icons/hi';
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

export default function Payables() {
  const { getOutstandingSuppliers } = useApp();
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState('all');
  const outstanding = getOutstandingSuppliers();
  const { search, setSearch, filteredData } = useFilter(outstanding);
  const statusFiltered = statusFilter === 'all' ? filteredData : filteredData.filter((s) => {
    if (statusFilter === 'unpaid') return s.totalPaid === 0 && s.totalPending > 0;
    if (statusFilter === 'partial') return s.totalPaid > 0 && s.totalPending > 0;
    if (statusFilter === 'paid') return s.totalPending === 0;
    return true;
  });
  const { sortedData, sortKey, sortDir, toggleSort } = useSort(statusFiltered, 'totalPending');
  const { currentPage, totalPages, paginatedData, perPage, setPerPage, goToPage, totalItems } = usePagination(sortedData);

  const totalPayable = outstanding.reduce((s, sup) => s + sup.totalPending, 0);

  const columns = [
    { key: 'name', label: 'Supplier / Farmer', sortable: true, render: (r) => <span className="font-medium">{r.name}</span> },
    { key: 'totalPurchase', label: 'Total Purchase', sortable: true, render: (r) => formatCurrency(r.totalPurchase) },
    { key: 'totalPaid', label: 'Paid', render: (r) => <span className="text-green-600">{formatCurrency(r.totalPaid)}</span> },
    { key: 'totalPending', label: 'Pending', sortable: true, render: (r) => <span className="font-semibold text-red-600">{formatCurrency(r.totalPending)}</span> },
    { key: 'pendingPurchaseCount', label: 'Pending Purchases', render: (r) => r.pendingPurchaseCount },
    {
      key: 'status', label: 'Status', render: (r) => {
        const s = r.totalPending === 0 ? 'paid' : r.totalPaid === 0 ? 'unpaid' : 'partial';
        return <StatusBadge status={s} />;
      },
    },
    {
      key: 'actions', label: 'Actions', render: (r) => (
        <div className="flex gap-1">
          <button onClick={() => navigate(`/suppliers/${r.id}`)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600" title="View Profile"><HiOutlineEye className="w-4 h-4" /></button>
          <button onClick={() => navigate(`/purchase-payments?supplierId=${r.id}`)} className="p-1.5 rounded-lg hover:bg-green-50 text-green-600" title="Make Payment"><HiOutlineCreditCard className="w-4 h-4" /></button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <PageHeader title="Supplier Payables" subtitle="Outstanding amounts to suppliers/farmers" />

      <div className="row g-3">
        <div className="col-12 col-md-4">
          <Card>
            <p className="label-caps">Total Payable</p>
            <p className="kpi-value mt-1 text-red-600">{formatCurrency(totalPayable)}</p>
          </Card>
        </div>
        <div className="col-12 col-md-4">
          <Card>
            <p className="label-caps">Suppliers with Outstanding</p>
            <p className="kpi-value mt-1">{outstanding.length}</p>
          </Card>
        </div>
        <div className="col-12 col-md-4">
          <Card>
            <p className="label-caps">Fully Paid Suppliers</p>
            <p className="kpi-value mt-1 text-green-600">{outstanding.filter((s) => s.totalPending === 0).length}</p>
          </Card>
        </div>
      </div>

      <Card padding={false}>
        <div className="p-5 flex flex-wrap gap-3 items-center justify-between">
          <SearchBar value={search} onChange={setSearch} placeholder="Search suppliers..." className="w-full sm:w-80" />
          <div className="flex gap-2">
            {['all', 'unpaid', 'partial', 'paid'].map((s) => (
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
