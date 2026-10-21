import http from 'node:http';
import { config } from './src/config.js';
import { detectOpportunities } from './src/engine/opportunity.js';

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    if (url.pathname === '/health' && req.method === 'GET') {
      res.writeHead(200);
      return res.end(JSON.stringify({ status: 'OK', timestamp: new Date().toISOString() }));
    }

    if (url.pathname === '/opportunity' && req.method === 'GET') {
      const mockQuotes = [
        { exchange: 'binance', symbol: 'BTCUSDT', bid: 81400, ask: 81410, retrievedAt: Date.now() },
        { exchange: 'kraken', symbol: 'BTCUSDT', bid: 81550, ask: 81560, retrievedAt: Date.now() }
      ];

      const feeMap = { binance: 0.001, kraken: 0.0016 };
      const opportunities = detectOpportunities(mockQuotes, {
        feeByExchange: feeMap,
        slippageBps: config.slippageBps,
        minNetSpreadPct: config.minNetSpreadPct,
        maxAgeMs: config.quoteMaxAgeMs
      });

      res.writeHead(200);
      return res.end(JSON.stringify({ success: true, count: opportunities.length, data: opportunities }));
    }

    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Endpoint nie istnieje' }));
  } catch (err) {
    res.writeHead(500);
    res.end(JSON.stringify({ error: 'Błąd wewnętrzny serwera', details: err.message }));
  }
});

server.listen(config.port, config.host, () => {
  console.log(`Krypto AI Backend uruchomiony na http://${config.host}:${config.port}`);
});
