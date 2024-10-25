'use client';

import { useGetLessorActiveOrganisationsQuery } from '@/features/lessor/api';
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Input,
  User,
  Spinner,
} from '@nextui-org/react';
import { skipToken } from '@reduxjs/toolkit/query';
import { MagnifyingGlass, UsersThree } from '@phosphor-icons/react';
import { format } from 'date-fns';
import { useCallback, useMemo, useState } from 'react';
import ActiveCustomerDrawer from './drawer';
import { useSelector } from 'react-redux';
import { IconTitlePageHeading } from '@repo/ui/components';

const columns = Object.freeze([
  { key: 'organization_name', label: 'Customer' },
  { key: 'credit_utilised', label: 'Credit Utilised' },
  { key: 'total_credit_limit', label: 'Total Credit Limit' },
  { key: 'active_rental_schedules', label: 'Active Rental Schedules' },
  { key: 'latest_payment', label: 'Latest Payment' },
]);

export default function Customers() {
  const user = useSelector((state) => state.auth.user);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({
    column: 'organization_name',
    direction: 'ascending',
  });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);

  const handleRowClick = (rowData) => {
    setSelectedRowData(rowData);
    toggleDrawer();
  };

  const toggleDrawer = () => {
    setIsDrawerOpen((prevState) => !prevState);
  };

  const { data: activeCustomers, isLoading: isActiveCustomersLoading } =
    useGetLessorActiveOrganisationsQuery(user?.lessor ?? skipToken);

  const filteredRows = useMemo(() => {
    if (!activeCustomers) return [];
    return activeCustomers?.filter((row) =>
      row?.organization_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, activeCustomers]);

  const sortedRows = useMemo(() => {
    if (!sortConfig.column) return filteredRows;
    return [...filteredRows].sort((a, b) => {
      const isReversed = sortConfig.direction === 'descending' ? 1 : -1;
      const aValue = a[sortConfig.column];
      const bValue = b[sortConfig.column];
      return isReversed * (aValue < bValue ? -1 : aValue > bValue ? 1 : 0);
    });
  }, [filteredRows, sortConfig]);

  const renderCell = useCallback((customer, columnKey) => {
    switch (columnKey) {
      case 'organization_name':
        return <User size={24} name={customer.organization_name} />;
      case 'latest_payment':
        return customer?.latest_payment ? (
          <>
            <div className='body-xsmall'>
              {customer?.latest_payment?.amount}
            </div>
            <div className='text-xs text-darkGrey'>
              paid on{' '}
              {format(
                new Date(customer?.latest_payment?.paid_date),
                'dd MMM yyyy'
              )}
            </div>
          </>
        ) : (
          <>-</>
        );
      default:
        return customer[columnKey];
    }
  }, []);

  return (
    <div className='flex flex-col gap-5'>
      <IconTitlePageHeading Icon={UsersThree} title={'Customers'} />
      <Input
        placeholder='Search by name'
        size='small'
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className='w-fit px-5'
        startContent={<MagnifyingGlass size={16} />}
      />
      <Table
        aria-label='Active Customers'
        className='px-5'
        sortDescriptor={sortConfig}
        onSortChange={setSortConfig}
      >
        <TableHeader>
          {columns.map((column) => (
            <TableColumn key={column.key} allowsSorting>
              {column.label}
            </TableColumn>
          ))}
        </TableHeader>
        <TableBody
          loadingContent={<Spinner color='primary' />}
          loadingState={isActiveCustomersLoading ? 'loading' : 'idle'}
        >
          {sortedRows.map((row, index) => (
            <TableRow
              key={index}
              onClick={() => handleRowClick(row)}
              className='cursor-pointer'
            >
              {columns.map((column) => (
                <TableCell key={column.key}>
                  {renderCell(row, column.key)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <ActiveCustomerDrawer
        isDrawerOpen={isDrawerOpen}
        onClose={toggleDrawer}
        title={selectedRowData?.organization_name}
        id={selectedRowData?.id}
      />
    </div>
  );
}
