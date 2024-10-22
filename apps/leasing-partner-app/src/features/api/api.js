import { BASE_URL } from '@/utils/constants';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Mutex } from 'async-mutex';
import { clearUser, updateTokens } from '../auth/slice';

const mutex = new Mutex();

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: async (headers, { getState }) => {
    const token = getState().auth.access;
    if (token && !headers.has('Authorization'))
      headers.set('Authorization', token);
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  await mutex.waitForUnlock();
  let result = await baseQuery(args, api, extraOptions);
  if (
    result.error &&
    (result.error.status === 401 || result.error.originalStatus === 401)
  ) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        const refreshToken = api.getState().auth.refresh;
        const refreshResult = await baseQuery(
          {
            url: 'v1/auth/refresh',
            method: 'POST',
            body: { refresh: refreshToken },
          },
          api,
          extraOptions
        );
        if (refreshResult.data) {
          api.dispatch(updateTokens(refreshResult.data));
          result = await baseQuery(args, api, extraOptions);
        } else {
          api.dispatch(clearUser());
        }
      } finally {
        release();
      }
    } else {
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  }
  return result;
};

export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({}),
});
