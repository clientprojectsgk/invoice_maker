/** Keys the API keeps in camelCase inside nested objects. */
const PRESERVE_KEYS = new Set([
  'roundOff',
  'invoiceId',
  'invoiceNumber',
  'purchaseId',
  'purchaseNumber',
]);

/** Non-standard field mappings (snake_case API ↔ frontend camelCase). */
const FROM_API = { bank_ifsc: 'bankIFSC' };
const TO_API = { bankIFSC: 'bank_ifsc' };

const isPlainObject = (v) => v !== null && typeof v === 'object' && !Array.isArray(v) && !(v instanceof Date);

const toSnakeKey = (key) => {
  if (PRESERVE_KEYS.has(key)) return key;
  if (TO_API[key]) return TO_API[key];
  return key.replace(/([A-Z])/g, '_$1').replace(/^_/, '').toLowerCase();
};

const toCamelKey = (key) => {
  if (PRESERVE_KEYS.has(key)) return key;
  if (FROM_API[key]) return FROM_API[key];
  return key.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
};

export const keysToSnake = (obj) => {
  if (Array.isArray(obj)) return obj.map(keysToSnake);
  if (!isPlainObject(obj)) return obj;
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [toSnakeKey(k), keysToSnake(v)])
  );
};

export const keysToCamel = (obj) => {
  if (Array.isArray(obj)) return obj.map(keysToCamel);
  if (!isPlainObject(obj)) return obj;
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [toCamelKey(k), keysToCamel(v)])
  );
};
