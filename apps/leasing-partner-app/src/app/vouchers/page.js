'use client';

import {
  useGetVouchersListQuery,
  useGetVouchersSummaryQuery,
} from '@/features/vouchers/api';
import { Chip, Card, CardHeader, CardBody, Tabs, Tab } from '@nextui-org/react';
import { Ticket } from '@phosphor-icons/react';
import { format, parseISO } from 'date-fns';
import { useCallback, useState } from 'react';
import { capitalizeFirstLetter } from '@/features/common/utils';
import { TortoiseTable } from '@repo/ui/components';

const columns = Object.freeze([
  { key: 'code', label: 'Voucher number' },
  { key: 'amount', label: 'Voucher amount' },
  { key: 'purchased_on', label: 'Voucher issue date' },
  { key: 'status', label: 'Voucher status' },
  { key: 'purchasedBy', label: 'Purchased by' },
]);

const statusStyles = Object.freeze({
  Issued: 'bg-[#F4F4F5] text-black',
  Redeemed: 'bg-[#E6FFE6] text-[#167E62]',
  Refunded: 'bg-[#FFEFEA] text-[#AA3628]',
});

const tabs = Object.freeze([
  { key: 'all', label: 'All' },
  { key: 'issued', label: 'Issued' },
  { key: 'redeemed', label: 'Redeemed' },
  { key: 'refunded', label: 'Refunded' },
]);

const summaryKeyToLabel = Object.freeze({
  total_vouchers: 'Total voucher received',
  total_issued_vouchers: 'Vouchers issued',
  total_redeemed_vouchers: 'Vouchers redeemed',
  total_refunded_vouchers: 'Vouchers refunded',
  total_amount: 'Total voucher amount',
});

const sortKeyMapping = Object.freeze({
  code: 'code',
  amount: 'amount',
  purchased_on: 'purchased_on',
  status: 'status',
});

const rowsPerPage = 10;

export default function Vouchers() {
  const [activeTab, setActiveTab] = useState('all');

  const { data: vouchersSummary } = useGetVouchersSummaryQuery();

  const handleTabChange = useCallback(
    (key) => {
      setActiveTab(key);
    },
    [setActiveTab]
  );

  const renderCell = useCallback((voucher, columnKey) => {
    const cellValue = voucher[columnKey];
    switch (columnKey) {
      case 'amount':
        return `₹ ${cellValue.toFixed(2)}`;
      case 'purchased_on':
        return format(parseISO(cellValue), 'd MMM yyyy');
      case 'status':
        const voucherStatus =
          voucher.status.toLowerCase() === 'active'
            ? 'Issued'
            : capitalizeFirstLetter(voucher.status);
        const chipStyle =
          statusStyles[voucherStatus] || 'bg-gray-200 text-gray-800';
        return <Chip className={chipStyle}>{voucherStatus}</Chip>;
      case 'purchasedBy':
        return (
          <div>
            <p className='font-semibold text-black-8'>
              {voucher?.consumer?.name}
            </p>
            <p className='text-xs text-black-6'>{voucher?.consumer?.email}</p>
          </div>
        );
    }
    return cellValue;
  }, []);

  return (
    <div className='flex flex-col gap-5'>
      <div className='px-5 pb-5 border-b-1 flex items-center justify-between'>
        <div className='flex items-center gap-2 '>
          <Ticket size={32} weight='duotone' className='text-primary-dark' />
          <div className='font-semibold body-xlarge'>Vouchers</div>
        </div>
        <Tabs initialValue={activeTab} onSelectionChange={handleTabChange}>
          {tabs.map((tab) => (
            <Tab key={tab.key} value={tab.key} title={tab.label} />
          ))}
        </Tabs>
      </div>
      <div className='px-5 gap-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5'>
        {Object?.keys(vouchersSummary ?? {}).map((key) => (
          <Card
            key={key}
            className='shadow-none bg-[#fafafa] text-primary-dark'
          >
            <CardHeader className='body-large'>
              {key === 'total_amount'
                ? `₹ ${vouchersSummary[key]}`
                : vouchersSummary[key]}
            </CardHeader>
            <CardBody className='body-small'>{summaryKeyToLabel[key]}</CardBody>
          </Card>
        ))}
      </div>

      <div className='p-5'>
        <TortoiseTable
          columns={columns}
          queryHook={useGetVouchersListQuery}
          queryParameters={{
            filters: {
              ...(activeTab !== 'all' && { status: activeTab }),
            },
          }}
          pageSize={rowsPerPage}
          sortKeyMapping={sortKeyMapping}
          defaultSortConfig={null}
          renderCell={renderCell}
          isSearchEnabled={true}
          searchPlaceholder='Search by number'
        />
      </div>
    </div>
  );
}
