import React from 'react';
import PropTypes from 'prop-types';
import {
  CustomTortoiseDrawer,
  CustomTortoiseDrawerBody,
} from '@repo/ui/components';
import OrderDetails from './OrderDetails';

const VendorsOrderDrawer = ({ isDrawerOpen, onClose, vendorOrder }) => {
  return (
    <CustomTortoiseDrawer
      isDrawerOpen={isDrawerOpen}
      onClose={onClose}
      hasNavigationControls={true}
      title={vendorOrder?.lease_request?.id}
    >
      <CustomTortoiseDrawerBody>
        <OrderDetails vendorOrder={vendorOrder} />
      </CustomTortoiseDrawerBody>
    </CustomTortoiseDrawer>
  );
};

VendorsOrderDrawer.propTypes = {
  isDrawerOpen: PropTypes.bool,
  onClose: PropTypes.func,
  vendorOrder: PropTypes.object,
};
export default VendorsOrderDrawer;
