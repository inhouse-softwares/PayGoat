import { baseApi } from "./baseApi";
import type { PaymentCollection } from "@/lib/payment-store";

export const collectionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCollections: builder.query<PaymentCollection[], string | void>({
      query: (instanceId) => 
        instanceId ? `/collections?instanceId=${instanceId}` : "/collections",
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
  useGetCollectionByIdQuery,
  useCreateCollectionMutation,
  useDeleteCollectionMutation,
} = collectionsApi;
