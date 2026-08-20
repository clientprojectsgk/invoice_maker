import { useState } from 'react';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineUpload, HiOutlineDownload } from 'react-icons/hi';
import { useForm } from 'react-hook-form';
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
import { FormField, Input, Select, StatusBadge } from '../components/common/FormField';
import { PRODUCT_UNITS, GST_RATES } from '../utils/constants';
import { formatCurrency, exportToCSV } from '../utils/formatters';

export default function Products() {
  const { products, addProduct, updateProduct, deleteProduct } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const { register, handleSubmit, reset } = useForm();
  const { search, setSearch, filteredData } = useFilter(products);
  const { sortedData, sortKey, sortDir, toggleSort } = useSort(filteredData, 'name');
  const { currentPage, totalPages, paginatedData, perPage, setPerPage, goToPage, totalItems } = usePagination(sortedData);

  const openAdd = () => { setEditing(null); reset({ unit: 'Nos', gst: 18, status: 'active', stock: 0, minStock: 5 }); setModalOpen(true); };
  const openEdit = (p) => { setEditing(p); reset(p); setModalOpen(true); };

  const onSubmit = (data) => {
    const parsed = { ...data, purchasePrice: Number(data.purchasePrice), sellingPrice: Number(data.sellingPrice), gst: Number(data.gst), stock: Number(data.stock), minStock: Number(data.minStock) };
    if (editing) { updateProduct(editing.id, parsed); Swal.fire('Updated!', '', 'success'); }
    else { addProduct(parsed); Swal.fire('Created!', '', 'success'); }
    setModalOpen(false);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({ title: 'Delete Product?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#2563EB' });
    if (result.isConfirmed) { deleteProduct(id); Swal.fire('Deleted!', '', 'success'); }
  };

  const handleExport = () => {
    exportToCSV(products.map((p) => ({
      Name: p.name, Category: p.category, HSN: p.hsn, SKU: p.sku, 'GST%': p.gst,
      'Purchase Price': p.purchasePrice, 'Selling Price': p.sellingPrice, Unit: p.unit, Stock: p.stock, Status: p.status,
    })), 'products');
  };

  const columns = [
    { key: 'name', label: 'Product', sortable: true, render: (r) => (
      <div><span className="font-medium">{r.name}</span><p className="text-xs text-slate-400">{r.sku}</p></div>
    )},
    { key: 'category', label: 'Category', sortable: true },
    { key: 'hsn', label: 'HSN' },
    { key: 'sellingPrice', label: 'Price', sortable: true, render: (r) => formatCurrency(r.sellingPrice) },
    { key: 'gst', label: 'GST', render: (r) => `${r.gst}%` },
    { key: 'stock', label: 'Stock', sortable: true, render: (r) => (
      <span className={r.stock <= r.minStock ? 'text-red-500 font-semibold' : ''}>{r.stock} {r.unit}</span>
    )},
    { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
    {
      key: 'actions', label: '', render: (r) => (
        <div className="flex gap-1">
          <button onClick={() => openEdit(r)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"><HiOutlinePencil className="w-4 h-4" /></button>
          <button onClick={() => handleDelete(r.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"><HiOutlineTrash className="w-4 h-4" /></button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <PageHeader
        title="Products"
        subtitle={`${products.length} products`}
        action={
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" icon={HiOutlineUpload} onClick={() => Swal.fire('Import', 'Excel import ready for backend integration', 'info')}>Import</Button>
            <Button variant="secondary" size="sm" icon={HiOutlineDownload} onClick={handleExport}>Export</Button>
            <Button icon={HiOutlinePlus} onClick={openAdd}>Add Product</Button>
          </div>
        }
      />

      <Card padding={false}>
        <div className="p-5"><SearchBar value={search} onChange={setSearch} placeholder="Search products..." className="w-full sm:w-80" /></div>
        <DataTable columns={columns} data={paginatedData} sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} stickyHeader />
        <div className="px-5 pb-3"><Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={goToPage} totalItems={totalItems} perPage={perPage} onPerPageChange={setPerPage} /></div>
      </Card>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Product' : 'Add Product'} size="lg"
        footer={<><Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button><Button onClick={handleSubmit(onSubmit)}>{editing ? 'Update' : 'Add'}</Button></>}>
        <div className="row g-3">
          <div className="col-12 col-md-6"><FormField label="Product Name" required><Input {...register('name', { required: true })} /></FormField></div>
          <div className="col-12 col-md-6"><FormField label="Category"><Input {...register('category')} /></FormField></div>
          <div className="col-12 col-md-4"><FormField label="HSN Code"><Input {...register('hsn')} /></FormField></div>
          <div className="col-12 col-md-4"><FormField label="SKU"><Input {...register('sku')} /></FormField></div>
          <div className="col-12 col-md-4"><FormField label="Barcode"><Input {...register('barcode')} /></FormField></div>
          <div className="col-12 col-md-4"><FormField label="GST %"><Select {...register('gst')} options={GST_RATES.map((r) => ({ value: r, label: `${r}%` }))} /></FormField></div>
          <div className="col-12 col-md-4"><FormField label="Purchase Price"><Input {...register('purchasePrice')} type="number" /></FormField></div>
          <div className="col-12 col-md-4"><FormField label="Selling Price"><Input {...register('sellingPrice')} type="number" /></FormField></div>
          <div className="col-12 col-md-4"><FormField label="Unit"><Select {...register('unit')} options={PRODUCT_UNITS.map((u) => ({ value: u, label: u }))} /></FormField></div>
          <div className="col-12 col-md-4"><FormField label="Stock"><Input {...register('stock')} type="number" /></FormField></div>
          <div className="col-12 col-md-4"><FormField label="Min Stock"><Input {...register('minStock')} type="number" /></FormField></div>
          <div className="col-12 col-md-4"><FormField label="Status"><Select {...register('status')} options={[{ value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }]} /></FormField></div>
        </div>
      </Modal>
    </div>
  );
}
