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

export default function Suppliers() {
  const { suppliers, addSupplier, updateSupplier, deleteSupplier } = useApp();
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const { search, setSearch, filteredData } = useFilter(suppliers);
  const { sortedData, sortKey, sortDir, toggleSort } = useSort(filteredData, 'name');
  const { currentPage, totalPages, paginatedData, perPage, setPerPage, goToPage, totalItems } = usePagination(sortedData);

  const openAdd = () => { setEditing(null); reset({}); setModalOpen(true); };
  const openEdit = (s) => { setEditing(s); reset(s); setModalOpen(true); };

  const onSubmit = (data) => {
    if (editing) { updateSupplier(editing.id, data); Swal.fire('Updated!', '', 'success'); }
    else { addSupplier(data); Swal.fire('Created!', '', 'success'); }
    setModalOpen(false);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({ title: 'Delete Supplier?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#2563EB' });
    if (result.isConfirmed) { deleteSupplier(id); Swal.fire('Deleted!', '', 'success'); }
  };

  const columns = [
    { key: 'name', label: 'Name', sortable: true, render: (r) => <button onClick={() => navigate(`/suppliers/${r.id}`)} className="font-medium text-primary-600 hover:underline text-left">{r.name}</button> },
    { key: 'phone', label: 'Phone', render: (r) => formatPhone(r.phone) },
    { key: 'email', label: 'Email' },
    { key: 'gst', label: 'GST' },
    { key: 'paymentTerms', label: 'Payment Terms' },
    { key: 'state', label: 'State', sortable: true },
    {
      key: 'actions', label: 'Actions', render: (r) => (
        <div className="flex gap-1">
          <button onClick={() => navigate(`/suppliers/${r.id}`)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600" title="View Profile"><HiOutlineEye className="w-4 h-4" /></button>
          <button onClick={() => openEdit(r)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500" title="Edit"><HiOutlinePencil className="w-4 h-4" /></button>
          <button onClick={() => handleDelete(r.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500" title="Delete"><HiOutlineTrash className="w-4 h-4" /></button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <PageHeader title="Suppliers" subtitle={`${suppliers.length} suppliers`} action={<Button icon={HiOutlinePlus} onClick={openAdd}>Add Supplier</Button>} />

      <Card padding={false}>
        <div className="p-5"><SearchBar value={search} onChange={setSearch} placeholder="Search suppliers..." className="w-full sm:w-80" /></div>
        <DataTable columns={columns} data={paginatedData} sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
        <div className="px-5 pb-3"><Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={goToPage} totalItems={totalItems} perPage={perPage} onPerPageChange={setPerPage} /></div>
      </Card>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Supplier' : 'Add Supplier'} size="lg"
        footer={<><Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button><Button onClick={handleSubmit(onSubmit)}>{editing ? 'Update' : 'Add'}</Button></>}>
        <div className="row g-3">
          <div className="col-12 col-md-6"><FormField label="Supplier Name" required><Input {...register('name', { required: true })} /></FormField></div>
          <div className="col-12 col-md-6"><FormField label="Phone" required><Input {...register('phone', { required: true })} /></FormField></div>
          <div className="col-12 col-md-6"><FormField label="Email"><Input {...register('email')} type="email" /></FormField></div>
          <div className="col-12 col-md-6"><FormField label="GST Number"><Input {...register('gst')} /></FormField></div>
          <div className="col-12"><FormField label="Address"><Textarea {...register('address')} rows={2} /></FormField></div>
          <div className="col-12 col-md-6"><FormField label="State"><Select {...register('state')} options={INDIAN_STATES.map((s) => ({ value: s, label: s }))} /></FormField></div>
          <div className="col-12 col-md-6"><FormField label="Pincode"><Input {...register('pincode')} /></FormField></div>
          <div className="col-12 col-md-6"><FormField label="Billing Address"><Textarea {...register('billingAddress')} rows={2} /></FormField></div>
          <div className="col-12 col-md-6"><FormField label="Shipping Address"><Textarea {...register('shippingAddress')} rows={2} /></FormField></div>
          <div className="col-12"><hr className="my-2" /><h4 className="font-semibold text-sm text-slate-600 mb-2">Bank Details</h4></div>
          <div className="col-12 col-md-4"><FormField label="Bank Name"><Input {...register('bankName')} /></FormField></div>
          <div className="col-12 col-md-4"><FormField label="Account Number"><Input {...register('bankAccount')} /></FormField></div>
          <div className="col-12 col-md-4"><FormField label="IFSC Code"><Input {...register('bankIFSC')} /></FormField></div>
          <div className="col-12 col-md-6"><FormField label="Payment Terms"><Input {...register('paymentTerms')} placeholder="Net 30" /></FormField></div>
        </div>
      </Modal>
    </div>
  );
}
