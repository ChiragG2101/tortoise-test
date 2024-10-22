import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { formatAsCurrency } from '@/features/common/utils';
import { Spinner } from '@nextui-org/react';
import Invoices from './Invoices';

const TitleSubtitleItem = ({ title, subtitle, isLeftBorder }) => {
  return (
    <div
      className={`flex flex-col gap-2 ${isLeftBorder && 'pl-9 border-l-1 border-black-3'}`}
    >
      <p className='text-sm font-medium text-black-8 opacity-60	'>
        {title || '-'}
      </p>
      <p className='text-base leading-5 font-semibold text-black-8'>
        {subtitle || '-'}
      </p>
    </div>
  );
};

const Billing = ({
  status,
  monthYear,
  isBillingOverviewLoading,
  billingOverview,
  configId,
}) => {
  const [selectedBillingOverview, setSelectedBillingOverview] = useState(
    billingOverview?.state_wise_overview?.[0]
  );

  useEffect(() => {
    setSelectedBillingOverview(billingOverview?.state_wise_overview?.[0]);
  }, [billingOverview]);

  if (!configId || !monthYear) {
    return null;
  }

  if (isBillingOverviewLoading) {
    return (
      <div className='flex px-5 items-center justify-center'>
        <Spinner color='primary' />
      </div>
    );
  }

  if (!billingOverview) {
    return (
      <div className='flex flex-col mx-5 h-96 items-center justify-center border border-black-2 rounded-lg'>
        <p>No data to display</p>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-5 px-5'>
      <div className='flex justify-between border border-black-2 rounded-xl p-5'>
        <TitleSubtitleItem
          title='Due date'
          subtitle={billingOverview?.due_from}
          isLeftBorder={false}
        />
        <TitleSubtitleItem
          title='Total amount'
          subtitle={formatAsCurrency(billingOverview?.total_amount ?? 0)}
          isLeftBorder={false}
        />
      </div>

      <Invoices
        status={status}
        configId={configId}
        selectedBillingOverview={selectedBillingOverview}
        setSelectedBillingOverview={setSelectedBillingOverview}
        billingOverview={billingOverview}
      />
    </div>
  );
};

Billing.propTypes = {
  status: PropTypes.string,
  monthYear: PropTypes.object,
  isBillingOverviewLoading: PropTypes.bool,
  billingOverview: PropTypes.object,
  configId: PropTypes.string,
};

export default Billing;
