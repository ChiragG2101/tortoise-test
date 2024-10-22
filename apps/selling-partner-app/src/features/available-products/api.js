import { api } from '../api/api';

const SUPPLIER_PRODUCT_API_SLICE = '/v1/supplier-product';

export const supplierProductApiSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getSupplierProductListing: builder.query({
      query: ({ page, search, ordering, page_size }) => ({
        url: SUPPLIER_PRODUCT_API_SLICE,
        method: 'GET',
        params: {
          ...(page && { page }),
          ...(search && { search }),
          ...(page_size && { page_size }),
          ...(ordering && { ordering }),
        },
      }),
    }),
  }),
});

export const { useGetSupplierProductListingQuery } = supplierProductApiSlice;
