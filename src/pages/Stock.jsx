import { useState } from 'react';
import { HiOutlineAdjustments } from 'react-icons/hi';
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
import Tabs from '../components/common/Tabs';
import { FormField, Input, Select, Textarea } from '../components/common/FormField';
import { formatDate } from '../utils/formatters';

export default function Stock() {
  const { products, stockMovements, getProductStock, getStockLedger, adjustStock } = useApp();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [adjustModal, setAdjustModal] = useState(false);
  const [adjustForm, setAdjustForm] = useState({ productId: '', type: 'in', qty: '', notes: '' });
  const { search, setSearch, filteredData } = useFilter(products);
  const { sortedData, sortKey, sortDir, toggleSort } = useSort(filteredData, 'name');
  const { currentPage, totalPages, paginatedData, perPage, setPerPage, goToPage, totalItems } = usePagination(sortedData);

  const lowStock = products.filter((p) => {
    const s = getProductStock(p.id);
    return s <= (p.minStock || 0) && s > 0;
  });
  const outOfStock = products.filter((p) => getProductStock(p.id) <= 0);

  const handleAdjust = async () => {
    if (!adjustForm.productId || !adjustForm.qty) {
      Swal.fire('Error', 'Select product and quantity', 'error');
      return;
    }
    try {
      await adjustStock(adjustForm.productId, Number(adjustForm.qty), adjustForm.type, adjustForm.notes);
      Swal.fire('Stock Adjusted', '', 'success');
      setAdjustModal(false);
      setAdjustForm({ productId: '', type: 'in', qty: '', notes: '' });
    } catch (err) { Swal.fire('Error', err.message || 'Request failed', 'error'); }
  };

  const productColumns = [
    { key: 'name', label: 'Product', sortable: true, render: (r) => <span className="font-medium">{r.name}</span> },
    { key: 'variety', label: 'Variety', render: (r) => r.variety || '—' },
    { key: 'category', label: 'Category', sortable: true },
    { key: 'stock', label: 'Available', sortable: true, render: (r) => {
      const s = getProductStock(r.id);
      const cls = s <= 0 ? 'text-red-600 font-bold' : s <= (r.minStock || 0) ? 'text-amber-600 font-medium' : 'text-green-600 font-medium';
      return <span className={cls}>{s} {r.unit}</span>;
    }},
    { key: 'minStock', label: 'Min Stock', render: (r) => `${r.minStock} ${r.unit}` },
    {
      key: 'actions', label: 'Ledger', render: (r) => (
        <button onClick={() => setSelectedProduct(r)} className="text-primary-600 text-sm font-medium hover:underline">View Ledger</button>
      ),
    },
  ];

  const ledger = selectedProduct ? getStockLedger(selectedProduct.id) : [];
  const ledgerColumns = [
    { key: 'date', label: 'Date', render: (r) => formatDate(r.date) },
    { key: 'type', label: 'Transaction', render: (r) => <span className="capitalize">{r.type}</span> },
    { key: 'referenceNumber', label: 'Reference' },
    { key: 'qtyIn', label: 'In', render: (r) => r.qtyIn ? `${r.qtyIn} ${r.unit}` : '—' },
    { key: 'qtyOut', label: 'Out', render: (r) => r.qtyOut ? `${r.qtyOut} ${r.unit}` : '—' },
    { key: 'balance', label: 'Balance', render: (r) => <span className="font-medium">{r.balance} {r.unit}</span> },
  ];

  return (
    <div className="space-y-5">
      <PageHeader
        title="Stock Management"
        subtitle="Real-time inventory & stock ledger"
        action={<Button icon={HiOutlineAdjustments} onClick={() => setAdjustModal(true)}>Adjust Stock</Button>}
      />

      {(lowStock.length > 0 || outOfStock.length > 0) && (
        <div className="row g-3">
          {outOfStock.length > 0 && (
            <div className="col-12 col-md-6">
              <div className="p-4 rounded-xl bg-red-50 border border-red-200">
                <h4 className="font-semibold text-red-700 mb-2">Out of Stock ({outOfStock.length})</h4>
                <p className="text-sm text-red-600">{outOfStock.map((p) => p.name).join(', ')}</p>
              </div>
            </div>
          )}
          {lowStock.length > 0 && (
            <div className="col-12 col-md-6">
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                <h4 className="font-semibold text-amber-700 mb-2">Low Stock ({lowStock.length})</h4>
                <p className="text-sm text-amber-600">{lowStock.map((p) => `${p.name} (${getProductStock(p.id)} ${p.unit})`).join(', ')}</p>
              </div>
            </div>
          )}
        </div>
      )}

      <Card padding={false}>
        <div className="p-5"><SearchBar value={search} onChange={setSearch} placeholder="Search products..." className="w-full sm:w-80" /></div>
        <DataTable columns={productColumns} data={paginatedData} sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
        <div className="px-5 pb-3"><Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={goToPage} totalItems={totalItems} perPage={perPage} onPerPageChange={setPerPage} /></div>
      </Card>

      {selectedProduct && (
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Stock Ledger — {selectedProduct.name} ({selectedProduct.variety})</h3>
            <button onClick={() => setSelectedProduct(null)} className="text-sm text-slate-500">Close</button>
          </div>
          <DataTable columns={ledgerColumns} data={ledger} />
        </Card>
      )}

      <Modal isOpen={adjustModal} onClose={() => setAdjustModal(false)} title="Stock Adjustment"
        footer={<><Button variant="secondary" onClick={() => setAdjustModal(false)}>Cancel</Button><Button onClick={handleAdjust}>Apply</Button></>}>
        <FormField label="Product" required>
          <Select options={[{ value: '', label: 'Select' }, ...products.map((p) => ({ value: p.id, label: p.name }))]} value={adjustForm.productId} onChange={(e) => setAdjustForm({ ...adjustForm, productId: e.target.value })} />
        </FormField>
        <FormField label="Type">
          <Select options={[{ value: 'in', label: 'Stock In (+)' }, { value: 'out', label: 'Stock Out (-)' }]} value={adjustForm.type} onChange={(e) => setAdjustForm({ ...adjustForm, type: e.target.value })} />
        </FormField>
        <FormField label="Quantity" required>
          <Input type="number" min="0.1" step="0.1" value={adjustForm.qty} onChange={(e) => setAdjustForm({ ...adjustForm, qty: e.target.value })} />
        </FormField>
        <FormField label="Notes">
          <Textarea value={adjustForm.notes} onChange={(e) => setAdjustForm({ ...adjustForm, notes: e.target.value })} rows={2} />
        </FormField>
      </Modal>
    </div>
  );
}
