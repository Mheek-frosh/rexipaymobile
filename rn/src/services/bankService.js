import { API_BASE_URL } from '../config/apiConfig';

export const resolveAccount = async (accountNumber, bankCode) => {
  try {
    const cleanAccount = String(accountNumber).replace(/\D/g, '');
    const res = await fetch(`${API_BASE_URL}/api/bank/resolve-account`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        account_number: cleanAccount,
        account_bank: String(bankCode),
      }),
    });
    const data = await res.json();
    if (res.ok && data.success) {
      return { success: true, accountName: data.account_name || '' };
    }
    return {
      success: false,
      error: data.error || 'Could not resolve account',
    };
  } catch (e) {
    return { success: false, error: e.toString() };
  }
};
