export function detectOpportunities(
  quotes,
  {
    feeByExchange = {},
    slippageBps = 5,
    maxAgeMs = 2000,
    minNetSpreadPct = 0.15,
    now = Date.now()
  } = {}
) {
  const groups = new Map();

  for (const q of quotes) {
    if (!q || typeof q.exchange !== 'string' || typeof q.symbol !== 'string') continue;

    const age = now - q.retrievedAt;
    if (
      !Number.isFinite(q.bid) ||
      !Number.isFinite(q.ask) ||
      q.bid <= 0 ||
      q.ask < q.bid ||
      !Number.isFinite(age) ||
      age < 0 ||
      age > maxAgeMs
    ) {
      continue;
    }

    if (!groups.has(q.symbol)) {
      groups.set(q.symbol, []);
    }
    groups.get(q.symbol).push(q);
  }

  const results = [];
  const slippageRate = slippageBps / 10000;

  for (const [symbol, marketQuotes] of groups) {
    for (const buy of marketQuotes) {
      for (const sell of marketQuotes) {
        if (buy.exchange === sell.exchange) continue;

        const buyFee = feeByExchange[buy.exchange];
        const sellFee = feeByExchange[sell.exchange];

        if (
          !Number.isFinite(buyFee) ||
          !Number.isFinite(sellFee) ||
          buyFee < 0 ||
          sellFee < 0 ||
          buyFee >= 1 ||
          sellFee >= 1
        ) {
          continue;
        }

        const buyCost = buy.ask * (1 + buyFee + slippageRate);
        const sellProceeds = sell.bid * (1 - sellFee - slippageRate);

        const grossSpreadPct = (sell.bid / buy.ask - 1) * 100;
        const netSpreadPct = (sellProceeds / buyCost - 1) * 100;

        if (netSpreadPct < minNetSpreadPct) continue;

        results.push({
          type: 'cross-exchange-spread',
          symbol,
          buyExchange: buy.exchange,
          sellExchange: sell.exchange,
          buyAsk: buy.ask,
          sellBid: sell.bid,
          grossSpreadPct,
          estimatedNetSpreadPct: netSpreadPct,
          detectedAt: new Date(now).toISOString(),
          status: 'SIMULATION_ONLY'
        });
      }
    }
  }

  return results.sort((a, b) => b.estimatedNetSpreadPct - a.estimatedNetSpreadPct);
}
