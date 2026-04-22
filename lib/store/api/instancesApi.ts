import { baseApi } from "./baseApi";
import type { PaymentInstance } from "@/lib/payment-store";

export const instancesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getInstances: builder.query<PaymentInstance[], void>({
      query: () => "/instances",
      providesTags: ["PaymentInstance"],
    }),
    getInstanceById: builder.query<PaymentInstance & { collections: any[] }, string>({
      query: (id) => `/instances/${id}`,
      providesTags: (result, error, id) => [{ type: "PaymentInstance", id }],
    }),
    createInstance: builder.mutation<
      PaymentInstance,
      Omit<PaymentInstance, "id" | "splitCode" | "createdAt" | "updatedAt"> & { splitCode?: string }
    >({
      query: (body) => ({
        url: "/instances",
        method: "POST",
        body,
      }),
      invalidatesTags: ["PaymentInstance"],
    }),
    updateInstance: builder.mutation<
      PaymentInstance,
      { id: string; data: Partial<PaymentInstance> }
    >({
      query: ({ id, data }) => ({
        url: `/instances/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "PaymentInstance", id },
        "PaymentInstance",
      ],
    }),
    deleteInstance: builder.mutation<void, string>({
      query: (id) => ({
        url: `/instances/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["PaymentInstance", "PaymentCollection"],
    }),
  }),
});

export const {
  useGetInstancesQuery,
  useGetInstanceByIdQuery,
  useCreateInstanceMutation,
  useUpdateInstanceMutation,
  useDeleteInstanceMutation,
} = instancesApi;
