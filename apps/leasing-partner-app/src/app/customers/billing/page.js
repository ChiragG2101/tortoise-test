'use client';

import React, { useState } from 'react';
import { IconTitlePageHeading } from '@repo/ui/components';
import { PAYMENT_SOURCE_TYPE } from '@/features/customer-billing/constants';
import { Notepad } from '@phosphor-icons/react';
import SecurityDeposits from '@/components/customers/billing/SecurityDeposits';
import Invoices from '@/components/customers/billing/Invoices';
import OrganizationSelect from '@/components/common/form/OrganizationSelect';

const Billing = () => {
  const [selectedOrganization, setSelectedOrganization] = useState(null);

  return (
    <div className='flex flex-col gap-5'>
      <IconTitlePageHeading title='Customer Billing' Icon={Notepad} />
      <div className='w-80 px-5 pb-5'>
        <OrganizationSelect setSelectedOrganization={setSelectedOrganization} />
      </div>

      {selectedOrganization?.payment_source === PAYMENT_SOURCE_TYPE.ADVANCE && (
        <SecurityDeposits
          title='Security deposits'
          selectedOrganization={selectedOrganization}
        />
      )}

      {selectedOrganization && (
        <Invoices
          title='Invoices'
          tabProps={{ className: 'text-xs' }}
          selectedOrganization={selectedOrganization}
        />
      )}
    </div>
  );
};

Billing.propTypes = {};

export default Billing;
