// src/adapters/mexc.js
import { fetchJson } from './http.js';

export async function fetchMexcQuote(symbol = 'BTCUSDT') {
  const url = `https://www.mexc.com/open/api/v2/market/ticker?symbol=${symbol}`;
  const data = await fetchJson(url);
  
  const ticker = data.data?.[0];
  if (!ticker) throw new Error('Brak danych notowania MEXC');

  const bid = Number(ticker.bid);
  const ask = Number(ticker.ask);

  if (!Number.isFinite(bid) || !Number.isFinite(ask) || bid <= 0 || ask < bid) {
    throw new Error('Nieprawidłowe kwotowanie MEXC');
  }

  return {
    exchange: 'mexc',
    symbol,
    bid,
    ask,
    retrievedAt: Date.now()
  };
}
