'use client';
import React, { useCallback, useMemo, useState } from 'react';
import IconTitleHeadingTabsLayout from '@/components/common/layouts/page-heading/IconTitleTabsHeading';
import { Devices } from '@phosphor-icons/react';
import TortoiseTable from '@/components/common/table/TortoiseTable';
import { useSelector } from 'react-redux';
import { StatusChip } from '@repo/ui';
import { format, parseISO } from 'date-fns';
import {
  useAssetsQuery,
  useAssetForeclosureRequestsQuery,
  useAssetRequiringSaleInvoiceQuery,
} from '@/features/assets/api';
import { STATUS_COLORS } from '@/components/common/constants';
import ProductCellItem from '@/components/common/table/cell-item/ProductCellItem';
import OrganizationCellItem from '@/components/common/table/cell-item/OrganizationCellItem';
import AssetsDrawer from './drawer';
import {
  assetStatusToColorHighlight,
  assetStatusToLabel,
} from '@/features/assets/constants';

const tabKeys = {
  ASSIGNED: 'assigned',
  FORECLOSURE: 'foreclosure',
  RAISE_INVOICE: 'raise_invoice',
  SOLD: 'sold',
};

const tabs = Object.freeze([
  { key: tabKeys.ASSIGNED, label: 'Active Devices' },
  { key: tabKeys.FORECLOSURE, label: 'Termination Requests' },
  { key: tabKeys.RAISE_INVOICE, label: 'Raise Sale Invoice' },
  // { key: tabKeys.SOLD, label: 'Sold' },
]);

const columns = Object.freeze([
  { key: 'reference_number', label: 'Device ID (IMEI)' },
  { key: 'product', label: 'Device name' },
  { key: 'status', label: 'Status' },
  { key: 'purchase_dt', label: 'Ordered on' },
  { key: 'customer', label: 'Customer' },
]);

export default function AssetsPage() {
  const [activeTab, setActiveTab] = useState('active');
  const user = useSelector((state) => state.auth.user);

  const handleTabChange = useCallback(
    (key) => {
      setActiveTab(key);
    },
    [setActiveTab]
  );

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);

  const queryHook = useMemo(() => {
    switch (activeTab) {
      case tabKeys.ASSIGNED:
        return useAssetsQuery;
      case tabKeys.FORECLOSURE:
        return useAssetForeclosureRequestsQuery;
      case tabKeys.RAISE_INVOICE:
        return useAssetRequiringSaleInvoiceQuery;
    }
    return null;
  }, [activeTab]);

  const renderCell = useCallback((asset, columnKey) => {
    const cellValue = asset[columnKey];
    switch (columnKey) {
      case 'product':
        return <ProductCellItem products={[asset?.product]} />;
      case 'status':
        return (
          <StatusChip
            label={assetStatusToLabel[cellValue]}
            color={assetStatusToColorHighlight[cellValue]}
          />
        );
      case 'customer':
        return (
          <OrganizationCellItem
            name={asset?.customer?.name}
            logo={asset?.customer?.logo}
          />
        );
      case 'purchase_dt':
        return format(parseISO(cellValue), 'd MMM yyyy');
    }
    return cellValue;
  }, []);

  const onRowClick = (item) => {
    setIsDrawerOpen(true);
    setSelectedRowData(item);
  };

  return (
    <div>
      <div className='mb-5'>
        <IconTitleHeadingTabsLayout
          title={'Assets'}
          Icon={Devices}
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
      </div>
      <div className='flex flex-col px-5 gap-5'>
        {user?.lessor && queryHook && (
          <TortoiseTable
            queryHook={queryHook}
            columns={columns}
            pageSize={15}
            renderCell={renderCell}
            queryParameters={{ id: user?.lessor }}
            onRowClick={onRowClick}
          />
        )}
      </div>
      <AssetsDrawer
        isDrawerOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        selectedRowData={selectedRowData}
      />
    </div>
  );
}
