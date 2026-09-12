import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlinePlus, HiOutlineTrash } from 'react-icons/hi';
import Swal from 'sweetalert2';
import { useApp } from '../context/AppContext';
import { calcPurchaseAmounts } from '../utils/businessLogic';
import { formatCurrency } from '../utils/formatters';
import { PageHeader } from '../components/common/PageHeader';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { FormField, Input, Textarea, Select } from '../components/common/FormField';
import { PAYMENT_MODES, PRODUCT_UNITS } from '../utils/constants';

const emptyItem = () => ({ productId: '', product: '', variety: '', grade: '', qty: '', unit: 'Kg', purchaseRate: '', discount: 0, otherCharges: 0 });

export default function PurchaseCreate() {
  const { suppliers, products, addPurchase } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    purchaseDate: new Date().toISOString().split('T')[0],
    supplierId: '', vehicleNumber: '', driverName: '', purchaseLocation: '',
    transportationCost: 0, otherExpenses: 0,
    amountPaid: 0, paymentMode: 'cash', notes: '',
  });
  const [items, setItems] = useState([emptyItem()]);

  const updateForm = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const updateItem = (idx, field, value) => {
    setItems((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: value };
      if (field === 'productId') {
        const p = products.find((x) => x.id === value);
        if (p) {
          next[idx].product = p.name;
          next[idx].variety = p.variety || '';
          next[idx].unit = p.unit || 'Kg';
          next[idx].purchaseRate = p.purchasePrice || '';
        }
      }
      return next;
    });
  };

  const addItem = () => setItems((prev) => [...prev, emptyItem()]);
  const removeItem = (idx) => setItems((prev) => prev.filter((_, i) => i !== idx));

  const getItemTotal = (item) => {
    const gross = (Number(item.qty) || 0) * (Number(item.purchaseRate) || 0);
    return gross - (Number(item.discount) || 0) + (Number(item.otherCharges) || 0);
  };

  const amounts = calcPurchaseAmounts({ ...form, items });
  const selectedSupplier = suppliers.find((s) => s.id === form.supplierId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.supplierId) { Swal.fire('Error', 'Select a supplier', 'error'); return; }
    const validItems = items.filter((i) => i.productId && i.qty && i.purchaseRate);
    if (validItems.length === 0) { Swal.fire('Error', 'Add at least one product with qty and rate', 'error'); return; }
    try {
      const purchase = await addPurchase({
        ...form,
        items: validItems.map((i) => ({ ...i, qty: Number(i.qty), purchaseRate: Number(i.purchaseRate) })),
        supplierName: selectedSupplier?.name,
        transportationCost: Number(form.transportationCost),
        otherExpenses: Number(form.otherExpenses),
        amountPaid: Number(form.amountPaid),
      });
      Swal.fire('Purchase Recorded!', `${purchase.purchaseNumber} — Stock updated`, 'success');
      navigate('/purchases');
    } catch (err) {
      Swal.fire('Error', err.message, 'error');
    }
  };

  return (
    <div className="space-y-5">
      <PageHeader title="New Purchase Entry" subtitle="Record purchase from farmer/supplier" />
      <form onSubmit={handleSubmit}>
        <div className="row g-4">
          <div className="col-12 col-lg-8 space-y-4">
            {/* Purchase Info */}
            <Card>
              <h4 className="font-semibold mb-4 text-sm app-text-muted uppercase tracking-wide">Purchase Information</h4>
              <div className="row g-3">
                <div className="col-12 col-md-4">
                  <FormField label="Purchase Date" required>
                    <Input type="date" value={form.purchaseDate} onChange={(e) => updateForm('purchaseDate', e.target.value)} />
                  </FormField>
                </div>
                <div className="col-12 col-md-8">
                  <FormField label="Farmer / Supplier" required>
                    <Select
                      options={[{ value: '', label: 'Select supplier' }, ...suppliers.map((s) => ({ value: s.id, label: s.name }))]}
                      value={form.supplierId}
                      onChange={(e) => updateForm('supplierId', e.target.value)}
                    />
                  </FormField>
                </div>
                <div className="col-12 col-md-4">
                  <FormField label="Vehicle Number">
                    <Input value={form.vehicleNumber} onChange={(e) => updateForm('vehicleNumber', e.target.value)} placeholder="MH-15-AB-1234" />
                  </FormField>
                </div>
                <div className="col-12 col-md-4">
                  <FormField label="Driver Name">
                    <Input value={form.driverName} onChange={(e) => updateForm('driverName', e.target.value)} />
                  </FormField>
                </div>
                <div className="col-12 col-md-4">
                  <FormField label="Purchase Location">
                    <Input value={form.purchaseLocation} onChange={(e) => updateForm('purchaseLocation', e.target.value)} placeholder="Lasalgaon, Nashik" />
                  </FormField>
                </div>
              </div>
            </Card>

            {/* Products */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-sm app-text-muted uppercase tracking-wide">Products</h4>
                <Button type="button" size="sm" icon={HiOutlinePlus} onClick={addItem}>Add Product</Button>
              </div>
              <div className="space-y-4">
                {items.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl border app-border" style={{backgroundColor:'var(--app-surface-hover)'}}>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs font-semibold app-text-muted">Item {idx + 1}</span>
                      {items.length > 1 && (
                        <button type="button" onClick={() => removeItem(idx)} className="p-1 rounded hover:bg-red-50 text-red-500">
                          <HiOutlineTrash className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <div className="row g-2">
                      <div className="col-12 col-md-4">
                        <FormField label="Product" required>
                          <Select
                            options={[{ value: '', label: 'Select' }, ...products.map((p) => ({ value: p.id, label: p.name }))]}
                            value={item.productId}
                            onChange={(e) => updateItem(idx, 'productId', e.target.value)}
                          />
                        </FormField>
                      </div>
                      <div className="col-6 col-md-2">
                        <FormField label="Variety">
                          <Input value={item.variety} onChange={(e) => updateItem(idx, 'variety', e.target.value)} />
                        </FormField>
                      </div>
                      <div className="col-6 col-md-2">
                        <FormField label="Grade">
                          <Input value={item.grade} onChange={(e) => updateItem(idx, 'grade', e.target.value)} placeholder="A/B/C" />
                        </FormField>
                      </div>
                      <div className="col-4 col-md-2">
                        <FormField label="Qty" required>
                          <Input type="number" min="0.1" step="0.1" value={item.qty} onChange={(e) => updateItem(idx, 'qty', e.target.value)} />
                        </FormField>
                      </div>
                      <div className="col-4 col-md-2">
                        <FormField label="Unit">
                          <Select options={PRODUCT_UNITS.map((u) => ({ value: u, label: u }))} value={item.unit} onChange={(e) => updateItem(idx, 'unit', e.target.value)} />
                        </FormField>
                      </div>
                      <div className="col-4 col-md-2">
                        <FormField label="Rate (₹)" required>
                          <Input type="number" min="0" step="0.01" value={item.purchaseRate} onChange={(e) => updateItem(idx, 'purchaseRate', e.target.value)} />
                        </FormField>
                      </div>
                      <div className="col-6 col-md-2">
                        <FormField label="Discount (₹)">
                          <Input type="number" min="0" value={item.discount} onChange={(e) => updateItem(idx, 'discount', e.target.value)} />
                        </FormField>
                      </div>
                      <div className="col-6 col-md-2">
                        <FormField label="Other Charges">
                          <Input type="number" min="0" value={item.otherCharges} onChange={(e) => updateItem(idx, 'otherCharges', e.target.value)} />
                        </FormField>
                      </div>
                      <div className="col-12 col-md-4 flex items-end pb-4">
                        <div className="text-sm font-semibold text-primary-600">
                          Item Total: {formatCurrency(getItemTotal(item))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Charges & Payment */}
            <Card>
              <h4 className="font-semibold mb-4 text-sm app-text-muted uppercase tracking-wide">Charges & Payment</h4>
              <div className="row g-3">
                <div className="col-12 col-md-3">
                  <FormField label="Transportation Cost">
                    <Input type="number" min="0" value={form.transportationCost} onChange={(e) => updateForm('transportationCost', e.target.value)} />
                  </FormField>
                </div>
                <div className="col-12 col-md-3">
                  <FormField label="Other Expenses">
                    <Input type="number" min="0" value={form.otherExpenses} onChange={(e) => updateForm('otherExpenses', e.target.value)} />
                  </FormField>
                </div>
                <div className="col-12 col-md-3">
                  <FormField label="Amount Paid Now">
                    <Input type="number" min="0" max={amounts.finalAmount} value={form.amountPaid} onChange={(e) => updateForm('amountPaid', e.target.value)} />
                  </FormField>
                </div>
                <div className="col-12 col-md-3">
                  <FormField label="Payment Mode">
                    <Select options={PAYMENT_MODES} value={form.paymentMode} onChange={(e) => updateForm('paymentMode', e.target.value)} />
                  </FormField>
                </div>
                <div className="col-12">
                  <FormField label="Notes">
                    <Textarea value={form.notes} onChange={(e) => updateForm('notes', e.target.value)} rows={2} />
                  </FormField>
                </div>
              </div>
            </Card>
          </div>

          {/* Summary */}
          <div className="col-12 col-lg-4">
            <Card className="sticky top-4">
              <h4 className="font-semibold mb-4">Purchase Summary</h4>
              {selectedSupplier && (
                <div className="mb-4 p-3 rounded-lg border app-border text-sm" style={{backgroundColor:'var(--app-surface-hover)'}}>
                  <p className="font-medium">{selectedSupplier.name}</p>
                  <p className="text-slate-500 text-xs">{selectedSupplier.phone}</p>
                </div>
              )}
              <div className="space-y-2 text-sm mb-4">
                {items.filter((i) => i.productId && i.qty).map((item, idx) => (
                  <div key={idx} className="flex justify-between app-text-muted">
                    <span>{item.product || 'Product'} ({item.qty} {item.unit})</span>
                    <span>{formatCurrency(getItemTotal(item))}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-2 text-sm border-t app-border pt-3">
                <div className="flex justify-between"><span className="app-text-muted">Products Total</span><span>{formatCurrency(amounts.totalAmount)}</span></div>
                <div className="flex justify-between"><span className="app-text-muted">Transport</span><span>{formatCurrency(form.transportationCost)}</span></div>
                <div className="flex justify-between"><span className="app-text-muted">Other Expenses</span><span>{formatCurrency(form.otherExpenses)}</span></div>
                <div className="flex justify-between font-bold text-base border-t pt-2"><span>Final Amount</span><span className="text-primary-600">{formatCurrency(amounts.finalAmount)}</span></div>
                <div className="flex justify-between text-green-600"><span>Amount Paid</span><span>{formatCurrency(form.amountPaid)}</span></div>
                <div className="flex justify-between text-amber-600 font-medium"><span>Amount Pending</span><span>{formatCurrency(amounts.amountPending)}</span></div>
              </div>
              <div className="mt-6 flex gap-2">
                <Button type="button" variant="secondary" onClick={() => navigate('/purchases')}>Cancel</Button>
                <Button type="submit">Save Purchase</Button>
              </div>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
