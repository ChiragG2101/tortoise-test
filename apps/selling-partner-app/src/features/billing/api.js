import { api } from '../api/api';

const BASE_URL = '/v1/lessor-supplier-configuration';

export const billingApiSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getLessorSupplierConfiguration: builder.query({
      query: () => `${BASE_URL}`,
    }),
    getBillingOverview: builder.query({
      query: ({ configId, due_month, due_year, statusFilter }) => ({
        url: `${BASE_URL}/${configId}/billing-overview-by-state`,
        params: {
          due_month,
          due_year,
          ...statusFilter,
        },
      }),
    }),
    getInvoicesList: builder.query({
      query: ({ configId, search, ordering, page, page_size, filters }) => ({
        url: `${BASE_URL}/${configId}/invoices`,
        params: {
          ...(search && { search }),
          ...(ordering && { ordering }),
          ...(page && { page }),
          ...(page_size && { page_size }),
          ...filters,
        },
      }),
    }),
  }),
});

export const {
  useGetLessorSupplierConfigurationQuery,
  useGetBillingOverviewQuery,
  useGetInvoicesListQuery,
} = billingApiSlice;
