import { api } from '../api/api';

const REPORT_BASE_URL = '/v1/reports';
const REPORT_TAGS = {
  DATA_EXPORT_REQUESTS: 'RentalScheduleList',
  PERIODIC_DATA_EXPORT_REQUESTS: 'RentalScheduleId',
  GENERATED_REPORTS: 'GeneratedReports',
  SCHEDULED_REPORTS: 'ScheduledReports',
};

const reportRawApiSlice = api.enhanceEndpoints({
  addTagTypes: Object.values(REPORT_TAGS),
});

export const reportApiSlice = reportRawApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getReportTemplates: builder.query({
      query: () => ({
        url: `${REPORT_BASE_URL}/template`,
      }),
    }),
    getGeneratedReports: builder.query({
      query: ({ page, page_size }) => ({
        url: `${REPORT_BASE_URL}/data-export-request`,
        params: {
          ...(page && { page }),
          ...(page_size && { page_size }),
        },
      }),
      providesTags: [REPORT_TAGS.GENERATED_REPORTS],
    }),
    getScheduleddReports: builder.query({
      query: ({ page, page_size }) => ({
        url: `${REPORT_BASE_URL}/periodic-data-export-request`,
        params: {
          ...(page && { page }),
          ...(page_size && { page_size }),
        },
      }),
      providesTags: [REPORT_TAGS.SCHEDULED_REPORTS],
    }),
    createDataExportRequest: builder.mutation({
      query: (body) => ({
        url: `${REPORT_BASE_URL}/data-export-request`,
        method: 'POST',
        body,
      }),
      invalidatesTags: [REPORT_TAGS.GENERATED_REPORTS],
    }),
    createPeriodicDataExportRequest: builder.mutation({
      query: (body) => ({
        url: `${REPORT_BASE_URL}/periodic-data-export-request`,
        method: 'POST',
        body,
      }),
      invalidatesTags: [REPORT_TAGS.SCHEDULED_REPORTS],
    }),
  }),
});

export const {
  useGetReportTemplatesQuery,
  useGetGeneratedReportsQuery,
  useGetScheduleddReportsQuery,
  useCreateDataExportRequestMutation,
  useCreatePeriodicDataExportRequestMutation,
} = reportApiSlice;
