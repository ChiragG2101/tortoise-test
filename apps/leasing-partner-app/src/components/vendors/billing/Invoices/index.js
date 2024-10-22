import React from 'react';
import PropTypes from 'prop-types';
import { Copy } from '@phosphor-icons/react';
import { toast } from 'react-toastify';
import { Button, useDisclosure } from '@nextui-org/react';
import { CheckCircle } from '@phosphor-icons/react';
import { BILLING_STATUS } from '@/features/vendor/constants';
import InvoiceCards from './InvoiceCards';
import DeliveredDevices from './DeliveredDevices';
import MarkAsPaidModal from './MarkAsPaidModal';

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
  const {
    isOpen: isOpenMarkPaid,
    onOpen: onOpenMarkPaid,
    onOpenChange: onOpenMarkPaidChange,
    onClose: onCloseMarkPaid,
  } = useDisclosure();

  const onMarkAsPaidClick = () => {
    onOpenMarkPaid();
  };

  const onCopy = () => {
    navigator.clipboard.writeText(selectedBillingOverview?.gstin);
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

        <div className='col-span-2 px-5'>
          <div
            className={`flex flex-col gap-5 ${status === BILLING_STATUS.UNPAID ? 'pb-5 mb-5 border-b-1' : ''}`}
          >
            <div className='flex justify-end items-center'>
              {/* <TitleSubtitleItem
                title={selectedBillingOverview?.state__name}
                subtitle={
                  selectedBillingOverview?.gstin
                    ? `GSTIN: ${selectedBillingOverview?.gstin}`
                    : '-'
                }
                copyIcon={
                  selectedBillingOverview?.gstin ? (
                    <Copy
                      size={18}
                      className='text-black-5'
                      onClick={onCopy}
                      style={{ cursor: 'pointer' }}
                    />
                  ) : null
                }
              /> */}
              {status === BILLING_STATUS.UNPAID && (
                <>
                  <Button
                    size='sm'
                    bordered
                    className='bg-green-7 text-white border border-green-9 rounded-lg px-5 shadow-[0px_1px_0px_0px_#167E62]'
                    endContent={<CheckCircle size={15} weight='fill' />}
                    onClick={onMarkAsPaidClick}
                  >
                    Mark as paid
                  </Button>
                  <MarkAsPaidModal
                    isOpen={isOpenMarkPaid}
                    onOpenChange={onOpenMarkPaidChange}
                    onClose={onCloseMarkPaid}
                    configId={configId}
                    billingOverview={billingOverview}
                    selectedBillingOverview={selectedBillingOverview}
                  />
                </>
              )}
            </div>
            {/* <TitleSubtitleItem
              title='Billing address'
              subtitle={selectedBillingOverview?.billing_address}
            /> */}
          </div>

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
  billingOverview: PropTypes.object,
};

export default Invoices;
