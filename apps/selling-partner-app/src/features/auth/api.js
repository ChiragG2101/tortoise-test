import { api } from '../api/api';

const AUTH_BASE_URL = '/v1/auth';

export const authApiSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: `${AUTH_BASE_URL}/login`,
        method: 'POST',
        body: credentials,
      }),
    }),
  }),
});

export const { useLoginMutation } = authApiSlice;
