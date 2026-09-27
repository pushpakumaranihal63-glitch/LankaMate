import { SupportedCurrency } from '../types';

export interface CurrencyConfig {
  code: SupportedCurrency;
  symbol: string;
  name: string;
  flag: string;
  // Indicative rate relative to USD (1 USD = rate units of this currency)
  rateToUsd: number;
}

export const SUPPORTED_CURRENCIES: CurrencyConfig[] = [
  { code: 'LKR', symbol: 'Rs', name: 'Sri Lankan Rupee', flag: '🇱🇰', rateToUsd: 308.5 },
  { code: 'USD', symbol: '$', name: 'US Dollar', flag: '🇺🇸', rateToUsd: 1.0 },
  { code: 'EUR', symbol: '€', name: 'Euro', flag: '🇪🇺', rateToUsd: 0.92 },
  { code: 'GBP', symbol: '£', name: 'British Pound', flag: '🇬🇧', rateToUsd: 0.79 },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', flag: '🇯🇵', rateToUsd: 153.2 },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', flag: '🇨🇳', rateToUsd: 7.24 },
  { code: 'KRW', symbol: '₩', name: 'South Korean Won', flag: '🇰🇷', rateToUsd: 1370.0 },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', flag: '🇦🇺', rateToUsd: 1.54 },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', flag: '🇨🇦', rateToUsd: 1.38 },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', flag: '🇮🇳', rateToUsd: 83.5 },
  { code: 'AED', symbol: 'AED', name: 'UAE Dirham', flag: '🇦🇪', rateToUsd: 3.67 },
  { code: 'RUB', symbol: '₽', name: 'Russian Ruble', flag: '🇷🇺', rateToUsd: 92.4 },
];

export function formatCurrencyAmount(
  amountUsd: number,
  currency: SupportedCurrency
): string {
  const conf = SUPPORTED_CURRENCIES.find((c) => c.code === currency) || SUPPORTED_CURRENCIES[0];
  const converted = amountUsd * conf.rateToUsd;

  if (currency === 'LKR' || currency === 'JPY' || currency === 'KRW' || currency === 'RUB') {
    return `${conf.symbol} ${Math.round(converted).toLocaleString()}`;
  }
  return `${conf.symbol} ${converted.toFixed(2)}`;
}

export function convertLkrToCurrency(
  amountLkr: number,
  targetCurrency: SupportedCurrency
): { formatted: string; raw: number } {
  const usdRate = 308.5; // Benchmark LKR per USD
  const amountUsd = amountLkr / usdRate;
  const conf = SUPPORTED_CURRENCIES.find((c) => c.code === targetCurrency) || SUPPORTED_CURRENCIES[0];
  const converted = amountUsd * conf.rateToUsd;

  if (targetCurrency === 'LKR' || targetCurrency === 'JPY' || targetCurrency === 'KRW' || targetCurrency === 'RUB') {
    return {
      formatted: `${conf.symbol} ${Math.round(converted).toLocaleString()}`,
      raw: Math.round(converted),
    };
  }
  return {
    formatted: `${conf.symbol} ${converted.toFixed(2)}`,
    raw: parseFloat(converted.toFixed(2)),
  };
}
