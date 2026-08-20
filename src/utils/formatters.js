import dayjs from 'dayjs';

export const formatCurrency = (amount, currency = 'INR') => {
  const symbols = { INR: '₹', USD: '$', EUR: '€', GBP: '£' };
  const symbol = symbols[currency] || '₹';
  const num = Number(amount) || 0;
  return `${symbol}${num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const formatDate = (date, format = 'DD MMM YYYY') => {
  if (!date) return '—';
  return dayjs(date).format(format);
};

export const formatPhone = (phone) => {
  if (!phone) return '—';
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  }
  return phone;
};

export const truncate = (str, len = 30) => {
  if (!str) return '';
  return str.length > len ? `${str.slice(0, len)}...` : str;
};

export const generateId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

export const debounce = (fn, delay = 300) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

export const downloadBlob = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

export const exportToCSV = (data, filename) => {
  if (!data.length) return;
  const headers = Object.keys(data[0]);
  const csv = [
    headers.join(','),
    ...data.map((row) =>
      headers.map((h) => `"${String(row[h] ?? '').replace(/"/g, '""')}"`).join(',')
    ),
  ].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  downloadBlob(blob, `${filename}.csv`);
};
