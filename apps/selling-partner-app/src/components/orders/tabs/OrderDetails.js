import { selectSupplier } from '@/features/auth/slice';
import {
  useGetMultipleProcurementWorkflowStepsQuery,
  useGetOrderByIdQuery,
  useOrderWorkflowExecutionMutation,
} from '@/features/order/api';
import { skipToken } from '@reduxjs/toolkit/query';
import React from 'react';
import { useSelector } from 'react-redux';
import OrderCard from '../cards/OrderCard';
import ProductCard from '../cards/ProductCard';
import {
  LESSOR_ORDER_PRODUCT_STATUS,
  PURCHASE_ORDER_STATUS,
} from '@/features/order/constants';
import { Button } from '@nextui-org/react';
import { validateAndCreateProcurementWorkflowDataInput } from '@/features/order/utils';

export default function OrderDetails({ orderId }) {
  const supplier = useSelector(selectSupplier);

  /** Getting all the order data */
  const { data: orderData } = useGetOrderByIdQuery(
    orderId && supplier ? { orderId: orderId, supplierId: supplier } : skipToken
  );

  /** Filtering the products that are pending */
  const filteredProducts = orderData?.order_products.filter(
    (product) => product.status === LESSOR_ORDER_PRODUCT_STATUS.PENDING
  );

  /** Getting all the workflow steps for the filtered products */
  const { data: workflowSteps } = useGetMultipleProcurementWorkflowStepsQuery(
    filteredProducts && filteredProducts.length > 0
      ? {
          lessorOrderProductIds: filteredProducts.map((product) => product.id),
          orderId: orderId,
        }
      : skipToken
  );

  /** fetching the mutation to execute workflows */
  const [
    orderWorkflowExecution,
    { isLoading: isOrderWorkflowExecutionLoading },
  ] = useOrderWorkflowExecutionMutation();

  /** Function to execute the workflows */
  const onClick = async () => {
    try {
      const inputs = Object.keys(workflowSteps).map((lessorOrderProductId) =>
        validateAndCreateProcurementWorkflowDataInput(
          orderData,
          workflowSteps[lessorOrderProductId].post_placed_by_lessor
            .current_step[0],
          lessorOrderProductId
        )
      );
      const executionPromises = inputs.map((input) =>
        orderWorkflowExecution(input).unwrap()
      );
      const results = await Promise.all(executionPromises);
    } catch (error) {
      console.log(error);
    }
  };

  if (!orderData) return <></>;

  return (
    <div className='flex flex-col gap-5'>
      <ProductCard orderData={orderData} />
      <OrderCard orderData={orderData} />
      {orderData.status === PURCHASE_ORDER_STATUS.PENDING &&
        workflowSteps &&
        Object.keys(workflowSteps).length > 0 && (
          <Button
            className='w-full btn-primary'
            onClick={onClick}
            isLoading={isOrderWorkflowExecutionLoading}
          >
            Confirm order
          </Button>
        )}
    </div>
  );
}
