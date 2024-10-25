import { Tabs, Tab } from '@nextui-org/react';
import { CustomTortoiseDrawer } from '@repo/ui/components';
import CustomerDetailsTab from '@/components/customers/active-customers/tabs/CustomerDetails';
import { useState } from 'react';
import CreditUnderwritingTab from '@/components/customers/active-customers/tabs/CreditUnderwriting';

export default function ActiveCustomerDrawer({
  isDrawerOpen,
  title,
  onClose,
  id,
}) {
  const [selectedTab, setSelectedTab] = useState('customer-details');
  return (
    <CustomTortoiseDrawer
      isDrawerOpen={isDrawerOpen}
      onClose={onClose}
      hasNavigationControls={true}
      title={title}
    >
      <div className='px-8 bg-grey py-1 border-b-1 bg-black-1'>
        <Tabs
          key={'active-customers'}
          variant='solid'
          color=''
          radius='lg'
          aria-label='Active Customer'
          selectedKey={selectedTab}
          onSelectionChange={setSelectedTab}
        >
          <Tab key='customer-details' title='Customer Details' />
          <Tab key='credit-underwriting' title='Credit Underwriting' />
        </Tabs>
      </div>
      {selectedTab === 'customer-details' ? (
        <CustomerDetailsTab customerId={id} />
      ) : (
        <CreditUnderwritingTab customerId={id} />
      )}
    </CustomTortoiseDrawer>
  );
}
