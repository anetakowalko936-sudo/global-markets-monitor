// src/adapters/bybit.js
import { fetchJson } from './http.js';

export async function fetchBybitQuote(symbol = 'BTCUSDT') {
  const url = `https://api.bybit.com/v5/market/tickers?category=spot&symbol=${symbol}`;
  const data = await fetchJson(url);
  
  const ticker = data.result?.list?.[0];
  if (!ticker) throw new Error('Brak danych notowania Bybit');

  const bid = Number(ticker.bid1Price);
  const ask = Number(ticker.ask1Price);

  if (!Number.isFinite(bid) || !Number.isFinite(ask) || bid <= 0 || ask < bid) {
    throw new Error('Nieprawidłowe kwotowanie Bybit');
  }

  return {
    exchange: 'bybit',
    symbol,
    bid,
    ask,
    retrievedAt: Date.now()
  };
}
