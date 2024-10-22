import { api } from '../api/api';

const LESSOR_STAMPS_BASE_URL = '/v1/lessor-stamps';

export const stampsSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getStampsList: builder.query({
      query: () => ({
        url: `${LESSOR_STAMPS_BASE_URL}/list`,
      }),
    }),
    stampsRequest: builder.mutation({
      query: (data) => ({
        url: `${LESSOR_STAMPS_BASE_URL}/request`,
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const { useGetStampsListQuery, useStampsRequestMutation } = stampsSlice;
