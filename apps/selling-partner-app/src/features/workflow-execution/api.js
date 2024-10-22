import { api } from '../api/api';
import {
  orderApiSlice,
  orderByIdTag,
  ordersTag,
  postApprovalTag,
} from '../order/api';

const WORKFLOW_EXECUTION_BASE_URL = '/v1/workflow-execution';

export const workflowExecutionApiSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    workflowExecution: builder.mutation({
      query: ({ id, data }) => ({
        url: `${WORKFLOW_EXECUTION_BASE_URL}/${id}`,
        method: 'PUT',
        body: data,
      }),
      onQueryStarted: (arg, api) => {
        api.queryFulfilled.then(() => {
          api.dispatch(
            orderApiSlice.util.invalidateTags([
              ordersTag,
              orderByIdTag,
              postApprovalTag,
            ])
          );
        });
      },
    }),
  }),
});

export const { useWorkflowExecutionMutation } = workflowExecutionApiSlice;
