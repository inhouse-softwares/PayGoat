export type PaymentEntity = {
  name: string;
  percentage: number;
  businessName?: string;
  accountNumber?: string;
  bankCode?: string;
  paystackSubaccountCode?: string;
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
  options?: string[]; // for select type
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
  metadata: Record<string, string>;
  paystackReference?: string;
  collectedAt: string;
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
