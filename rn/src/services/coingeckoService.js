/**
 * CoinGecko public API — prices, sparklines, and official coin images.
 * Docs: https://www.coingecko.com/en/api/documentation
 */

const BASE = 'https://api.coingecko.com/api/v3';

const headers = {
  Accept: 'application/json',
  'User-Agent': 'RexiPay-Mobile/1.0',
};

async function parseJson(res) {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }
  return res.json();
}

/** Top coins by market cap with 7d sparkline (for market list & home preview). */
export async function fetchMarkets({ perPage = 25, page = 1, ids = null } = {}) {
  const params = new URLSearchParams({
    vs_currency: 'usd',
    order: 'market_cap_desc',
    per_page: String(perPage),
    page: String(page),
    sparkline: 'true',
    price_change_percentage: '24h',
  });
  if (ids) {
    params.set('ids', ids);
  }
  const url = `${BASE}/coins/markets?${params.toString()}`;
  const res = await fetch(url, { headers });
  return parseJson(res);
}

/** Single coin: chart data, market stats, description snippet. */
export async function fetchCoinDetail(coinId) {
  const params = new URLSearchParams({
    localization: 'false',
    tickers: 'false',
    market_data: 'true',
    community_data: 'false',
    developer_data: 'false',
    sparkline: 'true',
  });
  const url = `${BASE}/coins/${encodeURIComponent(coinId)}?${params.toString()}`;
  const res = await fetch(url, { headers });
  return parseJson(res);
}

export function formatUsd(n) {
  if (n == null || Number.isNaN(n)) return '—';
  if (n >= 1) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: n >= 100 ? 2 : 4,
    }).format(n);
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 8,
  }).format(n);
}

export function formatCompactUsd(n) {
  if (n == null || Number.isNaN(n)) return '—';
  if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`;
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(2)}K`;
  return formatUsd(n);
}
