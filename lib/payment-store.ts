export type PaymentEntity = {
  name: string;
  percentage: number;
  businessName?: string;
  accountNumber?: string;
  bankCode?: string;
  myimopaySubaccountId?: string | null;
};

export type PaymentType = {
  id: string;
  instanceId: string;
  name: string;
  description?: string;
  amount: number;
  splitCode?: string;
  splitEntities?: PaymentEntity[];
};

export type FormFieldType = "text" | "number" | "date" | "select";

export type FormField = {
  key: string;
  label: string;
  type: FormFieldType;
  required: boolean;
  options?: string[];
};

export type PaymentInstance = {
  id: string;
  name: string;
  splitCode: string;
  idclPercent: number;
  summary: string;
  entities: PaymentEntity[];
  formFields: FormField[];
  paymentTypes?: PaymentType[];
  _count?: { collections: number };
  _sum?: { collections: { amount: number | null } };
  createdAt?: string;
  updatedAt?: string;
};

export type PaymentCollectionMetadata = {
  persons?: Array<Record<string, string>>;
  [key: string]: unknown;
};

export type PaymentCollection = {
  id: string;
  instanceId: string;
  instanceName: string;
  splitCode: string;
  paymentTypeId?: string;
  paymentType?: string;
  payer: string;
  amount: number;
  quantity?: number;
  idclAmount: number;
  motAmount: number;
  metadata: PaymentCollectionMetadata;
  paymentReference?: string;
  transactionId?: string;
  paymentStatus?: string;
  collectedAt: string;
  createdAt?: string;
};

export type Operator = {
  id: string;
  email: string;
  plainPassword: string | null;
  instanceId: string | null;
  lastLoginAt: string | null;
  createdAt: string;
  instance: { id: string; name: string; splitCode: string } | null;
};

export type Profile = {
  id: string;
  email: string;
  role: string;
  lastLoginAt: string | null;
  instanceId: string | null;
};

// MyIMO Pay API response types
export type MyIMOApiResponseHeader = {
  is_success: boolean;
  remark?: string;
  code?: number;
};

export type MyIMOApiResponse<T = unknown> = {
  header: MyIMOApiResponseHeader;
  data: T;
};

export type MyIMOPayTransactionData = {
  status: number | string;
  identifier?: string;
  tx_reference?: string;
  amount?: number;
  currency?: string;
  customer_full_name?: string;
  customer_email?: string;
};

export type MyIMOPayInitData = {
  link?: string;
  reference?: string;
  [key: string]: unknown;
};

export type MyIMOPayBankData = {
  bank_name: string;
  bank_code: string;
};

export type MyIMOPayAccountResolveData = {
  account_name: string;
  account_number?: string;
  bank_code?: string;
};

// Network error helper type
export type NetworkError = Error & {
  cause?: { code?: string };
};

export function isNetworkError(error: unknown): error is NetworkError {
  if (!(error instanceof Error)) return false;
  const err = error as NetworkError;
  return (
    err.cause?.code === "ENOTFOUND" ||
    err.cause?.code === "ECONNREFUSED" ||
    err.cause?.code === "ETIMEDOUT" ||
    err.cause?.code === "EAI_AGAIN" ||
    (err.name === "TypeError" && err.message?.includes("fetch failed"))
  );
}

// Receipt types for the payment form
export type ReceiptPerson = {
  name: string;
  [key: string]: string;
};

export type Receipt = {
  id: string;
  name: string;
  fields: ReceiptPerson;
};

export const PAYMENT_INSTANCES_STORAGE_KEY = "paygoat-payment-instances";
export const PAYMENT_COLLECTIONS_STORAGE_KEY = "paygoat-payment-collections";

export const defaultPaymentInstances: PaymentInstance[] = [];

function safeParse<T>(value: string | null, fallback: T): T {
  if (!value) {
    return fallback;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function getStoredPaymentInstances() {
  if (typeof window === "undefined") {
    return defaultPaymentInstances;
  }

  const parsed = safeParse<PaymentInstance[]>(
    window.localStorage.getItem(PAYMENT_INSTANCES_STORAGE_KEY),
    defaultPaymentInstances,
  );

  return parsed.length > 0 ? parsed : defaultPaymentInstances;
}

export function savePaymentInstances(instances: PaymentInstance[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(PAYMENT_INSTANCES_STORAGE_KEY, JSON.stringify(instances));
}

export function getStoredCollections() {
  if (typeof window === "undefined") {
    return [] as PaymentCollection[];
  }

  return safeParse<PaymentCollection[]>(
    window.localStorage.getItem(PAYMENT_COLLECTIONS_STORAGE_KEY),
    [],
  );
}

export function saveCollections(collections: PaymentCollection[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(PAYMENT_COLLECTIONS_STORAGE_KEY, JSON.stringify(collections));
}
