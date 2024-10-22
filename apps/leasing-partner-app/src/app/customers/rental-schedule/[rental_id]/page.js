'use client';

import Statistics from '@/components/common/layouts/Statistics';
import RentalScheduleIdPageHeading from '@/components/rental-schedules/RentalScheduleIdPageHeading';
import ViewDocumentDrawer from '@/components/rental-schedules/ViewDocumentDrawer';
import { formatAsCurrency } from '@/features/common/utils';
import { useGetRentalScheduleByIDQuery } from '@/features/rental-schedule/api';
import { RENTAL_SCHEDULE_STATUS } from '@/features/rental-schedule/constants';
import { skipToken } from '@reduxjs/toolkit/query';
import { notFound, useParams } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { resetRentalScheduleIdState } from '@/features/rental-schedule/slice';
import TabContainer from '@/components/rental-schedules/rental-schedule-detail/TabContainer';
import RentalScheduleInfo from '@/components/rental-schedules/RentalScheduleInfo';

export default function RentalSchedulePage() {
  const params = useParams();
  const { data: rentalScheduleData, isLoading: isRentalScheduleDataLoading } =
    useGetRentalScheduleByIDQuery(params.rental_id ?? skipToken);

  const dispatch = useDispatch();

  useEffect(() => {
    if (rentalScheduleData) {
      dispatch(resetRentalScheduleIdState());
    }
  }, [rentalScheduleData]);

  const statistics = useMemo(
    () => [
      {
        title: 'Rental Amount',
        value: formatAsCurrency(rentalScheduleData?.total_rent_to_be_collected),
      },
      {
        title: 'Issued State/UT',
        value: rentalScheduleData?.state_name,
      },
      {
        title: 'Commencement date',
        value: rentalScheduleData?.commencement_date,
      },
      {
        title: 'Devices',
        value: rentalScheduleData?.number_of_devices,
      },
    ],
    [rentalScheduleData]
  );

  if (!isRentalScheduleDataLoading && !rentalScheduleData) {
    return notFound();
  }

  if (rentalScheduleData) {
    return (
      <>
        <RentalScheduleIdPageHeading rentalSchedule={rentalScheduleData} />
        <div className='mt-5 flex flex-col gap-5 px-5'>
          <RentalScheduleInfo rentalId={params.rental_id} />
          <Statistics data={statistics} />
          <TabContainer rentalScheduleId={rentalScheduleData?.id} />
        </div>
        {[
          RENTAL_SCHEDULE_STATUS.FROZEN,
          RENTAL_SCHEDULE_STATUS.READY_FOR_SIGNING,
          RENTAL_SCHEDULE_STATUS.CONFIRMED,
        ].includes(rentalScheduleData.status) && (
          <ViewDocumentDrawer rentalSchedule={rentalScheduleData} />
        )}
      </>
    );
  }
}
