export const INVOICE_FORMATS = [
  { id: 'classic', label: 'Classic', description: 'Clean professional layout' },
  { id: 'tally', label: 'Tally Grid', description: 'GST grid format like Tally' },
  { id: 'modern', label: 'Modern', description: 'Minimal SaaS style' },
];

export const getStateCode = (state) => {
  const codes = {
    'Maharashtra': '27', 'Gujarat': '24', 'Karnataka': '29', 'Delhi': '07',
    'Tamil Nadu': '33', 'Telangana': '36', 'Uttar Pradesh': '09', 'West Bengal': '19',
    'Rajasthan': '08', 'Punjab': '03', 'Haryana': '06', 'Madhya Pradesh': '23',
    'Kerala': '32', 'Andhra Pradesh': '37', 'Bihar': '10', 'Odisha': '21',
  };
  return codes[state] || '—';
};

export const calcLineAmount = (item) => {
  const qty = Number(item.qty) || 0;
  const price = Number(item.price) || 0;
  const discount = Number(item.discount) || 0;
  const taxable = qty * price * (1 - discount / 100);
  const gstAmt = taxable * (Number(item.gst) || 0) / 100;
  return { taxable, gstAmt, total: taxable + gstAmt };
};
