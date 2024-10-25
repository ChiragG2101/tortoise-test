import { TortoiseTable } from '@repo/ui/components';
import { formatAsCurrency } from '@/features/common/utils';
import { useGetSecurityDepositPaymentsQuery } from '@/features/rental-schedule/api';
import { Button, useDisclosure } from '@nextui-org/react';
import React, { useCallback, useMemo, useState } from 'react';
import { format } from 'date-fns';
import { ArrowSquareOut, UploadSimple } from '@phosphor-icons/react';
import UploadSecurityDepositReceiptModal from './modal/UploadSecurityDepositReceiptModal';

const PAGE_SIZE = 15;

const ReceiptButton = ({ securityDeposit, onUploadClick }) => {
  if (securityDeposit.receipts && securityDeposit.receipts.length > 0) {
    return (
      <a
        href={securityDeposit.receipts[0]?.document}
        target='_blank'
        rel='noopener noreferrer'
      >
        <Button
          size='sm'
          bordered
          color='primary'
          className='border-1 border-black-2 text-sm text-black-8'
          endContent={<ArrowSquareOut className='text-black-5' />}
          startContent={<img src='/assets/logo/pdf.svg' />}
        >
          View Receipt
        </Button>
      </a>
    );
  }
  return (
    <Button
      size='sm'
      bordered
      color='primary'
      className='border-1 border-black-2 text-sm text-black-8'
      onPress={onUploadClick}
      startContent={<UploadSimple />}
    >
      Upload Receipt
    </Button>
  );
};

export default function SecurityDeposits({
  rentalScheduleId,
  pageSize = PAGE_SIZE,
}) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [selectedPaymentId, setSelectedPaymentId] = useState(null);

  const handleUploadClick = (securityDeposit) => {
    onOpen();
    setSelectedPaymentId(securityDeposit.payment);
  };

  const columns = useMemo(
    () => [
      { key: 'paid_on', label: 'Paid on' },
      { key: 'deposit_amount', label: 'Deposit Amount' },
      { key: 'paid_for', label: 'Paid for' },
      { key: 'utr_number', label: 'Transaction ID' },
      { key: 'receipt', label: '' },
    ],
    []
  );

  const renderCell = useCallback((securityDeposit, columnKey) => {
    switch (columnKey) {
      case 'paid_on':
        return format(new Date(securityDeposit.paid_on), 'do MMMM yyyy');
      case 'deposit_amount':
        return formatAsCurrency(securityDeposit.total_amount);
      case 'paid_for':
        return `${securityDeposit.total_devices} device${securityDeposit.total_devices === 1 ? '' : 's'}`;
      case 'receipt':
        return (
          <ReceiptButton
            securityDeposit={securityDeposit}
            onUploadClick={() => handleUploadClick(securityDeposit)}
          />
        );
      default:
        return securityDeposit[columnKey];
    }
  }, []);

  return (
    <>
      <TortoiseTable
        columns={columns}
        queryHook={useGetSecurityDepositPaymentsQuery}
        queryParameters={{ rentalScheduleId: rentalScheduleId }}
        pageSize={pageSize}
        renderCell={renderCell}
      />
      <UploadSecurityDepositReceiptModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onClose={onClose}
        paymentId={selectedPaymentId}
        rentalScheduleId={rentalScheduleId}
      />
    </>
  );
}
