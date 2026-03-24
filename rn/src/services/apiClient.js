import { API_BASE_URL } from '../config/apiConfig';

const DEFAULT_TIMEOUT = 12000;

const withTimeout = async (promise, ms = DEFAULT_TIMEOUT) => {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error('Request timed out')), ms);
  });
  try {
    return await Promise.race([promise, timeout]);
  } finally {
    clearTimeout(timer);
  }
};

const safeJson = async (res) => {
  try {
    return await res.json();
  } catch (_) {
    return null;
  }
};

export const apiGet = async (path) => {
  const url = `${API_BASE_URL}${path}`;
  try {
    const res = await withTimeout(
      fetch(url, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      })
    );
    const data = await safeJson(res);
    if (!res.ok) {
      return { success: false, error: data?.error || `HTTP ${res.status}` };
    }
    return { success: true, data };
  } catch (e) {
    return { success: false, error: e.message || 'Network error' };
  }
};

export const apiPost = async (path, body = {}) => {
  const url = `${API_BASE_URL}${path}`;
  try {
    const res = await withTimeout(
      fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(body),
      })
    );
    const data = await safeJson(res);
    if (!res.ok) {
      return { success: false, error: data?.error || `HTTP ${res.status}` };
    }
    return { success: true, data };
  } catch (e) {
    return { success: false, error: e.message || 'Network error' };
  }
};
