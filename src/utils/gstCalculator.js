export const calculateLineItem = (item) => {
  const qty = Number(item.qty) || 0;
  const price = Number(item.price) || 0;
  const discount = Number(item.discount) || 0;
  const gstRate = Number(item.gst) || 0;

  const subtotal = qty * price;
  const discountAmount = (subtotal * discount) / 100;
  const taxable = subtotal - discountAmount;
  const gstAmount = (taxable * gstRate) / 100;
  const total = taxable + gstAmount;

  return {
    subtotal,
    discountAmount,
    taxable,
    gstAmount,
    total,
    cgst: gstAmount / 2,
    sgst: gstAmount / 2,
    igst: gstAmount,
  };
};

export const calculateInvoiceTotals = (items, charges = {}, isInterState = false) => {
  let subtotal = 0;
  let totalDiscount = 0;
  let totalTaxable = 0;
  let totalGst = 0;
  let cgst = 0;
  let sgst = 0;
  let igst = 0;

  const gstBreakdown = {};

  items.forEach((item) => {
    const calc = calculateLineItem(item);
    subtotal += calc.subtotal;
    totalDiscount += calc.discountAmount;
    totalTaxable += calc.taxable;
    totalGst += calc.gstAmount;

    const rate = Number(item.gst) || 0;
    if (!gstBreakdown[rate]) gstBreakdown[rate] = { taxable: 0, cgst: 0, sgst: 0, igst: 0, total: 0 };
    gstBreakdown[rate].taxable += calc.taxable;
    gstBreakdown[rate].total += calc.gstAmount;

    if (isInterState) {
      igst += calc.gstAmount;
      gstBreakdown[rate].igst += calc.gstAmount;
    } else {
      cgst += calc.cgst;
      sgst += calc.sgst;
      gstBreakdown[rate].cgst += calc.cgst;
      gstBreakdown[rate].sgst += calc.sgst;
    }
  });

  const transport = Number(charges.transport) || 0;
  const packing = Number(charges.packing) || 0;
  const loading = Number(charges.loading) || 0;
  const other = Number(charges.other) || 0;
  const invoiceDiscount = Number(charges.discount) || 0;
  const roundOff = Number(charges.roundOff) || 0;

  const chargesTotal = transport + packing + loading + other;
  const grandTotal = totalTaxable + totalGst + chargesTotal - invoiceDiscount + roundOff;

  return {
    subtotal,
    totalDiscount,
    totalTaxable,
    totalGst,
    cgst,
    sgst,
    igst,
    transport,
    packing,
    loading,
    other,
    invoiceDiscount,
    roundOff,
    chargesTotal,
    grandTotal,
    gstBreakdown,
  };
};

export const isInterStateTransaction = (companyState, customerState) => {
  if (!companyState || !customerState) return false;
  return companyState.toLowerCase() !== customerState.toLowerCase();
};
