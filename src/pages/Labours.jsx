import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineEye } from 'react-icons/hi';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { useApp } from '../context/AppContext';
import { useFilter, useSort, usePagination } from '../hooks/useTable';
import { PageHeader } from '../components/common/PageHeader';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import SearchBar from '../components/common/SearchBar';
import DataTable from '../components/common/DataTable';
import Pagination from '../components/common/Pagination';
import { FormField, Input, Select } from '../components/common/FormField';
import { formatCurrency, formatDate } from '../utils/formatters';

const ROLES = ['Loading', 'Unloading', 'Sorting', 'Packing', 'Driver', 'Helper', 'Supervisor', 'Other'];
const STATUS_OPTS = [{ value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }];

export default function Labours() {
  const { labours, addLabour, updateLabour, deleteLabour, getLabourEarnings } = useApp();
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const { search, setSearch, filteredData } = useFilter(labours);
  const { sortedData, sortKey, sortDir, toggleSort } = useSort(filteredData, 'name');
  const { currentPage, totalPages, paginatedData, perPage, setPerPage, goToPage, totalItems } = usePagination(sortedData);

  const openAdd = () => { setEditing(null); reset({ status: 'active', dailyWage: '', overtimeRate: '' }); setModalOpen(true); };
  const openEdit = (l) => { setEditing(l); reset(l); setModalOpen(true); };

  const onSubmit = (data) => {
    if (editing) { updateLabour(editing.id, data); Swal.fire('Updated!', '', 'success'); }
    else { addLabour(data); Swal.fire('Added!', 'Labour added successfully.', 'success'); }
    setModalOpen(false);
  };

  const handleDelete = async (id) => {
    const r = await Swal.fire({ title: 'Delete Labour?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#1a5fb8' });
    if (r.isConfirmed) { deleteLabour(id); Swal.fire('Deleted!', '', 'success'); }
  };

  const activeCount = labours.filter((l) => l.status === 'active').length;
  const totalBalance = labours.reduce((s, l) => s + getLabourEarnings(l.id).balance, 0);

  const columns = [
    { key: 'name', label: 'Name', sortable: true, render: (r) => (
      <button onClick={() => navigate(`/labours/${r.id}`)} className="font-medium text-primary-600 hover:underline text-left">{r.name}</button>
    )},
    { key: 'phone', label: 'Phone' },
    { key: 'role', label: 'Role', render: (r) => r.role || '—' },
    { key: 'dailyWage', label: 'Daily Wage', render: (r) => formatCurrency(r.dailyWage) },
    { key: 'earned', label: 'Total Earned', render: (r) => formatCurrency(getLabourEarnings(r.id).earned) },
    { key: 'paid', label: 'Total Paid', render: (r) => <span className="text-green-600">{formatCurrency(getLabourEarnings(r.id).paid)}</span> },
    { key: 'balance', label: 'Balance Due', render: (r) => {
      const b = getLabourEarnings(r.id).balance;
      return <span className={b > 0 ? 'text-amber-600 font-medium' : 'text-green-600'}>{formatCurrency(b)}</span>;
    }},
    { key: 'status', label: 'Status', render: (r) => (
      <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${r.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{r.status}</span>
    )},
    { key: 'actions', label: 'Actions', render: (r) => (
      <div className="flex gap-1">
        <button onClick={() => navigate(`/labours/${r.id}`)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600" title="View"><HiOutlineEye className="w-4 h-4" /></button>
        <button onClick={() => openEdit(r)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500" title="Edit"><HiOutlinePencil className="w-4 h-4" /></button>
        <button onClick={() => handleDelete(r.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500" title="Delete"><HiOutlineTrash className="w-4 h-4" /></button>
      </div>
    )},
  ];

  return (
    <div className="space-y-5">
      <PageHeader title="Labour Management" subtitle={`${activeCount} active labourers`} action={<Button icon={HiOutlinePlus} onClick={openAdd}>Add Labour</Button>} />

      <div className="row g-3">
        <div className="col-6 col-md-3">
          <Card><p className="label-caps">Total Labourers</p><p className="kpi-value mt-1">{labours.length}</p></Card>
        </div>
        <div className="col-6 col-md-3">
          <Card><p className="label-caps">Active</p><p className="kpi-value mt-1 text-green-600">{activeCount}</p></Card>
        </div>
        <div className="col-6 col-md-3">
          <Card><p className="label-caps">Total Wages Earned</p><p className="kpi-value mt-1">{formatCurrency(labours.reduce((s, l) => s + getLabourEarnings(l.id).earned, 0))}</p></Card>
        </div>
        <div className="col-6 col-md-3">
          <Card><p className="label-caps">Total Balance Due</p><p className={`kpi-value mt-1 ${totalBalance > 0 ? 'text-amber-600' : 'text-green-600'}`}>{formatCurrency(totalBalance)}</p></Card>
        </div>
      </div>

      <Card padding={false}>
        <div className="p-5"><SearchBar value={search} onChange={setSearch} placeholder="Search labourers..." className="w-full sm:w-80" /></div>
        <DataTable columns={columns} data={paginatedData} sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} emptyMessage="No labourers added yet" />
        <div className="px-5 pb-3"><Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={goToPage} totalItems={totalItems} perPage={perPage} onPerPageChange={setPerPage} /></div>
      </Card>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Labour' : 'Add Labour'} size="lg"
        footer={<><Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button><Button onClick={handleSubmit(onSubmit)}>{editing ? 'Update' : 'Add'}</Button></>}>
        <div className="row g-3">
          <div className="col-12 col-md-6">
            <FormField label="Full Name" required error={errors.name?.message}>
              <Input {...register('name', { required: 'Required' })} placeholder="Labour name" />
            </FormField>
          </div>
          <div className="col-12 col-md-6">
            <FormField label="Phone">
              <Input {...register('phone')} placeholder="Mobile number" />
            </FormField>
          </div>
          <div className="col-12 col-md-6">
            <FormField label="Role / Work Type">
              <Select {...register('role')} options={[{ value: '', label: 'Select role' }, ...ROLES.map((r) => ({ value: r, label: r }))]} />
            </FormField>
          </div>
          <div className="col-12 col-md-6">
            <FormField label="Status">
              <Select {...register('status')} options={STATUS_OPTS} />
            </FormField>
          </div>
          <div className="col-12 col-md-4">
            <FormField label="Daily Wage (₹)" required error={errors.dailyWage?.message}>
              <Input type="number" min="0" step="0.01" {...register('dailyWage', { required: 'Required' })} placeholder="e.g. 500" />
            </FormField>
          </div>
          <div className="col-12 col-md-4">
            <FormField label="Overtime Rate (₹/hr)">
              <Input type="number" min="0" step="0.01" {...register('overtimeRate')} placeholder="e.g. 80" />
            </FormField>
          </div>
          <div className="col-12 col-md-4">
            <FormField label="Join Date">
              <Input type="date" {...register('joinDate')} />
            </FormField>
          </div>
          <div className="col-12">
            <FormField label="Address">
              <Input {...register('address')} placeholder="Home address" />
            </FormField>
          </div>
          <div className="col-12 col-md-6">
            <FormField label="Aadhaar / ID Number">
              <Input {...register('idNumber')} placeholder="Aadhaar / ID" />
            </FormField>
          </div>
          <div className="col-12 col-md-6">
            <FormField label="Bank Account / UPI">
              <Input {...register('bankAccount')} placeholder="Account no. or UPI ID" />
            </FormField>
          </div>
        </div>
      </Modal>
    </div>
  );
}
