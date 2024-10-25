import React from 'react';
import PropTypes from 'prop-types';
import {
  CustomTortoiseDrawer,
  CustomTortoiseDrawerBody,
} from '@repo/ui/components';
import PlaceOrderButton from '@/components/customers/orders/PlaceOrderButton';
import OrderDetails from './OrderDetails';

const PurchaseOrderDrawer = ({
  isDrawerOpen,
  onClose,
  customerPurchaseOrder,
}) => {
  return (
    <CustomTortoiseDrawer
      isDrawerOpen={isDrawerOpen}
      onClose={onClose}
      hasNavigationControls={true}
      title={customerPurchaseOrder?.lease_request?.id}
      footer={
        <PlaceOrderButton order={customerPurchaseOrder} onClose={onClose} />
      }
    >
      <CustomTortoiseDrawerBody>
        <OrderDetails customerPurchaseOrder={customerPurchaseOrder} />
      </CustomTortoiseDrawerBody>
    </CustomTortoiseDrawer>
  );
};

PurchaseOrderDrawer.propTypes = {
  isDrawerOpen: PropTypes.bool,
  onClose: PropTypes.func,
  customerPurchaseOrder: PropTypes.object,
};
export default PurchaseOrderDrawer;
