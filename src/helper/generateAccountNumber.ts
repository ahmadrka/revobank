export function generateAccountNumber(): string {
  // contoh: 12 digit numeric
  return Math.floor(100000000000 + Math.random() * 900000000000).toString();
}
