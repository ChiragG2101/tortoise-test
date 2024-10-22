import { api } from '../api/api';
import { ORDER_TAG_TYPES } from './constants';

const ORDER_BASE_URL = '/v1/order';
const WORKFLOW_EXECUTION_BASE_URL = '/v1/workflow-execution';
const enhancedApiSlice = api.enhanceEndpoints({
  addTagTypes: Object.values(ORDER_TAG_TYPES),
});

const getSupplierOrderBaseUrl = (supplierId) =>
  `/v1/supplier/${supplierId}/order`;

export const orderApiSlice = enhancedApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query({
      query: ({ supplierId, status, page, page_size }) => ({
        url: getSupplierOrderBaseUrl(supplierId),
        params: {
          status,
          ...(page && { page }),
          ...(page_size && { page_size }),
        },
      }),
      providesTags: [ORDER_TAG_TYPES.ORDERS],
    }),
    getOrderById: builder.query({
      query: ({ supplierId, orderId }) => ({
        url: `${getSupplierOrderBaseUrl(supplierId)}/${orderId}`,
      }),
      providesTags: (result, error, { orderId }) => [
        { type: ORDER_TAG_TYPES.ORDER_BY_ID, id: orderId },
      ],
    }),
    patchLessorOrderProduct: builder.mutation({
      query: ({ lessorOrderProductId, data }) => ({
        url: `v1/lessor-order-product/${lessorOrderProductId}`,
        method: 'PATCH',
        body: data,
      }),
      async onQueryStarted(
        { lessorOrderProductId, data, orderId, supplierId },
        { dispatch, queryFulfilled }
      ) {
        const patchResult = dispatch(
          api.util.updateQueryData(
            'getOrderById',
            { orderId: orderId, supplierId: supplierId },
            (draft) => {
              const product = draft.order_products.find(
                (product) => product.id === lessorOrderProductId
              );
              if (product) {
                Object.assign(product, { ...data });
              }
              return draft;
            }
          )
        );

        try {
          await queryFulfilled;
        } catch (error) {
          // Revert the optimistic update if the query fails
          patchResult.undo();
        }
      },
    }),
    getPostApprovalStep: builder.query({
      query: (orderId) => ({
        url: `${ORDER_BASE_URL}/${orderId}/post_confirmation_steps`,
        method: 'GET',
      }),
      providesTags: (result, error, orderId) => [
        { type: ORDER_TAG_TYPES.POST_APPROVAL, id: orderId },
      ],
    }),
    addInvoice: builder.mutation({
      query: ({
        lessorOrderProductIds,
        formInputs,
        supplierId,
        invoiceFile,
      }) => {
        const formData = new FormData();
        // adding all the formfields to formdata
        Object.keys(formInputs).forEach((key) =>
          formData.append(key, formInputs[key])
        );

        // adding the invoice file to formdata
        formData.append('document', invoiceFile);

        // adding the lessor order product ids to formdata
        lessorOrderProductIds.forEach((id) =>
          formData.append('lessor_order_product_ids', id)
        );

        return {
          url: `/v1/supplier/${supplierId}/invoice/lessor-order-product`,
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: (result, error, { orderId }) => [
        { type: ORDER_TAG_TYPES.ORDER_BY_ID, id: orderId },
      ],
    }),
    getMultipleProcurementWorkflowSteps: builder.query({
      queryFn: async (
        { lessorOrderProductIds },
        _queryApi,
        _extraOptions,
        fetchWithBQ
      ) => {
        try {
          const results = await Promise.all(
            lessorOrderProductIds.map((id) =>
              fetchWithBQ({
                url: `v1/lessor-order-product/${id}/post_placed_by_lessor_steps`,
                method: 'GET',
              })
            )
          );
          const hasError = results.some((result) => result.error);
          if (hasError) {
            return { error: results.find((result) => result.error).error };
          }

          return {
            data: results.reduce((acc, result, index) => {
              acc[lessorOrderProductIds[index]] = result.data;
              return acc;
            }, {}),
          };
        } catch (error) {
          return { error };
        }
      },
      providesTags: (result, error, { orderId }) => [
        {
          type: ORDER_TAG_TYPES.PROCUREMENT_WORKFLOW_STEPS,
          id: orderId,
        },
      ],
    }),
    orderWorkflowExecution: builder.mutation({
      query: ({ workflowId, data }) => ({
        url: `${WORKFLOW_EXECUTION_BASE_URL}/${workflowId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { orderId }) => [
        { type: ORDER_TAG_TYPES.ORDERS },
        { type: ORDER_TAG_TYPES.ORDER_BY_ID, id: orderId },
        { type: ORDER_TAG_TYPES.PROCUREMENT_WORKFLOW_STEPS, id: orderId },
        { type: ORDER_TAG_TYPES.DELIVERY_PROOFS },
      ],
    }),
    getDeliveryProofs: builder.query({
      query: ({ supplierId, orderId }) =>
        `/v1/supplier/${supplierId}/order/${orderId}/delivery-proofs`,
      providesTags: (result, error) => [
        { type: ORDER_TAG_TYPES.DELIVERY_PROOFS },
      ],
    }),
    uploadDeliveryProof: builder.mutation({
      query: ({ supplierId, lessorOrderProductIds, proofOfDeliveryFiles }) => {
        const formData = new FormData();
        lessorOrderProductIds?.forEach((id) =>
          formData.append('lessor_order_product_ids', id)
        );
        // Adding each proof of delivery file to formData
        proofOfDeliveryFiles.forEach((file) =>
          formData.append('document', file)
        );
        return {
          url: `/v1/supplier/${supplierId}/order/upload-delivery-proof`,
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: (result, error) => [
        { type: ORDER_TAG_TYPES.DELIVERY_PROOFS },
      ],
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useGetOrderByIdQuery,
  useGetPostApprovalStepQuery,
  usePatchLessorOrderProductMutation,
  useAddInvoiceMutation,
  useGetMultipleProcurementWorkflowStepsQuery,
  useOrderWorkflowExecutionMutation,
  useGetDeliveryProofsQuery,
  useUploadDeliveryProofMutation,
} = orderApiSlice;
