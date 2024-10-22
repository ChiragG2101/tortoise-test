import React from 'react';
import PropTypes from 'prop-types';
import { Copy } from '@phosphor-icons/react';
import { toast } from 'react-toastify';
import { copyToClipboard } from '@/features/common/utils';
import InvoiceCards from './InvoiceCards';
import DeliveredDevices from './DeliveredDevices';

const TitleSubtitleItem = ({ title, subtitle, copyIcon }) => {
  return (
    <div className='flex flex-col gap-2'>
      <p className='text-sm font-semibold leading-5 text-black-10 '>
        {title || '-'}
      </p>
      <div className='flex gap-1 items-center'>
        <p className='text-sm font-medium leading-5 text-black-8 opacity-60 '>
          {subtitle || '-'}
        </p>
        {copyIcon}
      </div>
    </div>
  );
};

const Invoices = ({
  status,
  configId,
  selectedBillingOverview,
  setSelectedBillingOverview,
  billingOverview,
}) => {
  const onCopy = () => {
    copyToClipboard(selectedBillingOverview?.gstin);
    toast.success('GSTIN copied to clipboard!');
  };

  return (
    <div className='flex flex-col gap-3'>
      <p className='text-sm leading-4 font-semibold text-black-10'>Invoices</p>

      <div className='grid grid-cols-3 border border-black-3 rounded-xl p-5 gap-5'>
        <InvoiceCards
          list={billingOverview?.state_wise_overview}
          setSelectedBillingOverview={setSelectedBillingOverview}
        />

        <div className='col-span-2 px-5 flex flex-col gap-5'>
          {/* <div className='flex flex-col gap-5 pb-5 border-b-1'>
            <TitleSubtitleItem
              title={selectedBillingOverview?.state__name}
              subtitle={`GSTIN: ${selectedBillingOverview?.gstin}`}
              copyIcon={
                <Copy
                  size={18}
                  className='text-black-5'
                  onClick={onCopy}
                  style={{ cursor: 'pointer' }}
                />
              }
            />
            <TitleSubtitleItem
              title='Billing address'
              subtitle={selectedBillingOverview?.billing_address}
            />
          </div> */}

          <div className='flex flex-col gap-4'>
            <p className='text-sm font-semibold leading-4 text-black-10 '>
              Devices delivered
            </p>
            <DeliveredDevices
              status={status}
              selectedBillingOverview={selectedBillingOverview}
              configId={configId}
              billingOverview={billingOverview}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

Invoices.propTypes = {
  status: PropTypes.string,
  configId: PropTypes.string,
  selectedBillingOverview: PropTypes.object,
  setSelectedBillingOverview: PropTypes.func,
  billingOverview: PropTypes.array,
};

export default Invoices;
