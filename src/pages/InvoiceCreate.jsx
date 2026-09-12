import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineArrowLeft, HiOutlineArrowRight, HiOutlineSave } from 'react-icons/hi';
import Swal from 'sweetalert2';
import { useApp } from '../context/AppContext';
import { getNextInvoiceNumber } from '../utils/invoiceNumber';
import { calculateInvoiceTotals, isInterStateTransaction } from '../utils/gstCalculator';
import { amountInWords } from '../utils/amountInWords';
import { formatCurrency } from '../utils/formatters';
import { PageHeader } from '../components/common/PageHeader';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Stepper from '../components/common/Stepper';
import { FormField, Input, Textarea, Select } from '../components/common/FormField';
import ProductTable from '../components/invoice/ProductTable';
import { INDIAN_STATES } from '../utils/constants';

const STEPS = [
  { key: 'company', label: 'Company' },
  { key: 'customer', label: 'Customer' },
  { key: 'products', label: 'Products' },
  { key: 'charges', label: 'Charges' },
];

const emptyItem = () => ({ id: Date.now(), product: '', productId: '', hsn: '', qty: 1, unit: 'Nos', price: 0, discount: 0, gst: 18 });

export default function InvoiceCreate() {
  const { settings, setSettings, customers, products, invoices, addInvoice } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    invoiceNumber: getNextInvoiceNumber(invoices, settings.invoicePrefix),
    invoiceDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    customerId: '', customerName: '', customerGst: '', customerPhone: '', customerEmail: '',
    billingAddress: '', shippingAddress: '', customerState: '',
    vehicleNumber: '', transportName: '',
    items: [emptyItem()],
    charges: { transport: 0, packing: 0, loading: 0, other: 0, discount: 0, roundOff: 0 },
    status: 'draft',
  });

  const isInterState = isInterStateTransaction(settings.state, form.customerState);
  const totals = calculateInvoiceTotals(form.items.filter((i) => i.product), form.charges, isInterState);

  const updateForm = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));
  const updateCharges = (field, value) => setForm((prev) => ({ ...prev, charges: { ...prev.charges, [field]: value } }));

  const selectCustomer = (customerId) => {
    const c = customers.find((x) => x.id === customerId);
    if (!c) return;
    setForm((prev) => ({
      ...prev,
      customerId: c.id,
      customerName: c.name,
      customerGst: c.gst,
      customerPhone: c.phone,
      customerEmail: c.email,
      billingAddress: c.billingAddress,
      shippingAddress: c.shippingAddress,
      customerState: c.state,
    }));
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setSettings({ ...settings, logo: ev.target.result });
      reader.readAsDataURL(file);
    }
  };

  const handleSignatureUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setSettings({ ...settings, signature: ev.target.result });
      reader.readAsDataURL(file);
    }
  };

  const saveDraft = useCallback(() => {
    localStorage.setItem('ip_invoice_draft', JSON.stringify(form));
  }, [form]);

  useEffect(() => {
    const interval = setInterval(saveDraft, 30000);
    return () => clearInterval(interval);
  }, [saveDraft]);

  const handleSubmit = async (status = 'sent') => {
    try {
      const invoice = await addInvoice({ ...form, isInterState, status, totals });
      Swal.fire({
        title: 'Invoice Created!',
        text: `${invoice.invoiceNumber} — Choose a format to preview & download`,
        icon: 'success',
        confirmButtonColor: '#1a5fb8',
      });
      localStorage.removeItem('ip_invoice_draft');
      navigate(`/invoices/${invoice.id}`, { state: { format: 'tally', justCreated: true } });
    } catch (err) {
      Swal.fire('Error', err.message || 'Failed to create invoice', 'error');
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="row g-4">
            <div className="col-12 col-md-6">
              <FormField label="Company Logo">
                <div className="flex items-center gap-4">
                  {settings.logo && <img src={settings.logo} alt="Logo" className="w-16 h-16 object-contain rounded-lg border" />}
                  <input type="file" accept="image/*" onChange={handleLogoUpload} className="text-sm" />
                </div>
              </FormField>
              <FormField label="Company Name"><Input value={settings.companyName} onChange={(e) => setSettings({ ...settings, companyName: e.target.value })} /></FormField>
              <FormField label="Address"><Textarea value={settings.address} onChange={(e) => setSettings({ ...settings, address: e.target.value })} rows={2} /></FormField>
              <FormField label="GST Number"><Input value={settings.gst} onChange={(e) => setSettings({ ...settings, gst: e.target.value })} /></FormField>
            </div>
            <div className="col-12 col-md-6">
              <FormField label="Phone"><Input value={settings.phone} onChange={(e) => setSettings({ ...settings, phone: e.target.value })} /></FormField>
              <FormField label="Email"><Input value={settings.email} onChange={(e) => setSettings({ ...settings, email: e.target.value })} /></FormField>
              <FormField label="Bank Details"><Textarea value={`${settings.bankName}\nA/C: ${settings.bankAccount}\nIFSC: ${settings.bankIFSC}`} rows={3} readOnly className="bg-slate-50" /></FormField>
              <FormField label="Terms & Conditions"><Textarea value={settings.terms} onChange={(e) => setSettings({ ...settings, terms: e.target.value })} rows={2} /></FormField>
              <FormField label="Declaration"><Textarea value={settings.declaration} onChange={(e) => setSettings({ ...settings, declaration: e.target.value })} rows={2} /></FormField>
              <FormField label="Signature">
                <div className="flex items-center gap-4">
                  {settings.signature && <img src={settings.signature} alt="Signature" className="h-12 object-contain" />}
                  <input type="file" accept="image/*" onChange={handleSignatureUpload} className="text-sm" />
                </div>
              </FormField>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="row g-4">
            <div className="col-12 col-md-6">
              <FormField label="Search Customer" required>
                <Select
                  options={[{ value: '', label: 'Select customer' }, ...customers.map((c) => ({ value: c.id, label: c.name }))]}
                  value={form.customerId}
                  onChange={(e) => selectCustomer(e.target.value)}
                />
              </FormField>
              <FormField label="Customer Name"><Input value={form.customerName} onChange={(e) => updateForm('customerName', e.target.value)} /></FormField>
              <FormField label="GST Number"><Input value={form.customerGst} onChange={(e) => updateForm('customerGst', e.target.value)} /></FormField>
              <FormField label="Phone"><Input value={form.customerPhone} onChange={(e) => updateForm('customerPhone', e.target.value)} /></FormField>
              <FormField label="Email"><Input value={form.customerEmail} onChange={(e) => updateForm('customerEmail', e.target.value)} /></FormField>
            </div>
            <div className="col-12 col-md-6">
              <FormField label="Billing Address"><Textarea value={form.billingAddress} onChange={(e) => updateForm('billingAddress', e.target.value)} rows={2} /></FormField>
              <FormField label="Shipping Address"><Textarea value={form.shippingAddress} onChange={(e) => updateForm('shippingAddress', e.target.value)} rows={2} /></FormField>
              <FormField label="State"><Select options={INDIAN_STATES.map((s) => ({ value: s, label: s }))} value={form.customerState} onChange={(e) => updateForm('customerState', e.target.value)} /></FormField>
              <FormField label="Vehicle Number"><Input value={form.vehicleNumber} onChange={(e) => updateForm('vehicleNumber', e.target.value)} /></FormField>
              <FormField label="Transport Name"><Input value={form.transportName} onChange={(e) => updateForm('transportName', e.target.value)} /></FormField>
              <div className="row g-3">
                <div className="col-4"><FormField label="Invoice #"><Input value={form.invoiceNumber} readOnly className="bg-slate-50 font-mono" /></FormField></div>
                <div className="col-4"><FormField label="Invoice Date"><Input type="date" value={form.invoiceDate} onChange={(e) => updateForm('invoiceDate', e.target.value)} /></FormField></div>
                <div className="col-4"><FormField label="Due Date"><Input type="date" value={form.dueDate} onChange={(e) => updateForm('dueDate', e.target.value)} /></FormField></div>
              </div>
            </div>
          </div>
        );
      case 2:
        return <ProductTable items={form.items} onChange={(items) => updateForm('items', items)} products={products} />;
      case 3:
        return (
          <div className="row g-4">
            <div className="col-12 col-md-6">
              <h4 className="font-semibold text-slate-700 dark:text-slate-200 mb-3">Additional Charges</h4>
              {['transport', 'packing', 'loading', 'other', 'discount'].map((field) => (
                <FormField key={field} label={field.charAt(0).toUpperCase() + field.slice(1)}>
                  <Input type="number" value={form.charges[field]} onChange={(e) => updateCharges(field, e.target.value)} />
                </FormField>
              ))}
              <FormField label="Round Off">
                <Input type="number" value={form.charges.roundOff} onChange={(e) => updateCharges('roundOff', e.target.value)} step="0.01" />
              </FormField>
            </div>
            <div className="col-12 col-md-6">
              <div className="bg-gray-50 border border-gray-200 rounded-md p-4 space-y-2">
                <h4 className="font-medium text-gray-900 mb-2">Tax Summary</h4>
                <div className="flex justify-between text-sm"><span>Subtotal</span><span>{formatCurrency(totals.subtotal)}</span></div>
                <div className="flex justify-between text-sm"><span>Taxable Amount</span><span>{formatCurrency(totals.totalTaxable)}</span></div>
                {isInterState ? (
                  <div className="flex justify-between text-sm"><span>IGST</span><span>{formatCurrency(totals.igst)}</span></div>
                ) : (
                  <>
                    <div className="flex justify-between text-sm"><span>CGST</span><span>{formatCurrency(totals.cgst)}</span></div>
                    <div className="flex justify-between text-sm"><span>SGST</span><span>{formatCurrency(totals.sgst)}</span></div>
                  </>
                )}
                <div className="flex justify-between text-sm"><span>Total GST</span><span>{formatCurrency(totals.totalGst)}</span></div>
                <div className="flex justify-between text-lg font-bold border-t border-slate-200 pt-2 mt-2">
                  <span>Grand Total</span><span className="text-primary-600">{formatCurrency(totals.grandTotal)}</span>
                </div>
                <p className="text-xs text-slate-500 italic mt-2">{amountInWords(totals.grandTotal)}</p>
              </div>
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Create Invoice"
        subtitle={`Step ${step + 1} of ${STEPS.length}`}
        action={<Button variant="secondary" size="sm" icon={HiOutlineSave} onClick={saveDraft}>Save Draft</Button>}
      />

      <Card>
        <Stepper steps={STEPS} currentStep={step} />
        {renderStep()}
        <div className="flex justify-between mt-6 pt-4 border-t border-gray-200">
          <Button variant="secondary" icon={HiOutlineArrowLeft} onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>Previous</Button>
          <div className="flex gap-2">
            {step < STEPS.length - 1 ? (
              <Button iconRight={HiOutlineArrowRight} onClick={() => setStep(step + 1)}>Next</Button>
            ) : (
              <>
                <Button variant="secondary" onClick={() => handleSubmit('draft')}>Save as Draft</Button>
                <Button onClick={() => handleSubmit('sent')}>Create Invoice</Button>
              </>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
