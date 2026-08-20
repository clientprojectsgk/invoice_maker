const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
  'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

const convertHundreds = (num) => {
  let str = '';
  if (num > 99) {
    str += ones[Math.floor(num / 100)] + ' Hundred ';
    num %= 100;
  }
  if (num > 19) {
    str += tens[Math.floor(num / 10)] + ' ';
    num %= 10;
  }
  if (num > 0) {
    str += ones[num] + ' ';
  }
  return str.trim();
};

const convertToWords = (num) => {
  if (num === 0) return 'Zero';

  const crore = Math.floor(num / 10000000);
  const lakh = Math.floor((num % 10000000) / 100000);
  const thousand = Math.floor((num % 100000) / 1000);
  const hundred = num % 1000;

  let result = '';
  if (crore) result += convertHundreds(crore) + ' Crore ';
  if (lakh) result += convertHundreds(lakh) + ' Lakh ';
  if (thousand) result += convertHundreds(thousand) + ' Thousand ';
  if (hundred) result += convertHundreds(hundred);

  return result.trim();
};

export const amountInWords = (amount) => {
  const num = Math.abs(Number(amount) || 0);
  const rupees = Math.floor(num);
  const paise = Math.round((num - rupees) * 100);

  let words = convertToWords(rupees);
  words = words ? `${words} Rupees` : 'Zero Rupees';

  if (paise > 0) {
    words += ` and ${convertToWords(paise)} Paise`;
  }

  return words + ' Only';
};
