import { useState } from 'react';
import { HiOutlinePlus, HiOutlineBan } from 'react-icons/hi';
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
import { StatusBadge, FormField, Input, Select, Textarea } from '../components/common/FormField';
import { formatCurrency, formatDate } from '../utils/formatters';
import { PAYMENT_MODES } from '../utils/constants';

export default function PurchasePayments() {
  const { suppliers, purchases, supplierPayments, addSupplierPayment, cancelSupplierPayment, getPurchasePending, computePurchaseStatus } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ supplierId: '', paymentDate: new Date().toISOString().split('T')[0], amount: '', paymentMode: 'cash', referenceNumber: '', notes: '', allocations: [] });
  const [allocations, setAllocations] = useState([]);

  const { search, setSearch, filteredData } = useFilter(supplierPayments);
  const { sortedData, sortKey, sortDir, toggleSort } = useSort(filteredData, 'paymentDate');
  const { currentPage, totalPages, paginatedData, perPage, setPerPage, goToPage, totalItems } = usePagination(sortedData);

  const update = (f, v) => setForm((p) => ({ ...p, [f]: v }));

  const supplierPurchases = form.supplierId
    ? purchases.filter((p) => p.supplierId === form.supplierId && p.status !== 'cancelled' && getPurchasePending(p) > 0)
    : [];

  const openModal = (supplierId = '') => {
    setForm({ supplierId, paymentDate: new Date().toISOString().split('T')[0], amount: '', paymentMode: 'cash', referenceNumber: '', notes: '', allocations: [] });
    setAllocations([]);
    setModalOpen(true);
  };

  const handleSupplierChange = (id) => {
    update('supplierId', id);
    setAllocations([]);
  };

  const totalAllocated = allocations.reduce((s, a) => s + (Number(a.amount) || 0), 0);
  const remaining = (Number(form.amount) || 0) - totalAllocated;

  const updateAllocation = (purchaseId, purchaseNumber, value) => {
    const amt = Number(value) || 0;
    setAllocations((prev) => {
      const existing = prev.filter((a) => a.purchaseId !== purchaseId);
      if (amt > 0) return [...existing, { purchaseId, purchaseNumber, amount: amt }];
      return existing;
    });
  };

  const handleSave = () => {
    if (!form.supplierId || !form.amount) { Swal.fire('Error', 'Select supplier and enter amount', 'error'); return; }
    const supplier = suppliers.find((s) => s.id === form.supplierId);
    addSupplierPayment({ ...form, supplierName: supplier?.name, amount: Number(form.amount), allocations });
    Swal.fire('Payment Recorded!', '', 'success');
    setModalOpen(false);
  };

  const handleCancel = async (id) => {
    const r = await Swal.fire({ title: 'Cancel Payment?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#1a5fb8' });
    if (r.isConfirmed) { cancelSupplierPayment(id); Swal.fire('Cancelled', '', 'success'); }
  };

  const columns = [
    { key: 'paymentNumber', label: 'Payment #', render: (r) => <span className="font-medium text-primary-600">{r.paymentNumber}</span> },
    { key: 'paymentDate', label: 'Date', sortable: true, render: (r) => formatDate(r.paymentDate) },
    { key: 'supplierName', label: 'Supplier', sortable: true },
    { key: 'amount', label: 'Amount', render: (r) => <span className="font-semibold">{formatCurrency(r.amount)}</span> },
    { key: 'paymentMode', label: 'Mode', render: (r) => <span className="capitalize">{r.paymentMode}</span> },
    { key: 'referenceNumber', label: 'Reference', render: (r) => r.referenceNumber || '—' },
    { key: 'allocations', label: 'Against', render: (r) => r.allocations?.length ? r.allocations.map((a) => a.purchaseNumber).join(', ') : 'Unallocated' },
    { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status === 'cancelled' ? 'cancelled' : 'active'} /> },
    {
      key: 'actions', label: '', render: (r) => r.status !== 'cancelled' && (
        <button onClick={() => handleCancel(r.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500" title="Cancel"><HiOutlineBan className="w-4 h-4" /></button>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <PageHeader
        title="Supplier Payments"
        subtitle={`${supplierPayments.filter((p) => p.status !== 'cancelled').length} payments recorded`}
        action={<Button icon={HiOutlinePlus} onClick={() => openModal()}>Make Payment</Button>}
      />
      <Card padding={false}>
        <div className="p-5"><SearchBar value={search} onChange={setSearch} placeholder="Search payments..." className="w-full sm:w-80" /></div>
        <DataTable columns={columns} data={paginatedData} sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
        <div className="px-5 pb-3"><Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={goToPage} totalItems={totalItems} perPage={perPage} onPerPageChange={setPerPage} /></div>
      </Card>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Make Supplier Payment" size="lg"
        footer={<><Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button><Button onClick={handleSave}>Save Payment</Button></>}>
        <div className="row g-3">
          <div className="col-12 col-md-6">
            <FormField label="Supplier" required>
              <Select
                options={[{ value: '', label: 'Select supplier' }, ...suppliers.map((s) => ({ value: s.id, label: s.name }))]}
                value={form.supplierId}
                onChange={(e) => handleSupplierChange(e.target.value)}
              />
            </FormField>
          </div>
          <div className="col-12 col-md-6">
            <FormField label="Payment Date" required>
              <Input type="date" value={form.paymentDate} onChange={(e) => update('paymentDate', e.target.value)} />
            </FormField>
          </div>
          <div className="col-12 col-md-4">
            <FormField label="Amount (₹)" required>
              <Input type="number" min="0" step="0.01" value={form.amount} onChange={(e) => update('amount', e.target.value)} />
            </FormField>
          </div>
          <div className="col-12 col-md-4">
            <FormField label="Payment Mode">
              <Select options={PAYMENT_MODES} value={form.paymentMode} onChange={(e) => update('paymentMode', e.target.value)} />
            </FormField>
          </div>
          <div className="col-12 col-md-4">
            <FormField label="Reference Number">
              <Input value={form.referenceNumber} onChange={(e) => update('referenceNumber', e.target.value)} placeholder="UTR / Cheque No." />
            </FormField>
          </div>
          <div className="col-12">
            <FormField label="Notes">
              <Textarea value={form.notes} onChange={(e) => update('notes', e.target.value)} rows={2} />
            </FormField>
          </div>

          {supplierPurchases.length > 0 && (
            <div className="col-12">
              <div className="border app-border rounded-xl p-3">
                <div className="flex justify-between items-center mb-3">
                  <h5 className="font-semibold text-sm">Allocate Against Purchases</h5>
                  <span className={`text-xs font-medium ${remaining < 0 ? 'text-red-600' : remaining > 0 ? 'text-amber-600' : 'text-green-600'}`}>
                    Remaining: {formatCurrency(remaining)}
                  </span>
                </div>
                <div className="space-y-2">
                  {supplierPurchases.map((pur) => {
                    const pending = getPurchasePending(pur);
                    const alloc = allocations.find((a) => a.purchaseId === pur.id);
                    return (
                      <div key={pur.id} className="flex items-center gap-3 text-sm">
                        <div className="flex-1">
                          <span className="font-medium text-primary-600">{pur.purchaseNumber}</span>
                          <span className="text-slate-500 ml-2">{formatDate(pur.purchaseDate)}</span>
                          <span className="text-amber-600 ml-2">Pending: {formatCurrency(pending)}</span>
                        </div>
                        <Input
                          type="number" min="0" max={pending} step="0.01"
                          className="w-32"
                          placeholder="0.00"
                          value={alloc?.amount || ''}
                          onChange={(e) => updateAllocation(pur.id, pur.purchaseNumber, e.target.value)}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
