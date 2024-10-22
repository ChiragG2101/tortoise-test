import { api } from '../api/api';

const CUSTOMER_BILLING_BASE_URL = '/v1/lessor-customer-billing';
const CUSTOMER_BILLING_TAGS = {
  CUSTOMER_BILLING_LIST: 'CustomerBillingList',
};

const billingRawApiSlice = api.enhanceEndpoints({
  addTagTypes: Object.values(CUSTOMER_BILLING_TAGS),
});

export const billingApiSlice = billingRawApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCustomerBilling: builder.query({
      query: ({ filters, page, page_size, ordering, search }) => ({
        url: CUSTOMER_BILLING_BASE_URL,
        params: {
          ...(page && { page }),
          ...(search && { search }),
          ...(page_size && { page_size }),
          ...(ordering && { ordering }),
          ...(filters && { ...filters }),
        },
      }),
      providesTags: [CUSTOMER_BILLING_TAGS.CUSTOMER_BILLING_LIST],
    }),
    uploadLessorInvoice: builder.mutation({
      query: ({ lessorInvoiceId, body }) => ({
        url: `${CUSTOMER_BILLING_BASE_URL}/${lessorInvoiceId}/upload-invoice`,
        method: 'POST',
        body: body,
      }),
      invalidatesTags: [CUSTOMER_BILLING_TAGS.CUSTOMER_BILLING_LIST],
    }),
    markInvoiceAsPaid: builder.mutation({
      query: ({ lessorInvoiceId, body }) => ({
        url: `${CUSTOMER_BILLING_BASE_URL}/${lessorInvoiceId}/mark-invoice-paid`,
        method: 'POST',
        body: body,
      }),
      invalidatesTags: [CUSTOMER_BILLING_TAGS.CUSTOMER_BILLING_LIST],
    }),
    getSecurityDepositList: builder.query({
      query: ({ orgId }) => ({
        url: `/v1/lessor-payment/${orgId}/security-deposits`,
      }),
    }),
  }),
});

export const {
  useGetCustomerBillingQuery,
  useUploadLessorInvoiceMutation,
  useMarkInvoiceAsPaidMutation,
  useGetSecurityDepositListQuery,
} = billingApiSlice;
