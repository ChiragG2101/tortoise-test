import CustomTortoiseDrawer, {
  CustomTortoiseDrawerBody,
} from '@/components/common/drawer';
import dynamic from 'next/dynamic';
import React from 'react';
import { useDispatch } from 'react-redux';
import { closeViewDocumentDrawer } from '@/features/rental-schedule/slice';
import { useSelector } from 'react-redux';
import {
  useGetSigningLinkQuery,
  useGetDocumentLinkQuery,
  useInitSigningWorkflowMutation,
} from '@/features/rental-schedule/api';
import { skipToken } from '@reduxjs/toolkit/query';
import { Button } from '@nextui-org/react';
import { toast } from 'react-toastify';
import { CheckCircle } from '@phosphor-icons/react';
import { RENTAL_SCHEDULE_STATUS } from '@/features/rental-schedule/constants';
const PDFViewer = dynamic(() => import('@/components/common/PDFViewer'), {
  ssr: false,
});

const ViewDocumentDrawerBody = ({ rentalSchedule }) => {
  const {
    data: documentLink,
    isLoading: isGetDocumentLinkLoading,
    isFetching: isGetDocumentLinkFetching,
  } = useGetDocumentLinkQuery(rentalSchedule?.id ?? skipToken);

  if (isGetDocumentLinkFetching || isGetDocumentLinkLoading) {
    return <></>;
  }
  if (documentLink?.document_url) {
    return (
      <CustomTortoiseDrawerBody>
        <PDFViewer file_url={documentLink.document_url} />
      </CustomTortoiseDrawerBody>
    );
  } else {
    return <p>No document available.</p>;
  }
};

const ViewDocumentDrawerFooter = ({ rentalSchedule }) => {
  const [initSigningWorkflow, { isLoading: isInitSigningWorkflowLoading }] =
    useInitSigningWorkflowMutation();

  const approveRentalSchedule = async (rentalSchedule) => {
    try {
      await initSigningWorkflow(rentalSchedule.id).unwrap();
      toast.success(
        'Approved rental schedule and initiated the signing workflow'
      );
    } catch {}
  };

  const { data: documentLink } = useGetDocumentLinkQuery(
    rentalSchedule?.id ?? skipToken
  );
  const { data: signingLinkData, isLoading: isSigningLinkDataLoading } =
    useGetSigningLinkQuery(
      rentalSchedule?.status == RENTAL_SCHEDULE_STATUS.READY_FOR_SIGNING
        ? rentalSchedule?.id ?? skipToken
        : skipToken
    );
  if (
    rentalSchedule.status == RENTAL_SCHEDULE_STATUS.FROZEN &&
    documentLink?.document_url
  ) {
    return (
      <div className='text-center'>
        <Button
          variant='solid'
          size='sm'
          className='bg-primary-main text-white border border-primary-dark'
          onClick={() => approveRentalSchedule(rentalSchedule)}
          isLoading={isInitSigningWorkflowLoading}
          startContent={<CheckCircle weight='fill' />}
        >
          Approve Rental Schedule
        </Button>
      </div>
    );
  } else if (
    rentalSchedule.status == RENTAL_SCHEDULE_STATUS.READY_FOR_SIGNING ||
    rentalSchedule.status == RENTAL_SCHEDULE_STATUS.CONFIRMED
  ) {
    return (
      <div className='w-full flex flex-col gap-2 items-center justify-center text-sm'>
        {rentalSchedule.signed_by?.lessor?.done_at ? (
          <div className='w-full flex items-center justify-center'>
            <span className='text-green-9'>
              Signed by: {rentalSchedule.signed_by.lessor.full_name}
            </span>
          </div>
        ) : (
          <Button
            variant='solid'
            size='sm'
            className='bg-primary-main text-white border border-primary-dark'
            isLoading={isSigningLinkDataLoading}
            onClick={() => {
              if (signingLinkData?.signing_url) {
                window.open(signingLinkData.signing_url, '_blank');
              }
            }}
            startContent={<CheckCircle weight='fill' />}
          >
            Approve Rental Schedule
          </Button>
        )}
        <div>
          {rentalSchedule.signed_by?.organization?.done_at ? (
            <span className='text-green-9'>Signed by the organization</span>
          ) : (
            <span className='text-red-900'>
              Yet to be signed by the organization
            </span>
          )}
        </div>
      </div>
    );
  }
  return null;
};

export default function ViewDocumentDrawer({ rentalSchedule }) {
  const dispatch = useDispatch();
  const isViewDocumentDrawerOpen = useSelector(
    (state) => state.rentalScheduleIdTab.isViewDocumentDrawerOpen
  );
  const { data: documentLink } = useGetDocumentLinkQuery(
    rentalSchedule?.id ?? skipToken
  );

  const handleDrawerClose = () => {
    dispatch(closeViewDocumentDrawer());
  };

  return (
    <CustomTortoiseDrawer
      isDrawerOpen={isViewDocumentDrawerOpen}
      onClose={handleDrawerClose}
      title={rentalSchedule.rental_schedule_number}
      footer={<ViewDocumentDrawerFooter rentalSchedule={rentalSchedule} />}
    >
      {isViewDocumentDrawerOpen && (
        <ViewDocumentDrawerBody rentalSchedule={rentalSchedule} />
      )}
    </CustomTortoiseDrawer>
  );
}
