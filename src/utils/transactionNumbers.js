export const getNextNumber = (items, prefix, field = 'number') => {
  const year = new Date().getFullYear();
  const pattern = new RegExp(`^${prefix}-${year}-(\\d+)$`);
  let max = 0;
  items.forEach((item) => {
    const num = item[field] || item.purchaseNumber || item.paymentNumber;
    const match = num?.match(pattern);
    if (match) max = Math.max(max, parseInt(match[1], 10));
  });
  return `${prefix}-${year}-${String(max + 1).padStart(4, '0')}`;
};

export const getNextPurchaseNumber = (purchases) =>
  getNextNumber(purchases, 'PUR', 'purchaseNumber');

export const getNextPaymentNumber = (payments, type = 'customer') =>
  getNextNumber(payments, type === 'customer' ? 'PAY' : 'SPAY', 'paymentNumber');
