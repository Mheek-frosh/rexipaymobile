/**
 * 10-digit RexiPay account number: prefer phone digits; otherwise derive from Clerk id + email.
 */
export function buildRexipayAccountNumber({ clerkUserId, phone, email }) {
  const digits = String(phone || '').replace(/\D/g, '');
  if (digits.length >= 10) {
    return digits.slice(-10);
  }
  if (digits.length > 0) {
    return digits.padStart(10, '0').slice(-10);
  }
  let h = 2166136261;
  const s = `${clerkUserId || ''}|${String(email || '').toLowerCase()}`;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const n = 1000000000 + (Math.abs(h) % 9000000000);
  return String(n).padStart(10, '0').slice(0, 10);
}
