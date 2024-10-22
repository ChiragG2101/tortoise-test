import { api } from '../api/api';
import { produce } from 'immer';

const ONBOARDING_BASE_URL = '/v1/lessor-organization-onboarding';

export const organizationOnboardingApiSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getOnboardingOrganizations: builder.query({
      query: () => `${ONBOARDING_BASE_URL}`,
    }),
    getLead: builder.query({
      query: (organizationId) => `${ONBOARDING_BASE_URL}/${organizationId}`,
    }),
    getPastFeedback: builder.query({
      query: (organizationId) =>
        `${ONBOARDING_BASE_URL}/${organizationId}/past-feedback`,
    }),
    postFeedback: builder.mutation({
      query: ({ organizationId, data }) => ({
        url: `${ONBOARDING_BASE_URL}/${organizationId}/feedback`,
        method: 'POST',
        body: data,
      }),
      async onQueryStarted(
        { organizationId, _ },
        { dispatch, queryFulfilled }
      ) {
        try {
          const { data: newFeedback } = await queryFulfilled;
          dispatch(
            organizationOnboardingApiSlice.util.updateQueryData(
              'getPastFeedback',
              organizationId,
              (draft) => {
                return produce(draft, (draftState) => {
                  draftState.unshift(newFeedback);
                });
              }
            )
          );
        } catch (error) {
          console.error('Failed to update cache:', error);
        }
      },
    }),
    getDocuments: builder.query({
      query: (organizationId) =>
        `${ONBOARDING_BASE_URL}/${organizationId}/document`,
    }),
    postDocument: builder.mutation({
      query: ({ organizationId, data }) => ({
        url: `${ONBOARDING_BASE_URL}/${organizationId}/document`,
        method: 'POST',
        body: data,
      }),
    }),
    markDocumentAsReviewed: builder.mutation({
      query: ({ organizationId, documentId }) => ({
        url: `${ONBOARDING_BASE_URL}/${organizationId}/document/${documentId}/mark-as-reviewed`,
        method: 'POST',
      }),
    }),
    markDocumentAsReviewedForDocType: builder.mutation({
      query: ({ organizationId, data }) => ({
        url: `${ONBOARDING_BASE_URL}/${organizationId}/document/mark-as-reviewed-for-document-type`,
        method: 'POST',
        body: data,
      }),
    }),
    markAllDocumentsAsReviewed: builder.mutation({
      query: (organizationId) => ({
        url: `${ONBOARDING_BASE_URL}/${organizationId}/document/mark-all-as-reviewed`,
        method: 'POST',
      }),
    }),
    configureCreditLimits: builder.mutation({
      query: ({ organizationId, data }) => ({
        url: `${ONBOARDING_BASE_URL}/${organizationId}/configure`,
        method: 'POST',
        body: data,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetOnboardingOrganizationsQuery,
  useGetLeadQuery,
  useGetPastFeedbackQuery,
  usePostFeedbackMutation,
  useGetDocumentsQuery,
  usePostDocumentMutation,
  useMarkDocumentAsReviewedMutation,
  useMarkDocumentAsReviewedForDocTypeMutation,
  useMarkAllDocumentsAsReviewedMutation,
  useConfigureCreditLimitsMutation,
} = organizationOnboardingApiSlice;
