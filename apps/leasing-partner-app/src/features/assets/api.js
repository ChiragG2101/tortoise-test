import { api } from '../api/api';

const LESSOR_BASE_URL = '/v1/lessor';
const getAssetsBaseUrl = (id) => `${LESSOR_BASE_URL}/${id}/assets`;

const ASSET_TAGS = {
  ASSETS_LIST: 'AssetsList',
  ASSET_ID: 'AssetId',
  FORECLOSURE_REQUESTS: 'ForeclosureRequests',
  SALE_INVOICE_REQUIRED: 'SaleInvoice',
};

const assetsRawApiSlice = api.enhanceEndpoints({
  addTagTypes: Object.values(ASSET_TAGS),
});

export const assetsApiSlice = assetsRawApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    assets: builder.query({
      query: ({ id, page, search, page_size, ordering }) => ({
        url: `${getAssetsBaseUrl(id)}`,
        params: {
          ...(page && { page }),
          ...(search && { search }),
          ...(page_size && { page_size }),
          ...(ordering && { ordering }),
        },
      }),
      providesTags: [ASSET_TAGS.ASSETS_LIST],
    }),
    assetDetail: builder.query({
      query: ({ organizationId, assetId }) => ({
        url: `${getAssetsBaseUrl(organizationId)}/${assetId}`,
      }),
      providesTags: (result, error, { assetId }) => [
        {
          type: ASSET_TAGS.ASSET_ID,
          id: assetId,
        },
      ],
    }),
    assetHistory: builder.query({
      query: ({ organizationId, assetId }) => ({
        url: `${getAssetsBaseUrl(organizationId)}/${assetId}/history`,
      }),
    }),
    assetForeclosureRequests: builder.query({
      query: ({ id, page, search, page_size, ordering }) => ({
        url: `${getAssetsBaseUrl(id)}/foreclosure-requests`,
        params: {
          ...(page && { page }),
          ...(search && { search }),
          ...(page_size && { page_size }),
          ...(ordering && { ordering }),
        },
      }),
      providesTags: [ASSET_TAGS.FORECLOSURE_REQUESTS],
    }),
    assetRequiringSaleInvoice: builder.query({
      query: ({ id, page, search, page_size, ordering }) => ({
        url: `${getAssetsBaseUrl(id)}/sale-invoice-required`,
        params: {
          ...(page && { page }),
          ...(search && { search }),
          ...(page_size && { page_size }),
          ...(ordering && { ordering }),
        },
      }),
      providesTags: [ASSET_TAGS.SALE_INVOICE_REQUIRED],
    }),
    approveTerminationRequest: builder.mutation({
      query: ({ requestId, assetId }) => ({
        url: `/v1/termination-request/${requestId}/approve`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, { assetId }) => [
        {
          type: ASSET_TAGS.ASSET_ID,
          id: assetId,
        },
        {
          type: ASSET_TAGS.FORECLOSURE_REQUESTS,
        },
        {
          type: ASSET_TAGS.FORECLOSURE_REQUESTS,
        },
      ],
    }),
    uploadSaleInvoice: builder.mutation({
      query: ({ organizationId, assetId, body }) => ({
        url: `${getAssetsBaseUrl(organizationId)}/${assetId}/sale-of-asset-invoice`,
        method: 'POST',
        body: body,
      }),
      invalidatesTags: (result, error, { assetId }) => [
        {
          type: ASSET_TAGS.ASSET_ID,
          id: assetId,
        },
        {
          type: ASSET_TAGS.SALE_INVOICE_REQUIRED,
        },
      ],
    }),
  }),
});

export const {
  useAssetsQuery,
  useAssetDetailQuery,
  useAssetHistoryQuery,
  useAssetForeclosureRequestsQuery,
  useAssetRequiringSaleInvoiceQuery,
  useApproveTerminationRequestMutation,
  useUploadSaleInvoiceMutation,
} = assetsApiSlice;
