// src/adapters/kucoin.js
import { fetchJson } from './http.js';

export async function fetchKucoinQuote(symbol = 'BTC-USDT', canonicalSymbol = 'BTCUSDT') {
  const url = `https://api.kucoin.com/api/v1/market/orderbook/level1?symbol=${symbol}`;
  const data = await fetchJson(url);
  
  const ticker = data.data;
  if (!ticker) throw new Error('Brak danych notowania KuCoin');

  const bid = Number(ticker.bid);
  const ask = Number(ticker.ask);

  if (!Number.isFinite(bid) || !Number.isFinite(ask) || bid <= 0 || ask < bid) {
    throw new Error('Nieprawidłowe kwotowanie KuCoin');
  }

  return {
    exchange: 'kucoin',
    symbol: canonicalSymbol,
    bid,
    ask,
    retrievedAt: Date.now()
  };
}
