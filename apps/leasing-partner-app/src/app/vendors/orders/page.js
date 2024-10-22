'use client';

import { useCallback, useState } from 'react';
import { Package, CaretRight } from '@phosphor-icons/react';
import { Tooltip } from '@nextui-org/react';
import { format } from 'date-fns';
import TortoiseTable from '@/components/common/table/TortoiseTable';
import { usePurchaseOrdersQuery } from '@/features/customer/order/api';
import { TabGroup } from '@/components/common/group';
import ProductCellItem from '@/components/common/table/cell-item/ProductCellItem';
import { formatAsCurrency } from '@/features/common/utils';
import OrganizationCellItem from '@/components/common/table/cell-item/OrganizationCellItem';
import VendorsOrderDrawer from './drawer';

const PAGE_SIZE = 15;

const tabKeys = Object.freeze({
  PENDING: 'pending',
  READY_TO_SHIP: 'confirmed_by_supplier',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
});

const tabs = Object.freeze([
  { key: tabKeys.PENDING, label: 'Pending' },
  { key: tabKeys.READY_TO_SHIP, label: 'Ready to Ship' },
  { key: tabKeys.SHIPPED, label: 'Shipped' },
  { key: tabKeys.DELIVERED, label: 'Delivered' },
]);

const columns = Object.freeze([
  { key: 'id', label: 'Order ID' },
  { key: 'device', label: 'Device' },
  { key: 'created_at', label: 'Order date' },
  { key: 'organization', label: 'Customer' },
  { key: 'order_amount', label: 'Amount' },
  { key: 'potential_supplier', label: 'Vendor' },
  { key: 'caret', label: '' },
]);

const sortKeyMapping = Object.freeze({
  organization: 'organization__name',
  created_at: 'created_at',
});

export default function Orders() {
  const [activeTab, setActiveTab] = useState(tabKeys.PENDING);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [vendorOrder, setVendorOrder] = useState(null);

  const renderCell = useCallback((order, columnKey) => {
    switch (columnKey) {
      case 'id':
        return (
          <div className='flex flex-col'>
            <p>{order?.id}</p>
          </div>
        );
      case 'device':
        return <ProductCellItem products={order.products} />;
      case 'created_at':
        return format(new Date(order.created_at), 'd MMM yyyy');
      case 'organization':
        return (
          <OrganizationCellItem
            name={order?.organization?.name}
            logo={order?.organization?.logo}
          />
        );
      case 'order_amount':
        return formatAsCurrency(order?.order_amount);
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
      case 'caret':
        return <CaretRight size={20} weight='bold' color='#CBCBCB' />;
      default:
        return order[columnKey];
    }
  }, []);

  const handleTabChange = useCallback(
    (key) => {
      setActiveTab(key);
    },
    [setActiveTab]
  );

  const handleRowClick = (item) => {
    setIsDrawerOpen(true);
    setVendorOrder(item);
  };

  return (
    <div className='flex flex-col gap-5'>
      <div className='flex items-center justify-between px-5 pb-5 border-b-1'>
        <div className='flex items-center gap-2 '>
          <Package size={32} weight='duotone' className='text-primary-dark' />
          <div className='font-semibold body-xlarge'>Orders</div>
        </div>
        <TabGroup
          selectedKey={activeTab}
          tabs={tabs}
          onSelectionChange={handleTabChange}
          tabsProps={null}
          tabProps={null}
        />
      </div>

      <div className='px-5'>
        <TortoiseTable
          columns={columns}
          queryHook={usePurchaseOrdersQuery}
          queryParameters={{ status: activeTab }}
          pageSize={PAGE_SIZE}
          sortKeyMapping={sortKeyMapping}
          renderCell={renderCell}
          isSearchEnabled={true}
          searchPlaceholder='Search'
          onRowClick={handleRowClick}
        />
        <VendorsOrderDrawer
          isDrawerOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          vendorOrder={vendorOrder}
        />
      </div>
    </div>
  );
}
