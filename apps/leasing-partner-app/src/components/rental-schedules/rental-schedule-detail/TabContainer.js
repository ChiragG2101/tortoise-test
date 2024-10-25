import React, { useCallback, useMemo, useState } from 'react';
import { TabGroup } from '@repo/ui/components';
import {
  useGetRentalScheduleByIDQuery,
  useGetTemplatesQuery,
} from '@/features/rental-schedule/api';
// import { RENTAL_SCHEDULE_STATUS } from '@/features/rental-schedule/constants';
import Devices from './Devices';
import SecurityDeposits from './SecurityDeposits';
import DownloadReport from './DownloadReport';

export default function TabContainer({ rentalScheduleId }) {
  const [activeTab, setActiveTab] = useState('devices');

  const { data: rentalScheduleData } = useGetRentalScheduleByIDQuery(
    rentalScheduleId ?? skipToken
  );

  const { data: templateData } = useGetTemplatesQuery();

  const hasSecurityDeposits =
    rentalScheduleData?.is_security_deposit_required ?? false;
  const rentalScheduleStatus = rentalScheduleData?.status;

  const handleTabChange = useCallback(
    (key) => {
      setActiveTab(key);
    },
    [setActiveTab]
  );

  const tabs = useMemo(
    () => [
      { key: 'devices', label: 'Devices' },
      ...(hasSecurityDeposits
        ? [{ key: 'security_deposits', label: 'Security Deposits' }]
        : []),
      //   ...(rentalScheduleStatus === RENTAL_SCHEDULE_STATUS.CONFIRMED
      //     ? [{ key: 'invoices', label: 'Invoices' }]
      //     : []),
    ],
    [hasSecurityDeposits, rentalScheduleStatus]
  );

  const getTabLabel = useCallback(
    (key) => {
      const tab = tabs.find((tab) => tab.key === key);
      return tab ? tab.label : '';
    },
    [tabs]
  );

  const getTabComponent = useCallback(
    (key) => {
      switch (key) {
        case 'devices':
          return <Devices rentalScheduleId={rentalScheduleId} />;
        case 'security_deposits':
          return <SecurityDeposits rentalScheduleId={rentalScheduleId} />;
        default:
          return <></>;
      }
    },
    [rentalScheduleId]
  );

  return (
    <>
      <div className='flex justify-between items-center'>
        {tabs.length > 1 ? (
          <TabGroup
            activeTab={activeTab}
            tabs={tabs}
            onSelectionChange={handleTabChange}
          />
        ) : (
          <div className='text-xl font-semibold'>{getTabLabel(activeTab)}</div>
        )}

        {templateData?.[0]?.internal_key === 'rental_schedule' && (
          <DownloadReport
            templateData={templateData?.[0]}
            consolidatedRentalScheduleId={rentalScheduleId}
          />
        )}
      </div>
      {getTabComponent(activeTab)}
    </>
  );
}
