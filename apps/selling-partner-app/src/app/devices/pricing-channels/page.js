'use client';

import CustomTableWrapper from '@/components/common/CustomTableWrapper';
import { Avatar, AvatarGroup, Button } from '@nextui-org/react';
import Link from 'next/link';
import { PlusCircle } from '@phosphor-icons/react';
import { Devices } from '@phosphor-icons/react/dist/ssr';
import { useCallback, useState } from 'react';
import PricingChannelsDrawer from './drawer';
import IconTitlePageHeading from '@/components/common/layouts/page-heading/IconTitlePageHeading';
import { useGetPricingChannelsListingQuery } from '@/features/pricing-channel/api';
import { format } from 'date-fns';
import StatusChip from '@/components/common/chip/StatusChip';
import { STATUS_COLORS } from '@/components/common/constants';

const columns = [
  { key: 'name', label: 'Pricing channel' },
  { key: 'created_at', label: 'Created on' },
  { key: 'organizations', label: 'Enabled for' },
];

export default function PricingChannels() {
  const { data: pricingChannels, isLoading: arePricingChannelsLoading } =
    useGetPricingChannelsListingQuery();

  const [sortConfig, setSortConfig] = useState({
    column: 'name',
    direction: 'ascending',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const sortedRows = pricingChannels ?? [];

  const filteredRows = sortedRows?.filter((row) =>
    row.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderCell = useCallback((row, columnKey) => {
    switch (columnKey) {
      case 'created_at':
        return format(new Date(row['created_at']), 'do MMMM yyyy');
      case 'status':
        return (
          <StatusChip
            label={<div className='capitalize'>{row['status']}</div>}
            color={(() => {
              switch (row['status']) {
                case 'processed':
                  return STATUS_COLORS.GREEN;
                case 'failed':
                  return STATUS_COLORS.RED;
                case 'processing':
                  return STATUS_COLORS.YELLOW;
                default:
                  return STATUS_COLORS.GREY;
              }
            })()}
          ></StatusChip>
        );
      case 'organizations':
        if (row['organizations'].count > 0) {
          return (
            <div className='flex'>
              <AvatarGroup
                isBordered
                max={row['organizations']?.selected_organizations?.length}
                size='sm'
                total={
                  row['organizations']?.count -
                  (row['organizations']?.selected_organizations?.length ?? 0)
                }
              >
                {row['organizations']?.selected_organizations.map((item) => (
                  <Avatar
                    size='sm'
                    key={item.name}
                    name={item.name}
                    src={item.logo}
                    className='object-cover'
                  />
                ))}
              </AvatarGroup>
            </div>
          );
        }
        return <>-</>;
      case 'name':
        return (
          <Link href={`/devices/pricing-channels/${row?.id}`}>
            {row[columnKey]}
          </Link>
        );
      default:
        return row[columnKey];
    }
  }, []);

  return (
    <div className='flex flex-col gap-5'>
      <IconTitlePageHeading title='Pricing Channels' Icon={Devices} />
      <CustomTableWrapper
        columns={columns}
        filteredRows={filteredRows}
        renderCell={renderCell}
        sortConfig={sortConfig}
        onSortChange={setSortConfig}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder='Search by channel'
        buttonContent={
          <Button
            className='btn-primary'
            startContent={<PlusCircle size={20} weight='fill' />}
            onClick={() => setIsDrawerOpen(true)}
          >
            Create pricing channel
          </Button>
        }
      />
      <PricingChannelsDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </div>
  );
}
