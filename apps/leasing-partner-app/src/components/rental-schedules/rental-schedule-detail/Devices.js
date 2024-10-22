import TortoiseTable from '@/components/common/table/TortoiseTable';
import ProductCellItem from '@/components/common/table/cell-item/ProductCellItem';
import TitleSubtitleItem from '@/components/common/table/cell-item/TitleSubtitleCellItem';
import { formatAsCurrency } from '@/features/common/utils';
import { ORDER_STATUS } from '@/features/order/constants';
import {
  useGetRentalScheduleBreakdownQuery,
  useGetRentalScheduleByIDQuery,
} from '@/features/rental-schedule/api';
import { RENTAL_SCHEDULE_STATUS } from '@/features/rental-schedule/constants';
import { Chip } from '@nextui-org/react';
import { format, formatDistanceToNowStrict } from 'date-fns';
import React, { useCallback, useMemo } from 'react';

const PAGE_SIZE = 15;

const OrderItem = ({ order }) => {
  const orderStatus = useMemo(() => {
    switch (order?.status) {
      case ORDER_STATUS.DELIVERED:
      case ORDER_STATUS.PROCESSED:
        return {
          title: 'Delivered',
          color: 'text-highlight-green-dark',
        };
      default:
        return { title: 'Not Delivered', color: 'text-highlight-yellow-dark' };
    }
  }, [order?.status]);
  return <span className={orderStatus.color}>{orderStatus.title}</span>;
};

const SecurityDepositItem = ({ security_deposit }) => {
  return (
    <Chip
      size='sm'
      className={
        security_deposit?.is_paid
          ? 'text-highlight-green-dark bg-highlight-green-light-1 text-sm'
          : 'text-highlight-yellow-dark bg-highlight-yellow-light-1 text-sm'
      }
    >
      {security_deposit?.is_paid ? 'Paid' : 'Not Paid'}
    </Chip>
  );
};

export default function Devices({ rentalScheduleId }) {
  const { data: rentalScheduleData, isLoading: isRentalScheduleDataLoading } =
    useGetRentalScheduleByIDQuery(rentalScheduleId ?? skipToken);
  const hasSecurityDeposits = rentalScheduleData?.is_security_deposit_required;
  const rentalScheduleStatus = rentalScheduleData?.status;

  const columns = useMemo(
    () => [
      { key: 'asset', label: 'Asset ID' },
      { key: 'device', label: 'Device' },
      { key: 'requested_on', label: 'Requested on' },
      ...(hasSecurityDeposits === true &&
      rentalScheduleStatus === RENTAL_SCHEDULE_STATUS.PROVISIONAL
        ? [{ key: 'delivery_status', label: 'Delivery status' }]
        : [{ key: 'delivered_on', label: 'Delivered on' }]),
      { key: 'total_amount_payable', label: 'Amount Payable' },
      ...(hasSecurityDeposits === true &&
      rentalScheduleStatus === RENTAL_SCHEDULE_STATUS.PROVISIONAL
        ? [{ key: 'security_deposit', label: 'Security Deposit' }]
        : []),
    ],
    [hasSecurityDeposits, rentalScheduleStatus]
  );

  const renderCell = useCallback(
    (breakdownItem, columnKey) => {
      switch (columnKey) {
        case 'asset':
          return breakdownItem.devices?.[0]?.id ?? '-';
        case 'device':
          return <ProductCellItem products={breakdownItem.order_devices} />;
        case 'requested_on':
          return (
            <TitleSubtitleItem
              title={`${formatDistanceToNowStrict(new Date(breakdownItem[columnKey]))} ago`}
              subtitle={format(
                new Date(breakdownItem[columnKey]),
                'do MMMM yyyy'
              )}
            />
          );
        case 'delivered_on':
          return breakdownItem?.order_details?.delivered_at
            ? format(
                new Date(breakdownItem.order_details.delivered_at),
                'do MMMM yyyy'
              )
            : '';
        case 'delivery_status':
          return (
            <TitleSubtitleItem
              title={<OrderItem order={breakdownItem.order_details} />}
              subtitle={
                breakdownItem.order_details?.delivered_at
                  ? format(
                      new Date(breakdownItem.order_details.delivered_at),
                      'do MMMM yyyy'
                    )
                  : ''
              }
            />
          );
        case 'total_amount_payable':
          return formatAsCurrency(breakdownItem[columnKey]);
        case 'security_deposit':
          return (
            <SecurityDepositItem
              security_deposit={breakdownItem.security_deposit}
            />
          );
        default:
          return breakdownItem[columnKey];
      }
    },
    [hasSecurityDeposits]
  );

  if (isRentalScheduleDataLoading) {
    return <></>;
  }
  return (
    <TortoiseTable
      columns={columns}
      queryHook={useGetRentalScheduleBreakdownQuery}
      queryParameters={{ rentalScheduleId: rentalScheduleId }}
      pageSize={PAGE_SIZE}
      renderCell={renderCell}
      isSearchEnabled={true}
    />
  );
}
