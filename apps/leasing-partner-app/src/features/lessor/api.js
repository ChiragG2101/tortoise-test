import { api } from '../api/api';

const LESSOR_BASE_URL = '/v1/lessor';

export const lessorApiSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getLessorAssets: builder.query({
      query: (id) => ({
        url: `${LESSOR_BASE_URL}/${id}/assets`,
      }),
    }),
    getLessorAssetStats: builder.query({
      query: (id) => ({
        url: `${LESSOR_BASE_URL}/${id}/asset-stats`,
      }),
    }),
    getLessorActiveOrganisations: builder.query({
      query: (id) => ({
        url: `${LESSOR_BASE_URL}/${id}/active-organizations`,
      }),
    }),
    getLessorActiveOrganisationById: builder.query({
      query: ({ organisationId, customerId }) => ({
        url: `${LESSOR_BASE_URL}/${organisationId}/active-organizations/${customerId}`,
      }),
    }),
    getLessorAssetHistory: builder.query({
      query: ({ organisationId, assetId }) => ({
        url: `${LESSOR_BASE_URL}/${organisationId}/assets/${assetId}/history`,
      }),
    }),
  }),
});

export const {
  useGetLessorAssetsQuery,
  useGetLessorAssetStatsQuery,
  useGetLessorActiveOrganisationsQuery,
  useGetLessorActiveOrganisationByIdQuery,
  useGetLessorAssetHistoryQuery,
} = lessorApiSlice;
