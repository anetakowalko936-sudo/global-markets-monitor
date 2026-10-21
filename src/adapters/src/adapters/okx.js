// src/adapters/okx.js
import { fetchJson } from './http.js';

export async function fetchOkxQuote(symbol = 'BTC-USDT', canonicalSymbol = 'BTCUSDT') {
  const url = `https://www.okx.com/api/v5/market/ticker?instId=${symbol}`;
  const data = await fetchJson(url);
  
  const ticker = data.data?.[0];
  if (!ticker) throw new Error('Brak danych notowania OKX');

  const bid = Number(ticker.bidPx);
  const ask = Number(ticker.askPx);

  if (!Number.isFinite(bid) || !Number.isFinite(ask) || bid <= 0 || ask < bid) {
    throw new Error('Nieprawidłowe kwotowanie OKX');
  }

  return {
    exchange: 'okx',
    symbol: canonicalSymbol,
    bid,
    ask,
    retrievedAt: Date.now()
  };
}
