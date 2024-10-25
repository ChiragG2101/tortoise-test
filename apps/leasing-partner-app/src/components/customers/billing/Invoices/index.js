import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import {
  TabGroup,
  TortoiseTable,
  TitleSubtitleItem,
} from '@repo/ui/components';
import { LESSOR_INVOICE_STATUS } from '@/features/customer-billing/constants';
import { useGetCustomerBillingQuery } from '@/features/customer-billing/api';
import MarkInvoiceAsPaidModal from '@/components/customers/billing/modal/MarkInvoiceAsPaidModal';
import UploadLessorInvoiceModal from '@/components/customers/billing/modal/UploadLessorInvoiceModal';
import { formatAsCurrency, getFullName } from '@/features/common/utils';
import { Button, useDisclosure } from '@nextui-org/react';
import { ArrowSquareOut, UploadSimple } from '@phosphor-icons/react';
import { format } from 'date-fns';

const tabKeys = Object.freeze({
  SETTLED: 'settled',
  UNPAID: 'unpaid',
  UPCOMING: 'upcoming',
});

const tabs = Object.freeze([
  { key: tabKeys.UPCOMING, label: 'Upcoming payments' },
  { key: tabKeys.UNPAID, label: 'Unpaid payments' },
  { key: tabKeys.SETTLED, label: 'Settled Payments' },
]);

const PAGE_SIZE = 15;

const TableButton = ({ onClick, content, tableButtonProps }) => (
  <Button
    size='sm'
    bordered
    color='primary'
    className='border-1 border-black-2 text-sm text-black-8'
    onClick={onClick}
    {...tableButtonProps}
  >
    {content}
  </Button>
);

const ViewInvoiceButton = ({ lessorInvoice }) => {
  if (lessorInvoice.document) {
    return (
      <a
        href={lessorInvoice.document}
        target='_blank'
        rel='noopener noreferrer'
      >
        <TableButton
          tableButtonProps={{
            endContent: <ArrowSquareOut className='text-black-5' />,
            startContent: <img src='/assets/logo/pdf.svg' />,
          }}
          content={'View Receipt'}
        />
      </a>
    );
  }
};

