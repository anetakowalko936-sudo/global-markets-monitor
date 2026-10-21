export const config = {
  port: Number(process.env.PORT ?? 3010),
  host: process.env.HOST ?? '0.0.0.0',
  quoteMaxAgeMs: Number(process.env.QUOTE_MAX_AGE_MS ?? 2000),
  minNetSpreadPct: Number(process.env.MIN_NET_SPREAD_PCT ?? 0.15),
  slippageBps: Number(process.env.SLIPPAGE_BPS ?? 5),

  validate() {
    if (!Number.isFinite(this.port) || this.port <= 0) {
      throw new Error('Krytyczny błąd: Nieprawidłowa wartość PORT w konfiguracji');
    }
    if (!Number.isFinite(this.quoteMaxAgeMs) || this.quoteMaxAgeMs <= 0) {
      throw new Error('Krytyczny błąd: Nieprawidłowy limit wieku danych (QUOTE_MAX_AGE_MS)');
    }
    return true;
  }
};

config.validate();
