import {
  PaymentMethodType,
  PaymentStatus,
  PaymentTransaction,
  SupportedCurrency,
} from '../types';

export interface CreateOrderParams {
  amount: number;
  currency: SupportedCurrency;
  bookingTitle: string;
  customerName: string;
  customerEmail: string;
  paymentMethod: PaymentMethodType;
  mode: 'demo' | 'live';
}

export async function createPaymentOrder(
  params: CreateOrderParams
): Promise<PaymentTransaction> {
  const response = await fetch('/api/payment/create-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw new Error(`Failed to initialize payment order: ${response.statusText}`);
  }

  const data = await response.json();
  return data.transaction;
}

export async function processDemoPayment(
  orderId: string,
  simulateResult: 'success' | 'failed' = 'success'
): Promise<PaymentTransaction> {
  const response = await fetch('/api/payment/confirm-demo', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderId, simulateResult }),
  });

  if (!response.ok) {
    throw new Error(`Payment processing error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.transaction;
}

export async function getPaymentOrderStatus(
  orderId: string
): Promise<PaymentTransaction> {
  const response = await fetch(`/api/payment/order/${encodeURIComponent(orderId)}`);
  if (!response.ok) {
    throw new Error(`Could not fetch order status`);
  }
  const data = await response.json();
  return data.transaction;
}

export function isApplePayAvailable(): boolean {
  if (typeof window === 'undefined') return false;
  return !!(window as any).ApplePaySession && (window as any).ApplePaySession.canMakePayments();
}

export function isGooglePayAvailable(): boolean {
  if (typeof window === 'undefined') return false;
  return !!(window as any).PaymentRequest;
}
