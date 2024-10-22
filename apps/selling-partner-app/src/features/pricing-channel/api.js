import { api } from '../api/api';

const PRICING_CHANNEL_BASE_URL = '/v1/supplier-pricing-channel';

export const pricingChannelApiSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    createPricingChannel: builder.mutation({
      query: (data) => ({
        url: PRICING_CHANNEL_BASE_URL,
        method: 'POST',
        body: data,
      }),
    }),
    getPricingChannelsListing: builder.query({
      query: () => ({
        url: PRICING_CHANNEL_BASE_URL,
        method: 'GET',
      }),
    }),
    getPricingChannelById: builder.query({
      query: (id) => ({
        url: `${PRICING_CHANNEL_BASE_URL}/${id}`,
        method: 'GET',
      }),
    }),
    getPricingChannelIdListing: builder.query({
      query: (id) => ({
        url: `${PRICING_CHANNEL_BASE_URL}/${id}/listing`,
        method: 'GET',
      }),
    }),
    getPricingChannelListing: builder.query({
      query: ({ id, search, page, page_size }) => ({
        url: `${PRICING_CHANNEL_BASE_URL}/${id}/listing`,
        params: {
          ...(page && { page }),
          ...(page_size && { page_size }),
          ...(search && { search_query: search }),
        },
      }),
    }),
  }),
});

export const {
  useCreatePricingChannelMutation,
  useGetPricingChannelsListingQuery,
  useGetPricingChannelByIdQuery,
  useGetPricingChannelIdListingQuery,
  useGetPricingChannelListingQuery,
} = pricingChannelApiSlice;
