import { useState } from 'react';
import { HiOutlinePlus, HiOutlineTrash } from 'react-icons/hi';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { useApp } from '../context/AppContext';
import { useSort, useFilter, usePagination } from '../hooks/useTable';
import { PageHeader } from '../components/common/PageHeader';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Tabs from '../components/common/Tabs';
import SearchBar from '../components/common/SearchBar';
import DataTable from '../components/common/DataTable';
import Pagination from '../components/common/Pagination';
import { FormField, Input, Textarea, Select, StatusBadge } from '../components/common/FormField';
import { formatCurrency, formatDate } from '../utils/formatters';

export default function Bills() {
  const { bills, suppliers, addBill, deleteBill } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const { register, handleSubmit, reset } = useForm();
  const { search, setSearch, filteredData } = useFilter(bills);
  const tabFiltered = activeTab === 'all' ? filteredData : filteredData.filter((b) => b.type === activeTab);
  const { sortedData, sortKey, sortDir, toggleSort } = useSort(tabFiltered, 'billDate');
  const { currentPage, totalPages, paginatedData, perPage, setPerPage, goToPage, totalItems } = usePagination(sortedData);

  const onSubmit = async (data) => {
    const supplier = suppliers.find((s) => s.id === data.supplierId);
    try {
      await addBill({ ...data, amount: Number(data.amount), gst: Number(data.gst || 0), supplierName: supplier?.name || data.supplierName });
      Swal.fire('Created!', 'Bill added successfully.', 'success');
      setModalOpen(false);
    } catch (err) { Swal.fire('Error', err.message || 'Request failed', 'error'); }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({ title: 'Delete Bill?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#2563EB' });
    if (result.isConfirmed) {
      try { await deleteBill(id); Swal.fire('Deleted!', '', 'success'); }
      catch (err) { Swal.fire('Error', err.message || 'Request failed', 'error'); }
    }
  };

  const columns = [
    { key: 'billNumber', label: 'Bill #', sortable: true, render: (r) => <span className="font-medium">{r.billNumber}</span> },
    { key: 'type', label: 'Type', render: (r) => <span className="capitalize">{r.type}</span> },
    { key: 'supplierName', label: 'Vendor', sortable: true },
    { key: 'billDate', label: 'Date', render: (r) => formatDate(r.billDate) },
    { key: 'amount', label: 'Amount', sortable: true, render: (r) => formatCurrency(r.amount) },
    { key: 'gst', label: 'GST', render: (r) => formatCurrency(r.gst) },
    { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
    { key: 'actions', label: '', render: (r) => (
      <button onClick={() => handleDelete(r.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"><HiOutlineTrash className="w-4 h-4" /></button>
    )},
  ];

  const tabs = [
    { key: 'all', label: 'All Bills', content: null },
    { key: 'purchase', label: 'Purchase', content: null },
    { key: 'expense', label: 'Expense', content: null },
    { key: 'vendor', label: 'Vendor', content: null },
  ];

  return (
    <div className="space-y-5">
      <PageHeader
        title="Bills"
        subtitle="Purchase, expense & vendor bills"
        action={<Button icon={HiOutlinePlus} onClick={() => { reset({ type: 'purchase', status: 'pending', billDate: new Date().toISOString().split('T')[0] }); setModalOpen(true); }}>Add Bill</Button>}
      />

      <div className="flex gap-1 border-b border-gray-200">
        {tabs.map((tab) => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${activeTab === tab.key ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      <Card padding={false}>
        <div className="p-5"><SearchBar value={search} onChange={setSearch} placeholder="Search bills..." className="w-full sm:w-80" /></div>
        <DataTable columns={columns} data={paginatedData} sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
        <div className="px-5 pb-3"><Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={goToPage} totalItems={totalItems} perPage={perPage} onPerPageChange={setPerPage} /></div>
      </Card>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add Bill" size="lg"
        footer={<><Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button><Button onClick={handleSubmit(onSubmit)}>Add Bill</Button></>}>
        <div className="row g-3">
          <div className="col-12 col-md-6"><FormField label="Bill Type"><Select {...register('type')} options={[{ value: 'purchase', label: 'Purchase' }, { value: 'expense', label: 'Expense' }, { value: 'vendor', label: 'Vendor' }]} /></FormField></div>
          <div className="col-12 col-md-6"><FormField label="Bill Number"><Input {...register('billNumber')} placeholder="Auto-generated" /></FormField></div>
          <div className="col-12 col-md-6"><FormField label="Supplier"><Select {...register('supplierId')} options={[{ value: '', label: 'Select' }, ...suppliers.map((s) => ({ value: s.id, label: s.name }))]} /></FormField></div>
          <div className="col-12 col-md-6"><FormField label="Vendor Name"><Input {...register('supplierName')} /></FormField></div>
          <div className="col-12 col-md-4"><FormField label="Amount"><Input {...register('amount')} type="number" /></FormField></div>
          <div className="col-12 col-md-4"><FormField label="GST"><Input {...register('gst')} type="number" /></FormField></div>
          <div className="col-12 col-md-4"><FormField label="Status"><Select {...register('status')} options={[{ value: 'pending', label: 'Pending' }, { value: 'paid', label: 'Paid' }]} /></FormField></div>
          <div className="col-12 col-md-6"><FormField label="Bill Date"><Input {...register('billDate')} type="date" /></FormField></div>
          <div className="col-12 col-md-6"><FormField label="Due Date"><Input {...register('dueDate')} type="date" /></FormField></div>
          <div className="col-12"><FormField label="Description"><Textarea {...register('description')} rows={2} /></FormField></div>
        </div>
      </Modal>
    </div>
  );
}
