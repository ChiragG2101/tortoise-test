import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { shippingValidationSchema } from '@/features/order/schema';
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
} from '@nextui-org/react';
import { Package } from '@phosphor-icons/react/dist/ssr';
import { toast } from 'react-toastify';
import {
  useGetMultipleProcurementWorkflowStepsQuery,
  useOrderWorkflowExecutionMutation,
} from '@/features/order/api';
import { skipToken } from '@reduxjs/toolkit/query';
import {
  LESSOR_ORDER_PRODUCT_STATUS,
  SHIPPING_PROVIDERS,
} from '@/features/order/constants';
import { validateAndCreateProcurementWorkflowDataInput } from '@/features/order/utils';
import { WorkflowValidationException } from '@/features/order/exception';

export default function ShippingForm({ orderId, orderData }) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(shippingValidationSchema),
  });

  /** Filtering the products that are pending */
  const filteredProducts = orderData?.order_products.filter(
    (product) => product.status === LESSOR_ORDER_PRODUCT_STATUS.CONFIRMED
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

  const onSubmit = async (data) => {
    try {
      const inputs = Object.keys(workflowSteps).map((lessorOrderProductId) =>
        validateAndCreateProcurementWorkflowDataInput(
          orderData,
          workflowSteps[lessorOrderProductId].post_placed_by_lessor
            .current_step[0],
          lessorOrderProductId,
          { formData: data }
        )
      );
      const executionPromises = inputs.map((input) =>
        orderWorkflowExecution(input).unwrap()
      );
      await Promise.all(executionPromises);
      toast.success('Order marked as shipped successfully');
    } catch (error) {
      if (error instanceof WorkflowValidationException) {
        toast.error(error.message);
      } else {
        console.error('An unexpected error occurred:', error);
      }
    }
  };

  return filteredProducts && filteredProducts.length > 0 ? (
    <div>
      <div className='flex items-center justify-between'>
        <p className='font-semibold'>Shipping details</p>
        <p
          className='text-green-8 cursor-pointer text-sm'
          onClick={() => reset()}
        >
          Reset
        </p>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='flex flex-col gap-4 mt-2'
      >
        <Controller
          name='shipping_provider'
          control={control}
          defaultValue={SHIPPING_PROVIDERS[0].label}
          render={({ field }) => (
            <Dropdown>
              <DropdownTrigger>
                <Button variant='bordered'>{field.value}</Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label='Select Month and Year'
                onAction={(key) => field.onChange(key)}
              >
                {SHIPPING_PROVIDERS.map((option) => (
                  <DropdownItem key={option.value} onClick={field.onChange}>
                    {option.label}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          )}
        />
        <Controller
          name='tracking_number'
          control={control}
          defaultValue=''
          render={({ field }) => (
            <Input
              {...field}
              variant='bordered'
              label='Tracking number'
              isInvalid={errors[field.name]}
              errorMessage={errors[field.name]?.message}
            />
          )}
        />
        <Button
          type='submit'
          className='text-white bg-black-10 rounded-lg'
          startContent={
            <Package className='text-white' size={20} weight='fill' />
          }
          //   isLoading={isConfirmShippingLoading}
        >
          Confirm shipping
        </Button>
      </form>
    </div>
  ) : (
    <></>
  );
}
