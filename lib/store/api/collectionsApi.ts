import { baseApi } from "./baseApi";
import type { PaymentCollection } from "@/lib/payment-store";

export type CollectionFilters = {
  instanceId?: string;
  fromDate?: string;
  toDate?: string;
  paymentTypeId?: string;
  search?: string;
  page?: number;
  pageSize?: number;
};

export type PaginatedCollectionsResponse = {
  data: PaymentCollection[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
};

export const collectionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCollections: builder.query<PaymentCollection[], string | void>({
      query: (instanceId) => 
        instanceId ? `/collections?instanceId=${instanceId}` : "/collections",
      transformResponse: (response: unknown): PaymentCollection[] => {
        if (!response) return [];
        const data = response as { data?: PaymentCollection[] } | PaymentCollection[];
        return 'data' in data && Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : [];
      },
      providesTags: ["PaymentCollection"],
    }),
    getFilteredCollections: builder.query<PaginatedCollectionsResponse, CollectionFilters>({
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters.instanceId) params.set("instanceId", filters.instanceId);
        if (filters.fromDate) params.set("fromDate", filters.fromDate);
        if (filters.toDate) params.set("toDate", filters.toDate);
        if (filters.paymentTypeId) params.set("paymentTypeId", filters.paymentTypeId);
        if (filters.search) params.set("search", filters.search);
        if (filters.page) params.set("page", String(filters.page));
        if (filters.pageSize) params.set("pageSize", String(filters.pageSize));
        const qs = params.toString();
        return `/collections${qs ? `?${qs}` : ""}`;
      },
      transformResponse: (response: unknown): PaginatedCollectionsResponse => {
        if (!response) return { data: [], pagination: { page: 1, pageSize: 50, total: 0, totalPages: 0 } };
        const data = response as { data?: PaymentCollection[]; pagination?: { page: number; pageSize: number; total: number; totalPages: number } };
        return {
          data: Array.isArray(data.data) ? data.data : Array.isArray(response) ? (response as PaymentCollection[]) : [],
          pagination: data.pagination ?? { page: 1, pageSize: 50, total: 0, totalPages: 0 },
        };
      },
      providesTags: ["PaymentCollection"],
    }),
    getCollectionById: builder.query<PaymentCollection, string>({
      query: (id) => `/collections/${id}`,
      providesTags: (result, error, id) => [{ type: "PaymentCollection", id }],
    }),
    createCollection: builder.mutation<
      PaymentCollection,
      Omit<PaymentCollection, "id" | "createdAt">
    >({
      query: (body) => ({
        url: "/collections",
        method: "POST",
        body,
      }),
      invalidatesTags: ["PaymentCollection", "PaymentInstance"],
    }),
    deleteCollection: builder.mutation<void, string>({
      query: (id) => ({
        url: `/collections/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["PaymentCollection", "PaymentInstance"],
    }),
  }),
});

export const {
  useGetCollectionsQuery,
  useGetFilteredCollectionsQuery,
  useGetCollectionByIdQuery,
  useCreateCollectionMutation,
  useDeleteCollectionMutation,
} = collectionsApi;
