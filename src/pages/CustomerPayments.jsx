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

export default function CustomerPayments() {
  const { customers, invoices, customerPayments, addCustomerPayment, cancelCustomerPayment, getInvoicePending } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ customerId: '', paymentDate: new Date().toISOString().split('T')[0], amount: '', paymentMode: 'cash', referenceNumber: '', notes: '' });
  const [allocations, setAllocations] = useState([]);

  const { search, setSearch, filteredData } = useFilter(customerPayments);
  const { sortedData, sortKey, sortDir, toggleSort } = useSort(filteredData, 'paymentDate');
  const { currentPage, totalPages, paginatedData, perPage, setPerPage, goToPage, totalItems } = usePagination(sortedData);

  const update = (f, v) => setForm((p) => ({ ...p, [f]: v }));

  const pendingInvoices = form.customerId
    ? invoices.filter((i) => i.customerId === form.customerId && i.status !== 'cancelled' && i.status !== 'draft' && getInvoicePending(i) > 0)
    : [];

  const openModal = (customerId = '') => {
    setForm({ customerId, paymentDate: new Date().toISOString().split('T')[0], amount: '', paymentMode: 'cash', referenceNumber: '', notes: '' });
    setAllocations([]);
    setModalOpen(true);
  };

  const handleCustomerChange = (id) => {
    update('customerId', id);
    setAllocations([]);
  };

  const totalAllocated = allocations.reduce((s, a) => s + (Number(a.amount) || 0), 0);
  const remaining = (Number(form.amount) || 0) - totalAllocated;

  const updateAllocation = (invoiceId, invoiceNumber, value) => {
    const amt = Number(value) || 0;
    setAllocations((prev) => {
      const existing = prev.filter((a) => a.invoiceId !== invoiceId);
      if (amt > 0) return [...existing, { invoiceId, invoiceNumber, amount: amt }];
      return existing;
    });
  };

  const handleSave = () => {
    if (!form.customerId || !form.amount) { Swal.fire('Error', 'Select customer and enter amount', 'error'); return; }
    const customer = customers.find((c) => c.id === form.customerId);
    addCustomerPayment({ ...form, customerName: customer?.name, amount: Number(form.amount), allocations });
    Swal.fire('Payment Recorded!', '', 'success');
    setModalOpen(false);
  };

  const handleCancel = async (id) => {
    const r = await Swal.fire({ title: 'Cancel Payment?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#1a5fb8' });
    if (r.isConfirmed) { cancelCustomerPayment(id); Swal.fire('Cancelled', '', 'success'); }
  };

  const columns = [
    { key: 'paymentNumber', label: 'Payment #', render: (r) => <span className="font-medium text-primary-600">{r.paymentNumber}</span> },
    { key: 'paymentDate', label: 'Date', sortable: true, render: (r) => formatDate(r.paymentDate) },
    { key: 'customerName', label: 'Customer', sortable: true },
    { key: 'amount', label: 'Amount', render: (r) => <span className="font-semibold text-green-600">{formatCurrency(r.amount)}</span> },
    { key: 'paymentMode', label: 'Mode', render: (r) => <span className="capitalize">{r.paymentMode}</span> },
    { key: 'referenceNumber', label: 'Reference', render: (r) => r.referenceNumber || '—' },
    { key: 'allocations', label: 'Against', render: (r) => r.allocations?.length ? r.allocations.map((a) => a.invoiceNumber).join(', ') : <span className="text-indigo-600 text-xs font-medium">Advance</span> },
    { key: 'unallocatedAmount', label: 'Unallocated', render: (r) => r.unallocatedAmount > 0 ? <span className="text-amber-600">{formatCurrency(r.unallocatedAmount)}</span> : '—' },
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
        title="Customer Payments"
        subtitle={`${customerPayments.filter((p) => p.status !== 'cancelled').length} payments recorded`}
        action={<Button icon={HiOutlinePlus} onClick={() => openModal()}>Receive Payment</Button>}
      />
      <Card padding={false}>
        <div className="p-5"><SearchBar value={search} onChange={setSearch} placeholder="Search payments..." className="w-full sm:w-80" /></div>
        <DataTable columns={columns} data={paginatedData} sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
        <div className="px-5 pb-3"><Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={goToPage} totalItems={totalItems} perPage={perPage} onPerPageChange={setPerPage} /></div>
      </Card>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Receive Customer Payment" size="lg"
        footer={<><Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button><Button onClick={handleSave}>Save Payment</Button></>}>
        <div className="row g-3">
          <div className="col-12 col-md-6">
            <FormField label="Customer" required>
              <Select
                options={[{ value: '', label: 'Select customer' }, ...customers.map((c) => ({ value: c.id, label: c.name }))]}
                value={form.customerId}
                onChange={(e) => handleCustomerChange(e.target.value)}
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
            <FormField label="Reference / Transaction No.">
              <Input value={form.referenceNumber} onChange={(e) => update('referenceNumber', e.target.value)} placeholder="UTR / UPI Ref" />
            </FormField>
          </div>
          <div className="col-12">
            <FormField label="Notes">
              <Textarea value={form.notes} onChange={(e) => update('notes', e.target.value)} rows={2} />
            </FormField>
          </div>

          {pendingInvoices.length > 0 && (
            <div className="col-12">
              <div className="border app-border rounded-xl p-3">
                <div className="flex justify-between items-center mb-3">
                  <h5 className="font-semibold text-sm">Allocate Against Invoices</h5>
                  <span className={`text-xs font-medium ${remaining < 0 ? 'text-red-600' : remaining > 0 ? 'text-amber-600' : 'text-green-600'}`}>
                    {remaining > 0 ? `₹${remaining.toFixed(2)} will be advance` : remaining < 0 ? `Over-allocated by ₹${Math.abs(remaining).toFixed(2)}` : 'Fully allocated'}
                  </span>
                </div>
                <div className="space-y-2">
                  {pendingInvoices.map((inv) => {
                    const pending = getInvoicePending(inv);
                    const alloc = allocations.find((a) => a.invoiceId === inv.id);
                    return (
                      <div key={inv.id} className="flex items-center gap-3 text-sm">
                        <div className="flex-1">
                          <span className="font-medium text-primary-600">{inv.invoiceNumber}</span>
                          <span className="text-slate-500 ml-2">{formatDate(inv.invoiceDate)}</span>
                          <span className="text-amber-600 ml-2">Pending: {formatCurrency(pending)}</span>
                        </div>
                        <Input
                          type="number" min="0" max={pending} step="0.01"
                          className="w-32"
                          placeholder="0.00"
                          value={alloc?.amount || ''}
                          onChange={(e) => updateAllocation(inv.id, inv.invoiceNumber, e.target.value)}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {form.customerId && pendingInvoices.length === 0 && (
            <div className="col-12">
              <div className="p-3 rounded-xl bg-indigo-50 text-indigo-700 text-sm">
                No pending invoices. This payment will be recorded as an advance.
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
