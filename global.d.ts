declare module '*.css';

interface PaystackTransactionResponse {
  reference: string;
  status: string;
  trans: string;
  transaction: string;
  trxref: string;
}

interface PaystackOptions {
  key: string;
  email: string;
  amount: number;
  ref?: string;
  split_code?: string;
  metadata?: Record<string, unknown>;
  onSuccess: (transaction: PaystackTransactionResponse) => void;
  onCancel: () => void;
}

interface Window {
  PaystackPop: new () => {
    newTransaction: (options: PaystackOptions) => void;
  };
}