import { useEffect, useMemo, useState } from 'react';
import {
  Input,
  Pagination,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/react';
import { MagnifyingGlass } from '@phosphor-icons/react';
import useDebounce from '@/hooks/useDebounce';

export default function TortoiseTable({
  columns,
  pageSize,
  queryHook,
  renderCell,
  queryParameters,
  onRowClick = null,
  defaultSortConfig = null,
  emptyContent = 'No rows to display.',
  isSearchEnabled = false,
  searchPlaceholder = 'Search',
  sortKeyMapping = {},
  tableName = 'Data Table',
  shouldSkip,
}) {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState(defaultSortConfig);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const ordering = useMemo(() => {
    if (sortConfig)
      return `${sortConfig.direction === 'ascending' ? '' : '-'}${sortKeyMapping[sortConfig.column]}`;
    return null;
  }, [sortConfig, sortKeyMapping]);

  useEffect(() => {
    setPage(1);
  }, [ordering, queryParameters]);

  const {
    data: queryData,
    isLoading: isQueryLoading,
    isFetching: isQueryFetching,
  } = queryHook(
    {
      page,
      ordering,
      search: debouncedSearchTerm,
      page_size: pageSize,
      ...queryParameters,
    },
    { skip: shouldSkip || !page }
  );

  const onSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  const pages = queryData?.count ? Math.ceil(queryData.count / pageSize) : 0;

  return (
    <div className='flex flex-col gap-5'>
      {isSearchEnabled && (
        <Input
          placeholder={searchPlaceholder}
          size='small'
          value={searchTerm}
          onChange={onSearchChange}
          className='w-fit'
          startContent={<MagnifyingGlass size={16} />}
        />
      )}
      <Table
        sortDescriptor={sortConfig}
        onSortChange={setSortConfig}
        aria-label={tableName}
        bottomContent={
          pages > 1 ? (
            <div className='flex w-full justify-end'>
              <Pagination
                isCompact
                showControls
                showShadow
                color='primary'
                page={page}
                total={pages}
                onChange={(page) => setPage(page)}
              />
            </div>
          ) : null
        }
      >
        <TableHeader>
          {columns.map((column) => (
            <TableColumn
              key={column.key}
              allowsSorting={sortKeyMapping[column.key] !== undefined}
            >
              {column.label}
            </TableColumn>
          ))}
        </TableHeader>
        <TableBody
          emptyContent={emptyContent}
          loadingContent={<Spinner color='primary' />}
          loadingState={isQueryLoading || isQueryFetching ? 'loading' : 'idle'}
        >
          {queryData?.results?.map((item) => (
            <TableRow
              key={item.id}
              onClick={() => onRowClick && onRowClick(item)}
              className={`${onRowClick ? 'cursor-pointer' : ''}`}
            >
              {columns.map((column) => (
                <TableCell key={`${item.id}-${column.key}`}>
                  {renderCell(item, column.key)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
