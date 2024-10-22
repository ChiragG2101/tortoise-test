'use client';

import { useMemo } from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Spinner,
  Pagination,
  Input,
} from '@nextui-org/react';
import { MagnifyingGlass } from '@phosphor-icons/react';

export default function CustomTableWrapper({
  columns,
  isLoading,
  searchPlaceholder = 'Search',
  renderCell,
  onSortChange,
  sortConfig,
  pagination = false,
  filteredRows,
  page,
  handlePageChange,
  pages,
  searchTerm,
  onSearchChange,
  handleRowClick,
  buttonContent,
}) {
  const sortedRows = useMemo(() => {
    if (!sortConfig.column) return filteredRows;
    return [...filteredRows].sort((a, b) => {
      const isReversed = sortConfig.direction === 'descending' ? 1 : -1;
      const aValue = a[sortConfig.column];
      const bValue = b[sortConfig.column];
      return isReversed * (aValue < bValue ? -1 : aValue > bValue ? 1 : 0);
    });
  }, [filteredRows, sortConfig]);

  return (
    <div className='flex flex-col gap-5'>
      <div className='flex items-center justify-between px-5'>
        <Input
          placeholder={searchPlaceholder}
          size='small'
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className='w-fit'
          startContent={<MagnifyingGlass size={16} />}
        />
        {buttonContent && buttonContent}
      </div>
      <Table
        aria-label='Data Table'
        className='px-5'
        sortDescriptor={sortConfig}
        onSortChange={onSortChange}
        bottomContent={
          pagination && pages > 0 ? (
            <div className='flex w-full justify-end'>
              <Pagination
                isCompact
                showControls
                showShadow
                color='primary'
                page={page}
                total={pages}
                onChange={handlePageChange}
              />
            </div>
          ) : null
        }
      >
        <TableHeader>
          {columns.map((column) => (
            <TableColumn allowsSorting key={column.key}>
              {column.label}
            </TableColumn>
          ))}
        </TableHeader>
        <TableBody
          loadingContent={<Spinner color='primary' />}
          loadingState={isLoading ? 'loading' : 'idle'}
          emptyContent='No data found'
        >
          {sortedRows?.map((row, index) => (
            <TableRow
              key={index}
              onClick={handleRowClick ? () => handleRowClick(row) : null}
              className={handleRowClick ? 'cursor-pointer' : ''}
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
    </div>
  );
}
