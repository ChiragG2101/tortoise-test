import { api as rtkApiSlice } from '../api/api';

const LESSOR_VENDOR_BASE_URL = '/v1/lessor-vendor';
const LESSOR_SUPPLIER_CONFIG = '/v1/lessor-supplier-configuration';

const VENDOR_BILLING_TAGS = {
  BILLING_OVERVIEW: 'BillingOverview',
  INVOICES_LIST: 'InvoicesList',
};

const lessorVendorRawApiSlice = rtkApiSlice.enhanceEndpoints({
  addTagTypes: Object.values(VENDOR_BILLING_TAGS),
});

export const lessorVendorApiSlice = lessorVendorRawApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUnpaidBillings: builder.query({
      query: () => `${LESSOR_VENDOR_BASE_URL}-billing/unpaid`,
    }),
    getPaidBillings: builder.query({
      query: () => `${LESSOR_VENDOR_BASE_URL}-billing/paid`,
    }),
    getVendorInfo: builder.query({
      query: () => `${LESSOR_VENDOR_BASE_URL}-info`,
    }),
    getVendorOrders: builder.query({
      query: () => `${LESSOR_VENDOR_BASE_URL}-order`,
    }),
    getVendorOrderById: builder.query({
      query: (id) => `${LESSOR_VENDOR_BASE_URL}-order/${id}`,
    }),
    getLessorSupplierConfiguration: builder.query({
      query: () => `/v1/lessor-supplier-configuration`,
    }),
    getBillingOverview: builder.query({
      query: ({ configId, due_month, due_year, statusFilter }) => ({
        url: `${LESSOR_SUPPLIER_CONFIG}/${configId}/billing-overview-by-state`,
        params: {
          due_month,
          due_year,
          ...statusFilter,
        },
      }),
      providesTags: [VENDOR_BILLING_TAGS.BILLING_OVERVIEW],
    }),
    getInvoicesList: builder.query({
      query: ({ configId, search, ordering, page, page_size, filters }) => ({
        url: `${LESSOR_SUPPLIER_CONFIG}/${configId}/invoices`,
        params: {
          ...(search && { search }),
          ...(ordering && { ordering }),
          ...(page && { page }),
          ...(page_size && { page_size }),
          ...filters,
        },
      }),
      providesTags: [VENDOR_BILLING_TAGS.INVOICES_LIST],
    }),
    markInvoicesAsPaid: builder.mutation({
      query: ({ configId, body }) => ({
        url: `${LESSOR_SUPPLIER_CONFIG}/${configId}/mark-invoices-paid`,
        body,
        method: 'POST',
      }),
      invalidatesTags: [
        VENDOR_BILLING_TAGS.BILLING_OVERVIEW,
        VENDOR_BILLING_TAGS.INVOICES_LIST,
      ],
    }),
  }),
});

export const {
  useGetUnpaidBillingsQuery,
  useGetPaidBillingsQuery,
  useGetVendorInfoQuery,
  useGetVendorOrdersQuery,
  useGetVendorOrderByIdQuery,
  useGetLessorSupplierConfigurationQuery,
  useGetBillingOverviewQuery,
  useGetInvoicesListQuery,
  useMarkInvoicesAsPaidMutation,
} = lessorVendorApiSlice;
