import { useState } from 'react';
import { HiOutlineDuplicate, HiOutlineTrash, HiOutlinePlus } from 'react-icons/hi';
import { calculateLineItem } from '../../utils/gstCalculator';
import { formatCurrency } from '../../utils/formatters';
import Button from '../common/Button';

const emptyRow = () => ({
  id: Date.now() + Math.random(), product: '', productId: '', hsn: '', qty: 1, unit: 'Nos', price: 0, discount: 0, gst: 18,
});

export default function ProductTable({ items, onChange, products = [] }) {
  const updateItem = (index, field, value) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };

    if (field === 'productId') {
      const product = products.find((p) => p.id === value);
      if (product) {
        updated[index] = {
          ...updated[index],
          product: product.name,
          hsn: product.hsn,
          unit: product.unit,
          price: product.sellingPrice,
          gst: product.gst,
        };
      }
    }
    onChange(updated);
  };

  const addRow = () => onChange([...items, emptyRow()]);
  const deleteRow = (index) => onChange(items.filter((_, i) => i !== index));
  const duplicateRow = (index) => {
    const copy = { ...items[index], id: Date.now() + Math.random() };
    const updated = [...items];
    updated.splice(index + 1, 0, copy);
    onChange(updated);
  };

  return (
    <div>
      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800">
              {['#', 'Product', 'HSN', 'Qty', 'Unit', 'Price', 'Disc%', 'GST%', 'Amount', ''].map((h) => (
                <th key={h} className="px-3 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {items.map((item, index) => {
              const calc = calculateLineItem(item);
              return (
                <tr key={item.id || index}>
                  <td className="px-3 py-2 text-slate-400">{index + 1}</td>
                  <td className="px-3 py-2 min-w-[180px]">
                    <select
                      value={item.productId || ''}
                      onChange={(e) => updateItem(index, 'productId', e.target.value)}
                      className="w-full px-2 py-1.5 text-sm border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800"
                    >
                      <option value="">Select product</option>
                      {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  </td>
                  <td className="px-3 py-2">
                    <input value={item.hsn} onChange={(e) => updateItem(index, 'hsn', e.target.value)} className="w-16 px-2 py-1.5 text-sm border border-slate-200 rounded-lg" />
                  </td>
                  <td className="px-3 py-2">
                    <input type="number" value={item.qty} onChange={(e) => updateItem(index, 'qty', e.target.value)} className="w-16 px-2 py-1.5 text-sm border border-slate-200 rounded-lg" min="1" />
                  </td>
                  <td className="px-3 py-2">
                    <input value={item.unit} onChange={(e) => updateItem(index, 'unit', e.target.value)} className="w-14 px-2 py-1.5 text-sm border border-slate-200 rounded-lg" />
                  </td>
                  <td className="px-3 py-2">
                    <input type="number" value={item.price} onChange={(e) => updateItem(index, 'price', e.target.value)} className="w-24 px-2 py-1.5 text-sm border border-slate-200 rounded-lg" />
                  </td>
                  <td className="px-3 py-2">
                    <input type="number" value={item.discount} onChange={(e) => updateItem(index, 'discount', e.target.value)} className="w-14 px-2 py-1.5 text-sm border border-slate-200 rounded-lg" min="0" max="100" />
                  </td>
                  <td className="px-3 py-2">
                    <select value={item.gst} onChange={(e) => updateItem(index, 'gst', e.target.value)} className="w-16 px-2 py-1.5 text-sm border border-slate-200 rounded-lg">
                      {[0, 5, 12, 18, 28].map((r) => <option key={r} value={r}>{r}%</option>)}
                    </select>
                  </td>
                  <td className="px-3 py-2 font-medium text-slate-700 dark:text-slate-200 whitespace-nowrap">{formatCurrency(calc.total)}</td>
                  <td className="px-3 py-2">
                    <div className="flex gap-1">
                      <button onClick={() => duplicateRow(index)} className="p-1 rounded hover:bg-slate-100 text-slate-400" title="Duplicate"><HiOutlineDuplicate className="w-4 h-4" /></button>
                      <button onClick={() => deleteRow(index)} className="p-1 rounded hover:bg-red-50 text-red-400" title="Delete"><HiOutlineTrash className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="mt-3">
        <Button variant="outline" size="sm" icon={HiOutlinePlus} onClick={addRow}>Add Row</Button>
      </div>
    </div>
  );
}
