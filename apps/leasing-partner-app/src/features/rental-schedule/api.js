import { api } from '../api/api';

const RENTAL_SCHEDULE_BASE_URL = '/v1/consolidated-rental-schedule';
const RENTAL_SCHEDULE_TAGS = {
  RENTAL_SCHEDULE_LIST: 'RentalScheduleList',
  RENTAL_SCHEDULE_ID: 'RentalScheduleId',
  SECURITY_DEPOSITS: 'SecurityDeposits',
};

const rentalScheduleRawApiSlice = api.enhanceEndpoints({
  addTagTypes: Object.values(RENTAL_SCHEDULE_TAGS),
});

export const rentalScheduleApiSlice = rentalScheduleRawApiSlice.injectEndpoints(
  {
    endpoints: (builder) => ({
      getRentalSchedules: builder.query({
        query: ({ status, page, search, ordering, page_size, filters }) => ({
          url: `${RENTAL_SCHEDULE_BASE_URL}`,
          params: {
            ...(status && { status }),
            ...(page && { page }),
            ...(search && { search }),
            ...(page_size && { page_size }),
            ...(ordering && { ordering }),
            ...(filters && { ...filters }),
          },
        }),
      }),
      getRentalScheduleByID: builder.query({
        query: (rentalScheduleId) => ({
          url: `${RENTAL_SCHEDULE_BASE_URL}/${rentalScheduleId}`,
        }),
        providesTags: (result, error, rentalScheduleId) => [
          {
            type: RENTAL_SCHEDULE_TAGS.RENTAL_SCHEDULE_ID,
            id: rentalScheduleId,
          },
        ],
      }),
      getRentalScheduleBreakdown: builder.query({
        query: ({ rentalScheduleId, page, search, ordering, page_size }) => ({
          url: `${RENTAL_SCHEDULE_BASE_URL}/${rentalScheduleId}/breakdown`,
          params: {
            ...(page && { page }),
            ...(search && { search_query: search }),
            ...(page_size && { page_size }),
            ...(ordering && { ordering }),
          },
        }),
      }),
      getDocumentLink: builder.query({
        query: (rentalScheduleId) => ({
          url: `${RENTAL_SCHEDULE_BASE_URL}/${rentalScheduleId}/get-document-link`,
        }),
      }),
      getSigningLink: builder.query({
        query: (rentalScheduleId) => ({
          url: `${RENTAL_SCHEDULE_BASE_URL}/${rentalScheduleId}/get-signing-url`,
        }),
      }),
      initSigningWorkflow: builder.mutation({
        query: (rentalScheduleId) => ({
          url: `${RENTAL_SCHEDULE_BASE_URL}/${rentalScheduleId}/init-signing-workflow`,
          method: 'POST',
        }),
        invalidatesTags: (result, error, rentalScheduleId) => [
          {
            type: RENTAL_SCHEDULE_TAGS.RENTAL_SCHEDULE_ID,
            id: rentalScheduleId,
          },
        ],
      }),
      getSecurityDepositPayments: builder.query({
        query: ({ rentalScheduleId, page, search, ordering, page_size }) => ({
          url: `${RENTAL_SCHEDULE_BASE_URL}/${rentalScheduleId}/security-deposit-payments`,
          params: {
            ...(page && { page }),
            ...(search && { search_query: search }),
            ...(page_size && { page_size }),
            ...(ordering && { ordering }),
          },
        }),
        providesTags: (result, error, { rentalScheduleId }) => [
          {
            type: RENTAL_SCHEDULE_TAGS.SECURITY_DEPOSITS,
            id: rentalScheduleId,
          },
        ],
      }),
      uploadSecurityDepositReceipt: builder.mutation({
        query: ({ lessorPaymentId, data }) => ({
          url: `/v1/lessor-payment/${lessorPaymentId}/add-receipt`,
          body: data,
          method: 'POST',
        }),
        invalidatesTags: (result, error, { rentalScheduleId }) => [
          {
            type: RENTAL_SCHEDULE_TAGS.SECURITY_DEPOSITS,
            id: rentalScheduleId,
          },
        ],
      }),
      getTemplates: builder.query({
        query: () => `v1/reports/template`,
      }),
      createDataExportRequest: builder.mutation({
        query: ({ data }) => ({
          url: `v1/reports/data-export-request`,
          body: data,
          method: 'POST',
        }),
      }),
      getDataExportById: builder.query({
        query: ({ id }) => `v1/reports/data-export-request/${id}`,
      }),
    }),
  }
);

export const {
  useGetRentalSchedulesQuery,
  useGetRentalScheduleByIDQuery,
  useGetRentalScheduleBreakdownQuery,
  useGetSigningLinkQuery,
  useGetDocumentLinkQuery,
  useInitSigningWorkflowMutation,
  useGetSecurityDepositPaymentsQuery,
  useUploadSecurityDepositReceiptMutation,
  useGetTemplatesQuery,
  useCreateDataExportRequestMutation,
  useGetDataExportByIdQuery,
} = rentalScheduleApiSlice;
