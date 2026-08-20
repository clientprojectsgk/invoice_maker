export const generateInvoiceNumber = (prefix = 'INV', year = new Date().getFullYear(), sequence = 1) => {
  const padded = String(sequence).padStart(6, '0');
  return `${prefix}-${year}-${padded}`;
};

export const getNextInvoiceNumber = (invoices, prefix = 'INV') => {
  const year = new Date().getFullYear();
  const yearInvoices = invoices.filter((inv) => {
    const match = inv.invoiceNumber?.match(new RegExp(`${prefix}-${year}-(\\d+)`));
    return !!match;
  });

  let maxSeq = 0;
  yearInvoices.forEach((inv) => {
    const match = inv.invoiceNumber.match(new RegExp(`${prefix}-${year}-(\\d+)`));
    if (match) {
      const seq = parseInt(match[1], 10);
      if (seq > maxSeq) maxSeq = seq;
    }
  });

  return generateInvoiceNumber(prefix, year, maxSeq + 1);
};
