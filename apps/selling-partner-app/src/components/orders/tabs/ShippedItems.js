import { selectSupplier } from '@/features/auth/slice';
import {
  useGetMultipleProcurementWorkflowStepsQuery,
  useGetOrderByIdQuery,
  useOrderWorkflowExecutionMutation,
  useGetDeliveryProofsQuery,
} from '@/features/order/api';
import { LESSOR_ORDER_PRODUCT_STATUS } from '@/features/order/constants';
import { skipToken } from '@reduxjs/toolkit/query';
import React from 'react';
import { useSelector } from 'react-redux';
import ProductCard from '../cards/ProductCard';
import { Button } from '@nextui-org/react';
import { WorkflowValidationException } from '@/features/order/exception';
import { validateAndCreateProcurementWorkflowDataInput } from '@/features/order/utils';
import { toast } from 'react-toastify';
import InvoiceCard from '../cards/InvoiceCard';
import AddInvoice from '../forms/AddInvoice';
import AddDeliveryProof from '../forms/AddDeliveryProof';
import DeliveryProofCard from '../cards/DeliveryProofCard';

export default function ShippedItems({ orderId }) {
  const supplier = useSelector(selectSupplier);
  const { data: orderData } = useGetOrderByIdQuery(
    orderId && supplier ? { orderId: orderId, supplierId: supplier } : skipToken
  );

  const { data: deliveryProofs } = useGetDeliveryProofsQuery(
    orderId && supplier ? { supplierId: supplier, orderId: orderId } : skipToken
  );

  const filteredProducts = orderData?.order_products.filter(
    (product) =>
      product.status === LESSOR_ORDER_PRODUCT_STATUS.SHIPPED ||
      product.status === LESSOR_ORDER_PRODUCT_STATUS.DELIVERED
  );

  const hasInvoice = filteredProducts?.some(
    (product) => product.supplier_invoice
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
    if (deliveryProofs?.length === 0) {
      toast.error('Please upload proof of delivery');
      return;
    }
    try {
      const inputs = Object.keys(workflowSteps).map((lessorOrderProductId) =>
        validateAndCreateProcurementWorkflowDataInput(
          orderData,
          workflowSteps[lessorOrderProductId].post_placed_by_lessor
            .current_step[0],
          lessorOrderProductId,
          { deliveryProofs }
        )
      );
      const executionPromises = inputs.map((input) =>
        orderWorkflowExecution(input).unwrap()
      );
      await Promise.all(executionPromises);
      toast.success('Order marked as delivered successfully');
    } catch (error) {
      if (error instanceof WorkflowValidationException) {
        toast.error(error.message);
      } else {
        console.error('An unexpected error occurred:', error);
      }
    }
  };

  if (!orderData) return <></>;
  if (!filteredProducts || filteredProducts.length == 0)
    return <>No shipped or delivered products found</>;

  return (
    <div className='flex flex-col gap-5'>
      <ProductCard
        title='Shipped Items'
        orderData={orderData}
        status={[
          LESSOR_ORDER_PRODUCT_STATUS.DELIVERED,
          LESSOR_ORDER_PRODUCT_STATUS.SHIPPED,
        ]}
      />
      {hasInvoice ? (
        <InvoiceCard orderData={orderData} />
      ) : (
        <AddInvoice orderData={orderData} orderId={orderId} />
      )}

      {filteredProducts.some(
        (product) => product.status === LESSOR_ORDER_PRODUCT_STATUS.DELIVERED
      ) && <DeliveryProofCard deliveryProofs={deliveryProofs} />}

      {filteredProducts.some(
        (product) => product.status === LESSOR_ORDER_PRODUCT_STATUS.SHIPPED
      ) &&
        workflowSteps &&
        Object.keys(workflowSteps).length > 0 && (
          <>
            {deliveryProofs?.length === 0 ? (
              <AddDeliveryProof orderData={orderData} />
            ) : (
              <DeliveryProofCard deliveryProofs={deliveryProofs} />
            )}

            <Button
              className='w-full btn-primary'
              onClick={onClick}
              isLoading={isOrderWorkflowExecutionLoading}
            >
              Confirm delivery
            </Button>
          </>
        )}
    </div>
  );
}
