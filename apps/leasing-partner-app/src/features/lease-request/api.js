import { api } from '../api/api';

const LEASE_REQUEST_BASE_URL = '/v1/lease-request';

export const leaseRequestApiSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getPostApprovalSteps: builder.query({
      query: (leaseRequestId) => ({
        url: `${LEASE_REQUEST_BASE_URL}/${leaseRequestId}/post_approval_steps`,
      }),
    }),
  }),
});

export const { useGetPostApprovalStepsQuery } = leaseRequestApiSlice;
