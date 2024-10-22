import CustomTortoiseDrawer, {
  CustomTortoiseDrawerBody,
} from '@/components/common/drawer';
import { Button, Divider } from '@nextui-org/react';
import { format, parseISO } from 'date-fns';
import Info from '@/components/common/Info';
import History from '@/components/assets/History';
import { useSelector } from 'react-redux';
import {
  useAssetDetailQuery,
  useAssetHistoryQuery,
} from '@/features/assets/api';
import StatusChip from '@/components/common/chip/StatusChip';
import {
  assetStatusToColorHighlight,
  assetStatusToLabel,
} from '@/features/assets/constants';
import UploadSaleInvoiceFooter from '@/components/assets/UploadSaleInvoiceFooter';
import ApproveTerminationFooter from '@/components/assets/ApproveTerminationFooter';

export default function AssetsDrawer({
  isDrawerOpen,
  onClose,
  selectedRowData,
}) {
  const user = useSelector((state) => state.auth.user);
  const { data: history, isLoading: isHistoryLoading } = useAssetHistoryQuery(
    {
      organizationId: user?.lessor,
      assetId: selectedRowData?.id,
    },
    {
      skip: !selectedRowData?.id || !user?.lessor,
    }
  );

  const { data: assetData, isLoading: isAssetDataLoading } =
    useAssetDetailQuery(
      {
        organizationId: user?.lessor,
        assetId: selectedRowData?.id,
      },
      {
        skip: !selectedRowData?.id || !user?.lessor,
      }
    );

  return (
    <CustomTortoiseDrawer
      isDrawerOpen={isDrawerOpen}
      onClose={onClose}
      hasNavigationControls={true}
      title={selectedRowData?.reference_number}
      footer={
        assetData?.sale_of_asset_id ? (
          <UploadSaleInvoiceFooter
            organizationId={user?.lessor}
            assetId={selectedRowData?.id}
            onClose={onClose}
          />
        ) : (
          assetData?.termination_request_id && (
            <ApproveTerminationFooter
              terminationRequestId={assetData?.termination_request_id}
              assetId={selectedRowData?.id}
              onClose={onClose}
            />
          )
        )
      }
    >
      <CustomTortoiseDrawerBody>
        {!isAssetDataLoading && (
          <div className='flex flex-col gap-6'>
            <div className='flex flex-col gap-2'>
              <p className='font-semibold'>Device details</p>
              <div className='p-4 border border-b-2 border-black-3 rounded-lg'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-black-8 font-semibold text-base'>
                      IMEI number
                    </p>
                    <p className='text-black-6 font-medium text-sm'>
                      {selectedRowData?.reference_number}
                    </p>
                  </div>
                  <StatusChip
                    label={assetStatusToLabel[selectedRowData?.status]}
                    color={assetStatusToColorHighlight[selectedRowData?.status]}
                  />
                </div>
                {selectedRowData?.assignee?.id && (
                  <>
                    <Divider className='my-4 bg-black-3' />
                    <div className='flex items-center justify-between'>
                      <Info
                        label='Assigned to'
                        value={selectedRowData?.assignee?.email}
                      />
                    </div>
                  </>
                )}
                <Divider className='my-4 bg-black-3' />
                <div className='flex items-center gap-20'>
                  <Info
                    label='Ordered on'
                    value={
                      selectedRowData?.purchase_dt
                        ? format(
                            parseISO(selectedRowData.purchase_dt),
                            'do MMMM yyyy'
                          )
                        : 'N/A'
                    }
                  />
                  <Info
                    label='Customer'
                    value={selectedRowData?.customer?.name}
                  />
                </div>
              </div>
            </div>
            {!isHistoryLoading && history?.length > 0 && (
              <div className='flex flex-col gap-2'>
                <div>
                  <p className='font-semibold'>Device history</p>
                  <p className='text-black-7 text-xs'>
                    View status history of this device
                  </p>
                </div>
                <History history={history} />
              </div>
            )}
          </div>
        )}
      </CustomTortoiseDrawerBody>
    </CustomTortoiseDrawer>
  );
}
