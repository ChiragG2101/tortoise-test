import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@nextui-org/react';
import { DownloadSimple } from '@phosphor-icons/react';
import { format } from 'date-fns';
import TortoiseTable from '@/components/common/table/TortoiseTable';
import { useGetInvoicesListQuery } from '@/features/billing/api';
import { formatAsCurrency } from '@/features/common/utils';
import { getStatusFilter } from '@/features/billing/constants';
import ProductCellItem from '@/components/common/table/cell-item/ProductCellItem';

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
  { key: 'invoice' },
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
      case 'invoice':
        return (
          <a href={record?.document} target='_blank' rel='noopener noreferrer'>
            <Button
              size='sm'
              bordered
              color='primary'
              className='border-1 border-black-2 text-sm text-black-8'
              endContent={
                <DownloadSimple className='text-black-10' size={20} />
              }
              startContent={<img src='/assets/logo/pdf.svg' />}
            >
              Invoice
            </Button>
          </a>
        );
      default:
        return record[columnKey] ?? '-';
    }
  }, []);

  return (
    <div>
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
