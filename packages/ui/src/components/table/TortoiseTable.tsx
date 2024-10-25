import React, { useEffect, useMemo, useState } from "react";
import {
  Input,
  Pagination,
  SortDescriptor,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { MagnifyingGlass } from "@phosphor-icons/react";
import useDebounce from "@/hooks/useDebounce";

// Define types for the component props
interface Column {
  key: string;
  label: string;
}

interface SortConfig {
  column: string;
  direction: "ascending" | "descending";
}

interface QueryData {
  count: number;
  results: any[];
}

interface TortoiseTableProps {
  columns: Column[];
  pageSize: number;
  queryHook: (
    params: any,
    options: { skip: boolean }
  ) => {
    data: QueryData | undefined;
    isLoading: boolean;
    isFetching: boolean;
  };
  renderCell: (item: any, columnKey: string) => React.ReactNode;
  queryParameters?: Record<string, any>;
  onRowClick?: (item: any) => void;
  defaultSortConfig?: SortConfig;
  emptyContent?: string;
  isSearchEnabled?: boolean;
  searchPlaceholder?: string;
  sortKeyMapping?: Record<string, string>;
  tableName?: string;
  shouldSkip?: boolean;
}

const TortoiseTable: React.FC<TortoiseTableProps> = ({
  columns,
  pageSize,
  queryHook,
  renderCell,
  queryParameters = {},
  onRowClick = null,
  defaultSortConfig = null,
  emptyContent = "No rows to display.",
  isSearchEnabled = false,
  searchPlaceholder = "Search",
  sortKeyMapping = {},
  tableName = "Data Table",
  shouldSkip = false,
}) => {
  const [page, setPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortConfig, setSortConfig] = useState<SortDescriptor | null>(
    defaultSortConfig
  );

  // Debounce the search term to avoid excessive querying
  const debouncedSearchTerm = useDebounce(searchTerm, 300) as string;

  // Determine the ordering string based on the sort configuration
  const ordering = useMemo(() => {
    if (sortConfig?.column && sortConfig.column in sortKeyMapping) {
      return `${sortConfig.direction === "ascending" ? "" : "-"}${sortKeyMapping[sortConfig.column]}`;
    }
    return null;
  }, [sortConfig, sortKeyMapping]);

  // Reset page to 1 when ordering or query parameters change
  useEffect(() => {
    setPage(1);
  }, [ordering, queryParameters]);

  // Fetch data using the provided query hook
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

  // Handle search input changes
  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  // Calculate the total number of pages
  const pages = queryData?.count ? Math.ceil(queryData.count / pageSize) : 0;

  return (
    <div className="flex flex-col gap-5 ">
      {isSearchEnabled && (
        <Input
          placeholder={searchPlaceholder}
          size={"small" as "sm"}
          value={searchTerm}
          onChange={onSearchChange}
          className="w-fit"
          startContent={<MagnifyingGlass size={16} />}
        />
      )}
      <Table
        sortDescriptor={sortConfig || undefined}
        onSortChange={setSortConfig}
        aria-label={tableName}
        bottomContent={
          pages > 1 ? (
            <div className="flex w-full justify-end">
              <Pagination
                isCompact
                showControls
                showShadow
                color="primary"
                page={page}
                total={pages}
                onChange={(newPage) => {
                  setPage(newPage);
                }}
              />
            </div>
          ) : null
        }
      >
        <TableHeader>
          {columns.map((column) => (
            <TableColumn
              key={column.key}
              allowsSorting={column.key in sortKeyMapping}
            >
              {column.label}
            </TableColumn>
          ))}
        </TableHeader>
        <TableBody
          emptyContent={emptyContent}
          loadingContent={<Spinner color="primary" />}
          loadingState={isQueryLoading || isQueryFetching ? "loading" : "idle"}
        >
          {/* @ts-expect-error: Suppressing type error due to potential missing 'id' in item  */}
          {queryData?.results.map((item) => (
            <TableRow
              key={item.id}
              onClick={() => {
                if (onRowClick) onRowClick(item);
              }}
              className={`${onRowClick ? "cursor-pointer" : ""}`}
            >
              {columns.map((column) => (
                <TableCell key={`${item.id}-${column.key}`}>
                  {renderCell(item, column.key) ?? <></>}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TortoiseTable;
