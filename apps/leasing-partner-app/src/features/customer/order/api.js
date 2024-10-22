import { api } from '../../api/api';

const PURCHASE_ORDER_BASE_URL = '/v1/lessor-pending-order';

const PURCHASE_ORDER_TAGS = {
  PURCHASE_ORDER_LIST: 'PurchaseOrderList',
  PURCHASE_ORDER_DETAIL: 'PurchaseOrderDetail',
};

const purchaseOrderApiSlice = api.enhanceEndpoints({
  addTagTypes: Object.values(PURCHASE_ORDER_TAGS),
});

export const purchaseOrderSlice = purchaseOrderApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    purchaseOrders: builder.query({
      query: ({ page, search, page_size, ordering, status = 'pending' }) => ({
        url: `${PURCHASE_ORDER_BASE_URL}`,
        params: {
          status,
          ...(page && { page }),
          ...(search && { search }),
          ...(page_size && { page_size }),
          ...(ordering && { ordering }),
        },
      }),
      providesTags: [PURCHASE_ORDER_TAGS.PURCHASE_ORDER_LIST],
    }),
    placeOrder: builder.mutation({
      query: (orderId) => ({
        url: `${PURCHASE_ORDER_BASE_URL}/${orderId}/place-order-with-supplier`,
        method: 'POST',
      }),
      invalidatesTags: [PURCHASE_ORDER_TAGS.PURCHASE_ORDER_LIST],
    }),
    getGstInfo: builder.query({
      query: ({ id }) => `v1/lessor/${id}/gst-infos`,
    }),
    updateRentalScheduleState: builder.mutation({
      query: ({ rental_schedule_id, gst_info_id }) => ({
        url: `/v1/rental-schedule/${rental_schedule_id}/update-state`,
        method: 'POST',
        body: { gst_info_id },
      }),
      invalidatesTags: (result, error, { order_id }) => [
        { type: PURCHASE_ORDER_TAGS.PURCHASE_ORDER_DETAIL, id: order_id },
      ],
    }),
    updateBillingAddress: builder.mutation({
      query: ({ order_id, billing_address_id }) => ({
        url: `/v1/lessor-pending-order/${order_id}/update-billing-address`,
        method: 'POST',
        body: { billing_address_id },
      }),
      invalidatesTags: (result, error, { order_id }) => [
        { type: PURCHASE_ORDER_TAGS.PURCHASE_ORDER_DETAIL, id: order_id },
      ],
    }),
    getLessorOrderDetails: builder.query({
      query: ({ order_id }) => `/v1/lessor-pending-order/${order_id}`,
      providesTags: (result, error, { order_id }) => [
        { type: PURCHASE_ORDER_TAGS.PURCHASE_ORDER_DETAIL, id: order_id },
      ],
    }),
  }),
});

export const {
  usePurchaseOrdersQuery,
  usePlaceOrderMutation,
  useUpdateRentalScheduleStateMutation,
  useUpdateBillingAddressMutation,
  useGetGstInfoQuery,
  useGetLessorOrderDetailsQuery,
} = purchaseOrderSlice;
