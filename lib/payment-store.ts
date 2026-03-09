export type PaymentInstance = {
  id: string;
  name: string;
  splitCode: string;
  idclPercent: number;
  summary: string;
};

export type PaymentCollection = {
  id: string;
  instanceId: string;
  instanceName: string;
  splitCode: string;
  payer: string;
  amount: number;
  idclAmount: number;
  motAmount: number;
  collectedAt: string;
};

export const PAYMENT_INSTANCES_STORAGE_KEY = "paygoat-payment-instances";
export const PAYMENT_COLLECTIONS_STORAGE_KEY = "paygoat-payment-collections";

export const defaultPaymentInstances: PaymentInstance[] = [
  {
    id: "transport",
    name: "Transport",
    splitCode: "TRN-35",
    idclPercent: 35,
    summary: "Collect transport-related fees using the configured IDCL and MOT split.",
  },
  {
    id: "licensing",
    name: "Licensing",
    splitCode: "LIC-30",
    idclPercent: 30,
    summary: "Handle license issuance and renewal payments under one split code.",
  },
  {
    id: "inspection",
    name: "Inspection",
    splitCode: "INSP-40",
    idclPercent: 40,
    summary: "Capture inspection and compliance payments with automatic revenue split.",
  },
];

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
