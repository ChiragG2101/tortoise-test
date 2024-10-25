'use client';

import { useState, useCallback, useMemo } from 'react';
import { CalendarDots } from '@phosphor-icons/react';
import { useGetRentalSchedulesQuery } from '@/features/rental-schedule/api';
import {
  TortoiseTable,
  OrganizationCellItem,
  TitleSubtitleItem,
} from '@repo/ui/components';
import { formatAsCurrency } from '@/features/common/utils';
import IconTitleHeadingTabsLayout from '@/components/common/layouts/page-heading/IconTitleTabsHeading';
import RentalSchedulePageSubheading from '@/components/rental-schedules/RentalSchedulePageSubheading';
import { RENTAL_SCHEDULE_STATUS } from '@/features/rental-schedule/constants';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';

const tabs = Object.freeze([
  { key: 'provisional', label: 'Provisional' },
  { key: 'frozen', label: 'For review' },
  { key: 'ready_for_signing', label: 'To be signed' },
  { key: 'confirmed', label: 'Confirmed' },
]);

const sortKeyMapping = Object.freeze({
  commencement_date: 'commencement_date',
});

const PAGE_SIZE = 20;

export default function RentalSchedules() {
  const [activeTab, setActiveTab] = useState('provisional');
  const router = useRouter();

  const handleTabChange = useCallback(
    (key) => {
      setActiveTab(key);
    },
    [setActiveTab]
  );

  const columns = useMemo(
    () => [
      { key: 'rental_schedule_number', label: 'Rental ID' },
      {
        key: 'commencement_date',
        label:
          activeTab === RENTAL_SCHEDULE_STATUS.PROVISIONAL
            ? 'Commences on'
            : 'Commenced on',
      },
      {
        key: 'total_rent_to_be_collected',
        label:
          activeTab === RENTAL_SCHEDULE_STATUS.PROVISIONAL
            ? 'Estimated rental value'
            : 'Total rent',
      },
      { key: 'tenure', label: 'Tenure (months)' },
      {
        key: 'organization',
        label:
          activeTab === RENTAL_SCHEDULE_STATUS.PROVISIONAL ||
          activeTab === RENTAL_SCHEDULE_STATUS.FROZEN
            ? 'To be shared with'
            : 'Shared with',
      },
      //   { key: 'signed_by', label: 'Signed by' }, TODO: Show the signed by person
    ],
    [activeTab]
  );

  const renderCell = useCallback((rentalSchedule, columnKey) => {
    switch (columnKey) {
      case 'rental_schedule_number':
        return (
          <TitleSubtitleItem
            title={rentalSchedule.rental_schedule_number}
            subtitle={rentalSchedule.state_name}
          />
        );
      case 'organization':
        return (
          <OrganizationCellItem
            name={rentalSchedule.organization.name}
            logo={rentalSchedule.organization.logo}
          />
        );
      case 'commencement_date':
        return format(
          new Date(rentalSchedule.commencement_date),
          'do MMMM yyyy'
        );
      case 'total_rent_to_be_collected':
        return formatAsCurrency(rentalSchedule[columnKey]);
      default:
        return rentalSchedule[columnKey];
    }
  }, []);

  const onRowClick = (rentalSchedule) => {
    const rentalScheduleId = rentalSchedule.id;
    router.push(`./rental-schedule/${rentalScheduleId}`);
  };

  return (
    <div className='flex flex-col gap-5'>
      <div>
        <IconTitleHeadingTabsLayout
          title='Rental Schedules'
          Icon={CalendarDots}
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
        <RentalSchedulePageSubheading status={activeTab} />
      </div>
      <div className='px-5'>
        <TortoiseTable
          columns={columns}
          queryHook={useGetRentalSchedulesQuery}
          queryParameters={{ status: activeTab }}
          pageSize={PAGE_SIZE}
          sortKeyMapping={sortKeyMapping}
          renderCell={renderCell}
          isSearchEnabled={true}
          onRowClick={onRowClick}
        />
      </div>
    </div>
  );
}
