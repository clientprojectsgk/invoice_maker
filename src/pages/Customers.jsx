import { useState } from 'react';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineEye } from 'react-icons/hi';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useApp } from '../context/AppContext';
import { useSort, useFilter, usePagination } from '../hooks/useTable';
import { PageHeader } from '../components/common/PageHeader';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import SearchBar from '../components/common/SearchBar';
import DataTable from '../components/common/DataTable';
import Pagination from '../components/common/Pagination';
import { FormField, Input, Textarea, Select } from '../components/common/FormField';
import { INDIAN_STATES } from '../utils/constants';
import { formatPhone, formatDate } from '../utils/formatters';

export default function Customers() {
  const { customers, addCustomer, updateCustomer, deleteCustomer } = useApp();
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const { search, setSearch, filteredData } = useFilter(customers);
  const { sortedData, sortKey, sortDir, toggleSort } = useSort(filteredData, 'name');
  const { currentPage, totalPages, paginatedData, perPage, setPerPage, goToPage, totalItems } = usePagination(sortedData);

  const openAdd = () => { setEditing(null); reset({}); setModalOpen(true); };
  const openEdit = (c) => { setEditing(c); reset(c); setModalOpen(true); };

  const onSubmit = (data) => {
    if (editing) { updateCustomer(editing.id, data); Swal.fire('Updated!', 'Customer updated successfully.', 'success'); }
    else { addCustomer(data); Swal.fire('Created!', 'Customer added successfully.', 'success'); }
    setModalOpen(false);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({ title: 'Delete Customer?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#1a5fb8' });
    if (result.isConfirmed) { deleteCustomer(id); Swal.fire('Deleted!', '', 'success'); }
  };

  const columns = [
    { key: 'name', label: 'Name', sortable: true, render: (r) => <button onClick={() => navigate(`/customers/${r.id}`)} className="font-medium text-primary-600 hover:underline text-left">{r.name}</button> },
    { key: 'phone', label: 'Phone', render: (r) => formatPhone(r.phone) },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'gst', label: 'GST', render: (r) => r.gst || '—' },
    { key: 'state', label: 'State', sortable: true },
    { key: 'createdAt', label: 'Added', render: (r) => formatDate(r.createdAt) },
    {
      key: 'actions', label: 'Actions', render: (r) => (
        <div className="flex gap-1">
          <button onClick={() => navigate(`/customers/${r.id}`)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600" title="View Profile"><HiOutlineEye className="w-4 h-4" /></button>
          <button onClick={() => openEdit(r)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500" title="Edit"><HiOutlinePencil className="w-4 h-4" /></button>
          <button onClick={() => handleDelete(r.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500" title="Delete"><HiOutlineTrash className="w-4 h-4" /></button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <PageHeader
        title="Customers"
        subtitle={`${customers.length} customers`}
        action={<Button icon={HiOutlinePlus} onClick={openAdd}>Add Customer</Button>}
      />

      <Card padding={false}>
        <div className="p-5"><SearchBar value={search} onChange={setSearch} placeholder="Search customers..." className="w-full sm:w-80" /></div>
        <DataTable columns={columns} data={paginatedData} sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
        <div className="px-5 pb-3"><Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={goToPage} totalItems={totalItems} perPage={perPage} onPerPageChange={setPerPage} /></div>
      </Card>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Customer' : 'Add Customer'} size="lg"
        footer={<><Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button><Button onClick={handleSubmit(onSubmit)}>{editing ? 'Update' : 'Add'}</Button></>}>
        <div className="row g-3">
          <div className="col-12 col-md-6"><FormField label="Customer Name" required error={errors.name?.message}><Input {...register('name', { required: 'Required' })} /></FormField></div>
          <div className="col-12 col-md-6"><FormField label="Phone" required><Input {...register('phone', { required: 'Required' })} /></FormField></div>
          <div className="col-12 col-md-6"><FormField label="Email"><Input {...register('email')} type="email" /></FormField></div>
          <div className="col-12 col-md-6"><FormField label="GST Number"><Input {...register('gst')} /></FormField></div>
          <div className="col-12"><FormField label="Address"><Textarea {...register('address')} rows={2} /></FormField></div>
          <div className="col-12 col-md-6"><FormField label="State"><Select {...register('state')} options={INDIAN_STATES.map((s) => ({ value: s, label: s }))} /></FormField></div>
          <div className="col-12 col-md-6"><FormField label="Pincode"><Input {...register('pincode')} /></FormField></div>
          <div className="col-12 col-md-6"><FormField label="Billing Address"><Textarea {...register('billingAddress')} rows={2} /></FormField></div>
          <div className="col-12 col-md-6"><FormField label="Shipping Address"><Textarea {...register('shippingAddress')} rows={2} /></FormField></div>
        </div>
      </Modal>
    </div>
  );
}
