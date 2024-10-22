'use client';

import React, { useCallback, useMemo, useState } from 'react';
import { Notepad, CalendarBlank } from '@phosphor-icons/react';
import { TabGroup } from '@/components/common/group';
import { BILLING_STATUS, getStatusFilter } from '@/features/vendor/constants';
import Billing from '@/components/vendors/billing';
import SupplierSelect from '@/components/common/form/SupplierSelect';
import MonthYearSelect from '@/components/common/MonthYearSelect';
import { useGetBillingOverviewQuery } from '@/features/vendor/api';

const statusTabs = Object.freeze([
  { key: BILLING_STATUS.UPCOMING, label: 'Upcoming payments' },
  { key: BILLING_STATUS.UNPAID, label: 'Unpaid payments' },
  { key: BILLING_STATUS.PAID, label: 'Settled Payments' },
]);

export default function VendorBilling() {
  const [activeTab, setActiveTab] = useState(BILLING_STATUS.UPCOMING);
  const [activeCycle, setActiveCycle] = useState('cycle_1');
  const [monthYear, setMonthYear] = useState(null);
  const [selectedConfig, setSelectedConfig] = useState(null);

  const { data: billingOverview, isLoading: isBillingOverviewLoading } =
    useGetBillingOverviewQuery(
      {
        configId: selectedConfig?.id,
        due_month: monthYear?.month,
        due_year: monthYear?.year,
        statusFilter: getStatusFilter(activeTab),
      },
      { skip: !selectedConfig?.id || !monthYear }
    );

  const handleTabChange = useCallback(
    (key) => {
      setActiveTab(key);
    },
    [setActiveTab]
  );

  const cycleTabs = useMemo(() => {
    return billingOverview?.map((item, index) => ({
      key: `cycle_${index + 1}`,
      label: (
        <div className='flex flex-row gap-2 items-center justify-center'>
          <CalendarBlank size={16} />
          {`Cycle ${index + 1}`}
        </div>
      ),
    }));
  }, [billingOverview, selectedConfig?.id]);

  return (
    <div className='flex flex-col gap-5'>
      <div className='flex justify-between px-5 pb-5 border-b-1'>
        <div className='flex items-center gap-2'>
          <Notepad size={32} weight='duotone' className='text-primary-dark' />
          <div className='font-semibold body-xlarge'>Vendor Billing</div>
        </div>

        <TabGroup
          activeTab={activeTab}
          tabs={statusTabs}
          onSelectionChange={handleTabChange}
        />
      </div>

      <div className='flex flex-col gap-5 px-5'>
        <p className='text-base leading-4	 font-semibold	text-black-10'>
          {statusTabs.find((tab) => tab.key === activeTab)?.label}
        </p>

        <div className='flex justify-between items-center'>
          <div className='flex justify-start items-center gap-3'>
            <div className='w-48'>
              <SupplierSelect setSelectedConfig={setSelectedConfig} />
            </div>
            <MonthYearSelect setMonthYear={setMonthYear} />
          </div>
          <div>
            <TabGroup
              activeTab={activeCycle}
              tabs={cycleTabs || []}
              onSelectionChange={setActiveCycle}
              tabsProps={{ variant: 'underlined' }}
            />
          </div>
        </div>
      </div>

      <Billing
        status={activeTab}
        monthYear={monthYear}
        isBillingOverviewLoading={isBillingOverviewLoading}
        billingOverview={billingOverview?.[activeCycle.split('_')[1] - 1]}
        configId={selectedConfig?.id}
      />
    </div>
  );
}
