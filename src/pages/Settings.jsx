import { useState } from 'react';
import { HiOutlineSave, HiOutlineCloudUpload, HiOutlineCloudDownload } from 'react-icons/hi';
import Swal from 'sweetalert2';
import { useApp } from '../context/AppContext';
import { PageHeader } from '../components/common/PageHeader';
import Card, { CardHeader } from '../components/common/Card';
import Button from '../components/common/Button';
import Tabs from '../components/common/Tabs';
import Accordion from '../components/common/Accordion';
import { FormField, Input, Textarea, Select } from '../components/common/FormField';
import { CURRENCIES, INVOICE_THEMES, INDIAN_STATES } from '../utils/constants';

export default function Settings() {
  const { settings, setSettings } = useApp();
  const [form, setForm] = useState({ ...settings });
  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSave = async () => {
    try {
      await setSettings(form);
      Swal.fire('Saved!', 'Settings updated successfully.', 'success');
    } catch (err) {
      Swal.fire('Error', err.message || 'Failed to save settings', 'error');
    }
  };

  const handleBackup = () => {
    const data = {};
    ['ip_customers', 'ip_suppliers', 'ip_products', 'ip_invoices', 'ip_bills', 'ip_settings'].forEach((key) => {
      data[key] = localStorage.getItem(key);
    });
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoicepro-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    Swal.fire('Backup Created!', 'Data exported successfully.', 'success');
  };

  const handleRestore = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        Object.entries(data).forEach(([key, value]) => { if (value) localStorage.setItem(key, value); });
        Swal.fire('Restored!', 'Data restored. Please refresh the page.', 'success').then(() => window.location.reload());
      } catch { Swal.fire('Error', 'Invalid backup file', 'error'); }
    };
    reader.readAsText(file);
  };

  const companyTab = (
    <div className="row g-4">
      <div className="col-12 col-md-6">
        <FormField label="Company Name"><Input value={form.companyName} onChange={(e) => update('companyName', e.target.value)} /></FormField>
        <FormField label="Address"><Textarea value={form.address} onChange={(e) => update('address', e.target.value)} rows={2} /></FormField>
        <FormField label="GST Number"><Input value={form.gst} onChange={(e) => update('gst', e.target.value)} /></FormField>
        <FormField label="State"><Select value={form.state} onChange={(e) => update('state', e.target.value)} options={INDIAN_STATES.map((s) => ({ value: s, label: s }))} /></FormField>
        <FormField label="Pincode"><Input value={form.pincode} onChange={(e) => update('pincode', e.target.value)} /></FormField>
      </div>
      <div className="col-12 col-md-6">
        <FormField label="Phone"><Input value={form.phone} onChange={(e) => update('phone', e.target.value)} /></FormField>
        <FormField label="Email"><Input value={form.email} onChange={(e) => update('email', e.target.value)} /></FormField>
        <FormField label="Bank Name"><Input value={form.bankName} onChange={(e) => update('bankName', e.target.value)} /></FormField>
        <FormField label="Account Number"><Input value={form.bankAccount} onChange={(e) => update('bankAccount', e.target.value)} /></FormField>
        <FormField label="IFSC Code"><Input value={form.bankIFSC} onChange={(e) => update('bankIFSC', e.target.value)} /></FormField>
        <FormField label="Branch"><Input value={form.bankBranch} onChange={(e) => update('bankBranch', e.target.value)} /></FormField>
      </div>
    </div>
  );

  const invoiceTab = (
    <div className="row g-4 max-w-2xl">
      <div className="col-12 col-md-6"><FormField label="Invoice Prefix"><Input value={form.invoicePrefix} onChange={(e) => update('invoicePrefix', e.target.value)} /></FormField></div>
      <div className="col-12 col-md-6"><FormField label="Currency"><Select value={form.currency} onChange={(e) => update('currency', e.target.value)} options={CURRENCIES} /></FormField></div>
      <div className="col-12 col-md-6"><FormField label="Invoice Theme"><Select value={form.theme} onChange={(e) => update('theme', e.target.value)} options={INVOICE_THEMES.map((t) => ({ value: t.id, label: t.label }))} /></FormField></div>
      <div className="col-12"><FormField label="Terms & Conditions"><Textarea value={form.terms} onChange={(e) => update('terms', e.target.value)} rows={3} /></FormField></div>
      <div className="col-12"><FormField label="Declaration"><Textarea value={form.declaration} onChange={(e) => update('declaration', e.target.value)} rows={3} /></FormField></div>
      <div className="col-12">
        <FormField label="Logo">
          <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files[0]; if (f) { const r = new FileReader(); r.onload = (ev) => update('logo', ev.target.result); r.readAsDataURL(f); } }} className="text-sm" />
          {form.logo && <img src={form.logo} alt="Logo" className="w-16 h-16 mt-2 object-contain rounded-lg border" />}
        </FormField>
      </div>
      <div className="col-12">
        <FormField label="Signature">
          <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files[0]; if (f) { const r = new FileReader(); r.onload = (ev) => update('signature', ev.target.result); r.readAsDataURL(f); } }} className="text-sm" />
          {form.signature && <img src={form.signature} alt="Signature" className="h-12 mt-2 object-contain" />}
        </FormField>
      </div>
    </div>
  );

  const taxTab = (
    <div className="max-w-lg space-y-4">
      <label className="flex items-center gap-3 cursor-pointer">
        <input type="checkbox" checked={form.gstEnabled} onChange={(e) => update('gstEnabled', e.target.checked)} className="rounded border-slate-300 text-primary-600" />
        <span className="text-sm font-medium">Enable GST Calculation</span>
      </label>
      <label className="flex items-center gap-3 cursor-pointer">
        <input type="checkbox" checked={form.cgstSgstSplit} onChange={(e) => update('cgstSgstSplit', e.target.checked)} className="rounded border-slate-300 text-primary-600" />
        <span className="text-sm font-medium">Split CGST / SGST for intra-state</span>
      </label>
    </div>
  );

  const backupTab = (
    <div className="max-w-lg space-y-4">
      <Card>
        <CardHeader title="Backup Data" subtitle="Export all data as JSON file" />
        <Button icon={HiOutlineCloudDownload} onClick={handleBackup}>Download Backup</Button>
      </Card>
      <Card>
        <CardHeader title="Restore Data" subtitle="Import from backup file" />
        <input type="file" accept=".json" onChange={handleRestore} className="text-sm" />
      </Card>
    </div>
  );

  const tabs = [
    { key: 'company', label: 'Company Profile', content: companyTab },
    { key: 'invoice', label: 'Invoice Settings', content: invoiceTab },
    { key: 'tax', label: 'Tax Settings', content: taxTab },
    { key: 'backup', label: 'Backup & Restore', content: backupTab },
  ];

  return (
    <div className="space-y-5">
      <PageHeader title="Settings" subtitle="Manage your application preferences" action={<Button icon={HiOutlineSave} onClick={handleSave}>Save Changes</Button>} />

      <Card>
        <Tabs tabs={tabs} defaultTab="company" />
      </Card>
    </div>
  );
}
