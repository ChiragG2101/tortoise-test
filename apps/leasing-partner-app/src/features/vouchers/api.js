import { api } from '../api/api';

const VOUCHERS_BASE_URL = '/v1/vouchers';

export const vouchersSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getVouchersList: builder.query({
      query: ({ search, page, page_size, ordering, filters }) => ({
        url: `${VOUCHERS_BASE_URL}`,
        params: {
          ...(search && { search }),
          ...(page && { page }),
          ...(page_size && { page_size }),
          ...(ordering && { ordering }),
          ...(filters && { ...filters }),
        },
      }),
    }),
    getVouchersSummary: builder.query({
      query: () => ({
        url: `${VOUCHERS_BASE_URL}/summary`,
      }),
    }),
  }),
});

export const { useGetVouchersListQuery, useGetVouchersSummaryQuery } =
  vouchersSlice;
