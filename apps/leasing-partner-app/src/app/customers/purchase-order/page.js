'use client';

import {
  TortoiseTable,
  OrganizationCellItem,
  ProductCellItem,
  IconTitlePageHeading,
} from '@repo/ui/components';
import { formatAsCurrency } from '@/features/common/utils';
import { usePurchaseOrdersQuery } from '@/features/customer/order/api';
import { NewspaperClipping, CaretRight } from '@phosphor-icons/react';
import { Tooltip } from '@nextui-org/react';
import { format } from 'date-fns';
import { useCallback, useState } from 'react';
import PurchaseOrderDrawer from './drawer';

const columns = Object.freeze([
  { key: 'id', label: 'Order ID' },
  { key: 'request_device', label: 'Request device' },
  {
    key: 'request_placed_on',
    label: 'Request placed on',
  },
  { key: 'order_amount', label: 'Price' },
  {
    key: 'organization',
    label: 'Placed by',
  },
  { key: 'potential_supplier', label: 'Vendor' },
  { key: 'tenure', label: 'Tenure (in months)' },
  { key: 'caret', label: '' },
]);

const sortKeyMapping = Object.freeze({
  organization: 'organization__name',
  request_placed_on: 'created_at',
});

const PAGE_SIZE = 15;

export default function PurchaseOrder() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [customerPurchaseOrder, setCustomerPurchaseOrder] = useState(null);

  const renderCell = useCallback((order, columnKey) => {
    switch (columnKey) {
      case 'request_device':
      case 'request_device':
        return <ProductCellItem products={order.products} />;
      case 'request_placed_on':
        return (
          <div className='flex-col'>
            <div>{format(new Date(order.created_at), 'dd MMMM yyyy')}</div>
            <div className='text-xs text-black-5'>
              {format(new Date(order.created_at), 'hh:mm a')}
            </div>
          </div>
        );
      case 'organization':
        return (
          <OrganizationCellItem
            name={order.organization.name}
            logo={order.organization.logo}
          />
        );
      case 'potential_supplier':
        const suppliers = order?.lessor_order_products?.map(
          (item) => item?.supplier_name
        );
        const uniqueSuppliers = [...new Set(suppliers)];
        return (
          <p>
            {uniqueSuppliers[0]}
            {uniqueSuppliers.length > 1 && (
              <>
                ,{' '}
                <Tooltip content={uniqueSuppliers.slice(1).join(', ')}>
                  <span className='text-green-9'>
                    +{uniqueSuppliers.length - 1} more
                  </span>
                </Tooltip>
              </>
            )}
          </p>
        );
      case 'order_amount':
        return formatAsCurrency(order[columnKey]);
      case 'tenure':
        return order.lease_request.tenure;
      case 'caret':
        return <CaretRight size={20} weight='bold' color='#CBCBCB' />;
      default:
        return order[columnKey] ?? '-';
    }
  }, []);

  const handleRowClick = (item) => {
    setIsDrawerOpen(true);
    setCustomerPurchaseOrder(item);
  };

  return (
    <>
      <IconTitlePageHeading title='Purchase Order' Icon={NewspaperClipping} />
      {/* <Card  /> */}
      <div className='flex flex-col mt-5 gap-5 px-5'>
        <TortoiseTable
          columns={columns}
          queryHook={usePurchaseOrdersQuery}
          queryParameters={null}
          pageSize={PAGE_SIZE}
          sortKeyMapping={sortKeyMapping}
          defaultSortConfig={null}
          renderCell={renderCell}
          isSearchEnabled={true}
          onRowClick={handleRowClick}
        />
        <PurchaseOrderDrawer
          isDrawerOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          customerPurchaseOrder={customerPurchaseOrder}
        />
      </div>
    </>
  );
}