const Invoices = ({ title, selectedOrganization, tabsProps, tabProps }) => {
  const {
    isOpen: isOpenUpload,
    onOpen: onOpenUpload,
    onOpenChange: onOpenUploadChange,
    onClose: onCloseUpload,
  } = useDisclosure();
  const {
    isOpen: isOpenMarkPaid,
    onOpen: onOpenMarkPaid,
    onOpenChange: onOpenMarkPaidChange,
    onClose: onCloseMarkPaid,
  } = useDisclosure();

  const [activeTab, setActiveTab] = useState(tabKeys.UPCOMING);
  const [lessorInvoiceForUpload, setLessorInvoiceForUpload] = useState(null);
  const [lessorInvoiceToBeMarkedPaid, setLessorInvoiceToBeMarkedPaid] =
    useState(null);

  const onUploadClick = (lessorInvoice) => {
    setLessorInvoiceForUpload(lessorInvoice);
    onOpenUpload();
  };

  const onMarkAsPaidClick = (lessorInvoice) => {
    setLessorInvoiceToBeMarkedPaid(lessorInvoice);
    onOpenMarkPaid();
  };

  const columns = useMemo(
    () => [
      { key: 'consolidated_rental_schedule', label: 'Rental schedule' },
      ...(activeTab === tabKeys.SETTLED
        ? [{ key: 'paid_amount', label: 'Settlement amount' }]
        : activeTab === tabKeys.UNPAID
          ? [{ key: 'pending_amount', label: 'Unpaid amount' }]
          : [{ key: 'total_payable_amount', label: 'Total payable' }]),
      // { key: 'payment_month', label: 'Payment Month' },
      ...(activeTab === tabKeys.UNPAID || activeTab === tabKeys.UPCOMING
        ? [{ key: 'due_from_date', label: 'Due date' }]
        : []),
      ...(activeTab === tabKeys.UNPAID
        ? [{ key: 'due_till_date', label: 'Pay by' }]
        : []),
      ...(activeTab === tabKeys.SETTLED
        ? [{ key: 'paid_date', label: 'Paid On' }]
        : []),
      ...(activeTab === tabKeys.SETTLED
        ? [{ key: 'paid_marked_by', label: 'Marked as paid by' }]
        : []),
      // ...(activeTab === tabKeys.SETTLED
      //   ? [{ key: 'invoice_with_upload', label: 'Updated credit balance' }]
      //   : []),
      ...(activeTab === tabKeys.SETTLED
        ? [{ key: 'view_invoice', label: '' }]
        : activeTab === tabKeys.UNPAID
          ? [{ key: 'mark_as_paid_invoice', label: '' }]
          : [{ key: 'upload_invoice', label: '' }]),
    ],
    [activeTab]
  );

  const filters = useMemo(() => {
    switch (activeTab) {
      case tabKeys.UPCOMING:
        return {
          status__in: [
            LESSOR_INVOICE_STATUS.DRAFT,
            LESSOR_INVOICE_STATUS.UPCOMING,
          ],
          ordering: '-due_from_date',
        };
      case tabKeys.UNPAID:
        return {
          status__in: [
            LESSOR_INVOICE_STATUS.DUE,
            LESSOR_INVOICE_STATUS.OVERDUE,
          ],
          ordering: '-due_till_date',
        };
      case tabKeys.SETTLED:
        return {
          status: LESSOR_INVOICE_STATUS.PAID,
          ordering: '-paid_date',
          // todo: add date and organization filters later for settled requests
        };
      default:
        break;
    }
  }, [activeTab]);

  const renderCell = useCallback((lessorInvoice, columnKey) => {
    switch (columnKey) {
      case 'consolidated_rental_schedule':
        const title =
          lessorInvoice['consolidated_rental_schedule']?.schedule_number;
        const stateName =
          lessorInvoice['consolidated_rental_schedule']?.state_name;
        return lessorInvoice['consolidated_rental_schedule'] ? (
          <TitleSubtitleItem
            title={
              title ? <span className='text-green-9'>{title}</span> : stateName
            }
            subtitle={title ? stateName : ''}
          />
        ) : (
          '-'
        );
      case 'paid_amount':
      case 'pending_amount':
      case 'total_payable_amount':
        return lessorInvoice[columnKey]
          ? formatAsCurrency(lessorInvoice[columnKey])
          : '-';
      case 'payment_month':
        return '-';
      case 'paid_marked_by':
        if (!lessorInvoice[columnKey]) return;
        const first_name = lessorInvoice[columnKey].first_name;
        const last_name = lessorInvoice[columnKey].last_name;
        const full_name = getFullName(first_name, last_name);
        const date = lessorInvoice.paid_marked_date
          ? format(new Date(lessorInvoice.paid_marked_date), 'do MMM yyyy')
          : '';
        return <TitleSubtitleItem title={full_name} subtitle={`on ${date}`} />;
      case 'due_from_date':
      case 'due_till_date':
      case 'paid_date':
        return lessorInvoice[columnKey]
          ? format(new Date(lessorInvoice[columnKey]), 'do MMM yyyy')
          : '-';
      case 'view_invoice':
        return <ViewInvoiceButton lessorInvoice={lessorInvoice} />;
      case 'upload_invoice':
        return (
          <TableButton
            onClick={() => onUploadClick(lessorInvoice)}
            content={'Upload Invoice'}
            tableButtonProps={{
              startContent: <UploadSimple />,
            }}
          />
        );
      case 'mark_as_paid_invoice':
        return (
          <div className='flex flex-row gap-2'>
            <TableButton
              onClick={() => onMarkAsPaidClick(lessorInvoice)}
              content={'Mark as Paid'}
            />
            <ViewInvoiceButton lessorInvoice={lessorInvoice} />
          </div>
        );
      default:
        return lessorInvoice[columnKey];
    }
  }, []);

  const handleTabChange = useCallback(
    (key) => {
      setActiveTab(key);
    },
    [setActiveTab]
  );

  return (
    <>
      <div className='px-5 text-base	font-semibold leading-tight'>{title}</div>
      <div className='px-5'>
        <TabGroup
          activeTab={activeTab}
          tabs={tabs}
          onSelectionChange={handleTabChange}
          tabsProps={tabsProps}
          tabProps={tabProps}
        />
      </div>

      <div className='flex flex-col px-5'>
        <TortoiseTable
          columns={columns}
          queryHook={useGetCustomerBillingQuery}
          queryParameters={{
            filters: {
              ...filters,
              billed_to_id: selectedOrganization?.organization?.id,
            },
          }}
          pageSize={PAGE_SIZE}
          renderCell={renderCell}
          isSearchEnabled={true}
        />
      </div>
      {activeTab === tabKeys.UPCOMING && (
        <UploadLessorInvoiceModal
          isOpen={isOpenUpload}
          onOpenChange={onOpenUploadChange}
          onClose={onCloseUpload}
          lessorInvoice={lessorInvoiceForUpload}
        />
      )}
      {activeTab === tabKeys.UNPAID && (
        <MarkInvoiceAsPaidModal
          isOpen={isOpenMarkPaid}
          onOpenChange={onOpenMarkPaidChange}
          onClose={onCloseMarkPaid}
          lessorInvoice={lessorInvoiceToBeMarkedPaid}
        />
      )}
    </>
  );
};

Invoices.propTypes = {
  title: PropTypes.string,
  selectedOrganization: PropTypes.object,
  tabsProps: PropTypes.object,
  tabProps: PropTypes.object,
};

export default Invoices;
