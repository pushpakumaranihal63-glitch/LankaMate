import React, { useState } from 'react';
import {
  X,
  CreditCard,
  Building,
  QrCode,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Receipt,
  Download,
  Info,
} from 'lucide-react';
import {
  PaymentMethodType,
  PaymentStatus,
  PaymentTransaction,
  SupportedCurrency,
} from '../types';
import { useTranslation } from '../i18n/LanguageContext';
import { formatCurrencyAmount } from '../utils/currency';
import {
  createPaymentOrder,
  processDemoPayment,
  isApplePayAvailable,
  isGooglePayAvailable,
} from '../services/paymentService';

interface PaymentMethodsModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingTitle: string;
  amountUsd: number;
  customerName?: string;
  customerEmail?: string;
  onPaymentComplete?: (transaction: PaymentTransaction) => void;
}

export const PaymentMethodsModal: React.FC<PaymentMethodsModalProps> = ({
  isOpen,
  onClose,
  bookingTitle,
  amountUsd,
  customerName = 'Valued Traveler',
  customerEmail = 'guest@lankamate.lk',
  onPaymentComplete,
}) => {
  const { t, language } = useTranslation();

  // Mode: Demo Sandbox vs Live Gateway Prepared
  const [paymentMode, setPaymentMode] = useState<'demo' | 'live'>('demo');
  const [selectedCurrency, setSelectedCurrency] = useState<SupportedCurrency>('USD');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('visa');

  // Card Form State
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('888');
  const [cardholder, setCardholder] = useState(customerName);

  // Status & Transactions
  const [status, setStatus] = useState<PaymentStatus>('Pending');
  const [activeTransaction, setActiveTransaction] = useState<PaymentTransaction | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSimulatePayment = async (simulateResult: 'success' | 'failed') => {
    setIsProcessing(true);
    setStatus('Processing');
    setErrorMessage(null);

    try {
      // 1. Create order on backend
      const order = await createPaymentOrder({
        amount: amountUsd,
        currency: selectedCurrency,
        bookingTitle,
        customerName: cardholder || customerName,
        customerEmail,
        paymentMethod,
        mode: paymentMode,
      });

      // Artificial small delay to reflect real gateway network interaction
      await new Promise((r) => setTimeout(r, 900));

      if (paymentMode === 'live') {
        setIsProcessing(false);
        setStatus('Pending');
        setErrorMessage(
          'Live Gateway architecture is prepared. Connect production merchant keys (Stripe, PayHere, Commercial Bank IPG) on server environment. Switch to "Demo Sandbox" to simulate immediate confirmation.'
        );
        return;
      }

      // 2. Confirm Demo Payment on backend
      const confirmedTx = await processDemoPayment(order.orderId, simulateResult);
      setIsProcessing(false);
      setStatus(confirmedTx.status);
      setActiveTransaction(confirmedTx);

      if (confirmedTx.status === 'Successful') {
        onPaymentComplete?.(confirmedTx);
      } else {
        setErrorMessage(
          confirmedTx.failureReason || 'Simulated card decline. Please try again.'
        );
      }
    } catch (err: any) {
      setIsProcessing(false);
      setStatus('Failed');
      setErrorMessage(err.message || 'Payment system error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative my-8 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full text-stone-600 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="pr-10 mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>{t('payment.title')}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-stone-900">
            {bookingTitle}
          </h2>
          <p className="text-xs text-stone-600 mt-1">
            {t('payment.subtitle')}
          </p>
        </div>

        {/* Success View / Electronic Receipt */}
        {status === 'Successful' && activeTransaction ? (
          <div className="space-y-6 text-center py-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h3 className="text-2xl font-black text-stone-900">
                {t('payment.successTitle')}
              </h3>
              <p className="text-sm text-stone-600 mt-1">
                {t('payment.successDesc')}
              </p>
            </div>

            {/* Official Receipt Card */}
            <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200 text-left space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                <div className="flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-emerald-700" />
                  <span className="font-bold text-xs uppercase text-stone-600">
                    {t('payment.receipt')}
                  </span>
                </div>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                  {activeTransaction.mode === 'demo' ? 'DEMO SIMULATION' : 'CONFIRMED'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-stone-600 block">{t('payment.transactionId')}</span>
                  <span className="font-mono font-bold text-stone-800">{activeTransaction.id}</span>
                </div>
                <div>
                  <span className="text-stone-600 block">Gateway Auth Ref</span>
                  <span className="font-mono font-bold text-stone-800">{activeTransaction.gatewayRef || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-stone-600 block">Amount Paid</span>
                  <span className="font-bold text-stone-900 text-sm">
                    {formatCurrencyAmount(amountUsd, selectedCurrency)}
                  </span>
                </div>
                <div>
                  <span className="text-stone-600 block">Payment Method</span>
                  <span className="font-bold text-stone-800 uppercase">{activeTransaction.paymentMethod}</span>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-4 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
            >
              {t('payment.closeReceipt')}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Mode Switcher: Demo Sandbox vs Live Architecture */}
            <div className="bg-stone-100 p-1.5 rounded-2xl flex items-center">
              <button
                type="button"
                onClick={() => setPaymentMode('demo')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  paymentMode === 'demo'
                    ? 'bg-white text-emerald-900 shadow-sm'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>{t('payment.demoModeBadge')}</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMode('live')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  paymentMode === 'live'
                    ? 'bg-white text-stone-900 shadow-sm'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>{t('payment.liveModeBadge')}</span>
              </button>
            </div>

            <div className="text-[11px] text-stone-600 px-1">
              {paymentMode === 'demo' ? t('payment.demoDesc') : t('payment.liveDesc')}
            </div>

            {/* Error Notice */}
            {errorMessage && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>{errorMessage}</div>
              </div>
            )}

            {/* Amount and Currency Display */}
            <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 flex items-center justify-between">
              <div>
                <span className="text-xs text-stone-600 block">Total Due</span>
                <span className="text-2xl font-black text-stone-900">
                  {formatCurrencyAmount(amountUsd, selectedCurrency)}
                </span>
              </div>

              <div>
                <span className="text-[11px] font-bold text-stone-600 block mb-1">Currency</span>
                <select
                  value={selectedCurrency}
                  onChange={(e) => setSelectedCurrency(e.target.value as SupportedCurrency)}
                  className="bg-white border border-stone-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-stone-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="USD">$ USD</option>
                  <option value="LKR">Rs LKR (Sri Lanka)</option>
                  <option value="EUR">€ EUR</option>
                  <option value="GBP">£ GBP</option>
                  <option value="JPY">¥ JPY</option>
                  <option value="CNY">¥ CNY</option>
                  <option value="KRW">₩ KRW</option>
                  <option value="AUD">A$ AUD</option>
                  <option value="CAD">C$ CAD</option>
                  <option value="INR">₹ INR</option>
                  <option value="AED">AED</option>
                  <option value="RUB">₽ RUB</option>
                </select>
              </div>
            </div>

            {/* Payment Methods Tabs */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-600">
                {t('payment.selectMethod')}
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('visa')}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                    paymentMethod === 'visa' || paymentMethod === 'mastercard' || paymentMethod === 'amex'
                      ? 'border-emerald-600 bg-emerald-50/50 text-emerald-950 font-bold'
                      : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-emerald-700" />
                  <span className="text-[11px]">Card (Visa/MC)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('gpay')}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                    paymentMethod === 'gpay'
                      ? 'border-emerald-600 bg-emerald-50/50 text-emerald-950 font-bold'
                      : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300'
                  }`}
                >
                  <Smartphone className="w-5 h-5 text-emerald-700" />
                  <span className="text-[11px]">Google Pay</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('lanka_qr')}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                    paymentMethod === 'lanka_qr'
                      ? 'border-emerald-600 bg-emerald-50/50 text-emerald-950 font-bold'
                      : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300'
                  }`}
                >
                  <QrCode className="w-5 h-5 text-emerald-700" />
                  <span className="text-[11px]">LankaQR (LK)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('bank_transfer')}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                    paymentMethod === 'bank_transfer'
                      ? 'border-emerald-600 bg-emerald-50/50 text-emerald-950 font-bold'
                      : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300'
                  }`}
                >
                  <Building className="w-5 h-5 text-emerald-700" />
                  <span className="text-[11px]">Bank Wire</span>
                </button>
              </div>
            </div>

            {/* Form based on selected payment method */}
            {(paymentMethod === 'visa' || paymentMethod === 'mastercard' || paymentMethod === 'amex') && (
              <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-stone-600 mb-1">
                    {t('payment.cardNumber')}
                  </label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-sm font-mono font-bold text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-stone-600 mb-1">
                      {t('payment.expiry')}
                    </label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-sm font-mono font-bold text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-stone-600 mb-1">
                      {t('payment.cvv')}
                    </label>
                    <input
                      type="password"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-sm font-mono font-bold text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-600 mb-1">
                    {t('payment.cardholderName')}
                  </label>
                  <input
                    type="text"
                    value={cardholder}
                    onChange={(e) => setCardholder(e.target.value)}
                    className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-sm font-medium text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            )}

            {paymentMethod === 'lanka_qr' && (
              <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200 text-center space-y-3">
                <div className="w-36 h-36 bg-white border border-stone-300 rounded-2xl mx-auto flex items-center justify-center p-3 shadow-xs">
                  {/* Visual LankaQR Code */}
                  <div className="text-center font-mono text-[10px] text-stone-800">
                    <QrCode className="w-24 h-24 text-stone-900 mx-auto" />
                    <span className="font-bold text-[9px] text-amber-700">LankaQR National Standard</span>
                  </div>
                </div>
                <p className="text-xs text-stone-600">
                  Scan using any Sri Lankan Banking app: Commercial Bank Q+, BOC SmartPay, FriMi, Genie, or Sampath WePay.
                </p>
              </div>
            )}

            {paymentMethod === 'bank_transfer' && (
              <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 text-xs space-y-2">
                <div className="font-bold text-stone-900">Sri Lanka Partner Bank Details:</div>
                <div className="text-stone-700">Bank: <span className="font-semibold">Bank of Ceylon (BOC) Fort Corporate Branch</span></div>
                <div className="text-stone-700">Account Name: <span className="font-semibold">LankaMate Travels & Tourism Ltd</span></div>
                <div className="text-stone-700">Account No: <span className="font-mono font-bold">0084 1029 3847</span></div>
                <div className="text-stone-700">SWIFT/BIC: <span className="font-mono font-bold">BCEYLKLX</span></div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={() => handleSimulatePayment('success')}
                disabled={isProcessing}
                className="w-full py-4 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm shadow-md transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>{t('payment.processing')}</span>
                  </>
                ) : (
                  <span>
                    {paymentMode === 'demo' ? t('payment.simulatedSuccess') : t('payment.payNow')}
                  </span>
                )}
              </button>

              {paymentMode === 'demo' && (
                <button
                  type="button"
                  onClick={() => handleSimulatePayment('failed')}
                  disabled={isProcessing}
                  className="w-full py-2.5 rounded-xl border border-stone-200 text-stone-600 hover:text-rose-700 hover:border-rose-200 text-xs font-semibold transition-colors cursor-pointer"
                >
                  {t('payment.simulateFailure')}
                </button>
              )}
            </div>

            <div className="text-center text-[11px] text-stone-600 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t('payment.noteSecure')}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
