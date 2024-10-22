import CustomTortoiseDrawer, {
  CustomTortoiseDrawerBody,
} from '@/components/common/Drawer';
import OrderDetails from '@/components/orders/tabs/OrderDetails';
import ShippingDetails from '@/components/orders/tabs/ShippingDetailsOld';
import { Button, Tab, Tabs } from '@nextui-org/react';
import { useCallback, useState } from 'react';
import { skipToken } from '@reduxjs/toolkit/query';
import { useGetPostApprovalStepQuery } from '@/features/order/api';
import { toast } from 'react-toastify';
import { useWorkflowExecutionMutation } from '@/features/workflow-execution/api';

export default function OrdersDrawer({
  isOpen,
  onClose,
  onRefetch,
  selectedRowData,
  status,
}) {
  const [selectedTab, setSelectedTab] = useState('order-details');

  const { data: postAprovalSteps, refetch: refetchPostApproval } =
    useGetPostApprovalStepQuery(selectedRowData?.id ?? skipToken);

  const [confirmOrder, { isLoading: isConfirmOrderLoading }] =
    useWorkflowExecutionMutation();

  const handleOnClick = useCallback(async () => {
    try {
      await confirmOrder({
        id: postAprovalSteps?.post_approval?.current_step?.id,
        data: {},
      }).unwrap();
      toast.success('Order confirmed');
      onRefetch();
      refetchPostApproval();
    } catch (error) {
      console.error('Failed to confirm shipping:', error);
    }
  }, [
    confirmOrder,
    refetchPostApproval,
    postAprovalSteps?.post_approval?.current_step?.id,
    onRefetch,
  ]);

  return (
    <CustomTortoiseDrawer
      isOpen={isOpen}
      onClose={() => {
        onClose();
        setSelectedTab('order-details');
      }}
      hasNavigationControls={true}
      title={selectedRowData?.id}
      footer={
        postAprovalSteps?.post_approval.current_step.type ===
          'purchase_order_confirmed_by_supplier' && (
          <Button
            className='btn-primary w-full'
            onClick={handleOnClick}
            isLoading={isConfirmOrderLoading}
          >
            Confirm Order
          </Button>
        )
      }
    >
      <div className='px-8 bg-black-1 py-1 border-b-1'>
        <Tabs
          key={'active-customers'}
          variant='solid'
          color=''
          radius='lg'
          aria-label='Active Customer'
          selectedKey={selectedTab}
          onSelectionChange={setSelectedTab}
        >
          <Tab key='order-details' title='Order Details' />
          <Tab key='shipping-details' title='Shipping Details' />
        </Tabs>
      </div>
      <CustomTortoiseDrawerBody>
        {selectedTab === 'order-details' ? (
          <OrderDetails orderId={selectedRowData?.id} />
        ) : (
          <ShippingDetails
            orderId={selectedRowData?.id}
            status={status}
            onClose={onClose}
          />
        )}
      </CustomTortoiseDrawerBody>
    </CustomTortoiseDrawer>
  );
}
