import { useState } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlinePlus, HiOutlineBan } from 'react-icons/hi';
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

export default function Purchases() {
  const { purchases, cancelPurchase, computePurchaseStatus, getPurchasePending } = useApp();
  const [statusFilter, setStatusFilter] = useState('all');
  const { search, setSearch, filteredData } = useFilter(purchases);
  const statusFiltered = statusFilter === 'all'
    ? filteredData
    : filteredData.filter((p) => computePurchaseStatus(p) === statusFilter);
  const { sortedData, sortKey, sortDir, toggleSort } = useSort(statusFiltered, 'purchaseDate');
  const { currentPage, totalPages, paginatedData, perPage, setPerPage, goToPage, totalItems } = usePagination(sortedData);

  const handleCancel = async (id) => {
    const result = await Swal.fire({ title: 'Cancel Purchase?', text: 'Stock will be reversed.', icon: 'warning', showCancelButton: true, confirmButtonColor: '#1a5fb8' });
    if (result.isConfirmed) {
      try { await cancelPurchase(id); Swal.fire('Cancelled', '', 'success'); }
      catch (err) { Swal.fire('Error', err.message || 'Request failed', 'error'); }
    }
  };

  const columns = [
    { key: 'purchaseNumber', label: 'Purchase #', sortable: true, render: (r) => <span className="font-medium text-primary-600">{r.purchaseNumber}</span> },
    { key: 'purchaseDate', label: 'Date', sortable: true, render: (r) => formatDate(r.purchaseDate) },
    { key: 'supplierName', label: 'Farmer/Supplier', sortable: true },
    { key: 'product', label: 'Product', render: (r) => <span>{r.product}{r.variety ? ` (${r.variety})` : ''}</span> },
    { key: 'qty', label: 'Qty', render: (r) => `${r.qty} ${r.unit}` },
    { key: 'finalAmount', label: 'Amount', render: (r) => formatCurrency(r.finalAmount) },
    { key: 'paid', label: 'Paid', render: (r) => formatCurrency(r.finalAmount - getPurchasePending(r)) },
    { key: 'pending', label: 'Pending', render: (r) => <span className={getPurchasePending(r) > 0 ? 'text-amber-600 font-medium' : 'text-green-600'}>{formatCurrency(getPurchasePending(r))}</span> },
    { key: 'status', label: 'Status', render: (r) => <StatusBadge status={computePurchaseStatus(r)} /> },
    {
      key: 'actions', label: '', render: (r) => r.status !== 'cancelled' && (
        <button onClick={() => handleCancel(r.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500" title="Cancel"><HiOutlineBan className="w-4 h-4" /></button>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <PageHeader
        title="Purchases"
        subtitle={`${purchases.filter((p) => p.status !== 'cancelled').length} purchase records`}
        action={<Link to="/purchases/create"><Button icon={HiOutlinePlus}>New Purchase</Button></Link>}
      />
      <Card padding={false}>
        <div className="p-5 flex flex-wrap gap-3 items-center justify-between">
          <SearchBar value={search} onChange={setSearch} placeholder="Search purchases..." className="w-full sm:w-80" />
          <div className="flex gap-2">
            {['all', 'unpaid', 'partial', 'paid'].map((s) => (
              <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-1.5 text-xs rounded-lg capitalize ${statusFilter === s ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-600'}`}>{s === 'all' ? 'All' : s}</button>
            ))}
          </div>
        </div>
        <DataTable columns={columns} data={paginatedData} sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
        <div className="px-5 pb-3"><Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={goToPage} totalItems={totalItems} perPage={perPage} onPerPageChange={setPerPage} /></div>
      </Card>
    </div>
  );
}
