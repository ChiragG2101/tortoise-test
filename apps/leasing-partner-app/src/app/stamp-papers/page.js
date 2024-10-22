'use client';

import AgreementTemplate from '@/components/stamp-papers/AgreementTemplate';
import TopBanner from '@/components/stamp-papers/TopBanner';
import { useGetStampsListQuery } from '@/features/stamps/api';
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Input,
  Button,
  Spinner,
} from '@nextui-org/react';
import { MagnifyingGlass, Stamp } from '@phosphor-icons/react';
import { useCallback, useMemo, useState } from 'react';
import StampsDrawer from './drawer';

const columns = Object.freeze([
  { key: 'state', label: 'State/UT', allowsSorting: true },
  { key: 'denomination', label: 'Denomination', allowsSorting: true },
  { key: 'unused', label: 'Remaining', allowsSorting: true },
  { key: 'total', label: 'Total stamp papers', allowsSorting: true },
  { key: 'used', label: 'Utilised', allowsSorting: true },
  { key: 'action', label: '', allowsSorting: false },
]);

const agreementTemplates = [
  {
    imgSrc: '/assets/agreement-template-red.svg',
    title: 'Master rental agreement',
    code: 'CG 8509502',
    denomination: '500',
  },
  {
    imgSrc: '/assets/agreement-template-green.svg',
    title: 'Master lease agreement',
    code: 'CG 8509502',
    denomination: '100',
  },
  {
    imgSrc: '/assets/agreement-template-green.svg',
    title: 'Rental schedule',
    code: 'CG 8509502',
    denomination: '100',
  },
];

export default function StampPapers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({
    column: null,
    direction: 'ascending',
  });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);

  const { data: stamps, isLoading: isStampsLoading } = useGetStampsListQuery();

  const totalUnused = useMemo(() => {
    return stamps?.reduce((acc, stamp) => acc + stamp.unused, 0) || 0;
  }, [stamps]);

  const totalStampPapers = useMemo(() => {
    return stamps?.reduce((acc, stamp) => acc + stamp.total, 0) || 0;
  }, [stamps]);

  const filteredRows = useMemo(() => {
    return stamps?.filter((row) =>
      row.state.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, stamps]);

  const sortedRows = useMemo(() => {
    if (!sortConfig.column) return filteredRows;
    return [...filteredRows].sort((a, b) => {
      const isReversed = sortConfig.direction === 'descending' ? 1 : -1;
      const aValue = a[sortConfig.column];
      const bValue = b[sortConfig.column];
      return isReversed * (aValue < bValue ? -1 : aValue > bValue ? 1 : 0);
    });
  }, [filteredRows, sortConfig]);

  const handleRowClick = useCallback((rowData) => {
    setSelectedRowData(rowData);
    setIsDrawerOpen((prevState) => !prevState);
  }, []);

  const renderCell = useCallback(
    (item, columnKey) => {
      switch (columnKey) {
        case 'action':
          return (
            <Button
              size='small'
              variant='bordered'
              onClick={() => handleRowClick(item)}
            >
              Request more
            </Button>
          );
        default:
          return item[columnKey];
      }
    },
    [handleRowClick]
  );

  return (
    <div className='flex flex-col gap-5'>
      <div className='flex items-center gap-2 px-5 pb-5 border-b-1'>
        <Stamp size={32} weight='duotone' className='text-primary-dark' />
        <div className='font-semibold body-xlarge'>Stamp Papers</div>
      </div>
      <TopBanner
        totalUnused={totalUnused}
        totalStampPapers={totalStampPapers}
      />
      <div className='flex flex-col gap-2 px-5'>
        <div className='font-semibold body-normal'>Agreement templates</div>
        <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-5'>
          {agreementTemplates.map((template) => (
            <AgreementTemplate key={template.title} {...template} />
          ))}
        </div>
      </div>
      <Input
        placeholder='Search by State/UT'
        size='small'
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className='w-fit px-5'
        startContent={<MagnifyingGlass size={16} />}
      />
      <div className='flex flex-col gap-2 px-5'>
        <div className='font-semibold body-normal'>
          State-wise/UT-wise stamp paper overview
        </div>
        <Table
          aria-label='Stamp Papers'
          sortDescriptor={sortConfig}
          onSortChange={setSortConfig}
        >
          <TableHeader>
            {columns.map((column) => (
              <TableColumn
                allowsSorting={column.allowsSorting}
                key={column.key}
              >
                {column.label}
              </TableColumn>
            ))}
          </TableHeader>
          <TableBody
            loadingContent={<Spinner color='primary' />}
            loadingState={isStampsLoading ? 'loading' : 'idle'}
          >
            {sortedRows?.map((row, index) => (
              <TableRow key={index}>
                {columns.map((column) => (
                  <TableCell key={column.key}>
                    {renderCell(row, column.key)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <StampsDrawer
        isDrawerOpen={isDrawerOpen}
        title={'Request stamp papers'}
        onClose={() => setIsDrawerOpen(false)}
        selectedRowData={selectedRowData}
      />
    </div>
  );
}
