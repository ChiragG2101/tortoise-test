import { api } from '../api/api';

const WORKFLOW_EXECUTION_BASE_URL = '/v1/workflow-execution';

export const workflowExecutionApiSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    updateWorkflowExecution: builder.mutation({
      query: ({ workflowExecutionId, data }) => ({
        url: `${WORKFLOW_EXECUTION_BASE_URL}/${workflowExecutionId}`,
        method: 'PUT',
        body: data,
      }),
    }),
  }),
});

export const { useUpdateWorkflowExecutionMutation } = workflowExecutionApiSlice;
