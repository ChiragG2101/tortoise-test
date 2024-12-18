import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { TortoiseTable, ProductCellItem } from '@repo/ui/components';
import { useGetInvoicesListQuery } from '@/features/vendor/api';
import { formatAsCurrency } from '@/features/common/utils';
import { getStatusFilter } from '@/features/vendor/constants';

const PAGE_SIZE = 10;

const columns = Object.freeze([
  { key: 'order_id', label: 'Order ID' },
  {
    key: 'order',
    label: 'Order',
  },
  { key: 'imei_umber', label: 'IMEI number' },
  {
    key: 'delivered_on',
    label: 'Delivered on',
  },
  { key: 'amount', label: 'Amount' },
]);

const sortKeyMapping = Object.freeze({
  order_id: 'id',
});

const shouldSkip = (due_from, state__id, configId) => {
  return !due_from || !state__id || !configId;
};

const DeliveredDevices = ({
  status,
  configId,
  selectedBillingOverview,
  billingOverview,
}) => {
  const renderCell = useCallback((record, columnKey) => {
    const baseDevice =
      record?.devices?.find((device) => device?.type === 'base') ||
      record?.devices?.[0];

    switch (columnKey) {
      case 'order_id':
        return baseDevice?.parent_order_id;
      case 'order':
        return (
          <ProductCellItem
            products={record?.devices?.map((device) => ({
              short_name: device?.product__short_name,
              image_url: device?.product__image_url,
            }))}
          />
        );
      case 'amount':
        const totAmount = record?.devices.reduce(
          (total, device) => total + device?.price,
          0
        );
        return formatAsCurrency(totAmount);
      case 'delivered_on':
        return baseDevice?.delivered_at
          ? format(new Date(baseDevice?.delivered_at), 'yyyy-MM-dd')
          : '-';
      case 'imei_umber':
        return baseDevice?.product_reference_number || '-';
      default:
        return record[columnKey] ?? '-';
    }
  }, []);

  return (
    <div className='flex flex-col gap-5'>
      <TortoiseTable
        columns={columns}
        queryHook={useGetInvoicesListQuery}
        queryParameters={{
          configId: configId,
          filters: {
            state_id: selectedBillingOverview?.state__id,
            due_from: billingOverview?.due_from,
            ...getStatusFilter(status),
          },
        }}
        pageSize={PAGE_SIZE}
        sortKeyMapping={sortKeyMapping}
        defaultSortConfig={null}
        renderCell={renderCell}
        isSearchEnabled={true}
        searchPlaceholder='Search by order id'
        shouldSkip={shouldSkip(
          billingOverview?.due_from,
          selectedBillingOverview?.state__id,
          configId
        )}
      />
    </div>
  );
};

DeliveredDevices.propTypes = {
  status: PropTypes.string,
  configId: PropTypes.object,
  selectedBillingOverview: PropTypes.string,
  billingOverview: PropTypes.object,
};

export default DeliveredDevices;
