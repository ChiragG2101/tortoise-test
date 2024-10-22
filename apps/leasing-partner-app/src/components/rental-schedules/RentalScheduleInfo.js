import React, { useMemo } from 'react';
import { skipToken } from '@reduxjs/toolkit/query';
import { useGetRentalScheduleByIDQuery } from '@/features/rental-schedule/api';
import { notFound } from 'next/navigation';
import { RENTAL_SCHEDULE_STATUS } from '@/features/rental-schedule/constants';
import RentalScheduleCell from './RentalScheduleCells';
import { CheckCircle, Signature } from '@phosphor-icons/react';

const RentalScheduleInfo = (props) => {
  const { rentalId } = props;

  const { data: rentalScheduleData, isLoading: isRentalScheduleDataLoading } =
    useGetRentalScheduleByIDQuery(rentalId ?? skipToken);

  const readyForSignStatData = () => {
    return [
      {
        title: 'Approved on',
        data: { lesser_approver: rentalScheduleData?.lessor_approver },
        name: 'approved_on',
        logo: <CheckCircle size={16} color='#2ac393' weight='fill' />,
      },
      {
        title: 'Signed on',
        data: { signed_by: rentalScheduleData?.signed_by?.lessor },
        name: 'signed_on',
        logo: <Signature size={16} color='#b59cf7' />,
      },
    ];
  };

  const statistics = useMemo(() => {
    let summaryTabs = [
      {
        title: rentalScheduleData?.organization.name,
        logo: rentalScheduleData?.organization.logo,
        data: '',
        name: 'organization',
      },
      {
        title: 'Issued State/UT',
        data: rentalScheduleData?.state_name,
        name: 'state_name',
      },
      {
        title: 'Commencement date',
        data: rentalScheduleData?.commencement_date,
        name: 'commencement_date',
      },
    ];

    switch (rentalScheduleData?.status) {
      case RENTAL_SCHEDULE_STATUS.READY_FOR_SIGNING:
        summaryTabs = [...summaryTabs, ...readyForSignStatData()];
        break;
    }

    return summaryTabs;
  }, [rentalScheduleData]);

  if (!isRentalScheduleDataLoading && !rentalScheduleData) {
    return notFound();
  }

  // grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4
  return (
    <div className='w-full flex flex-1 flex-wrap gap-4 text-left border-1 border-black-3 rounded-lg p-4'>
      {statistics.map((stat, idx) => {
        return (
          <RentalScheduleCell key={stat.name} idx={idx} statistics={stat} />
        );
      })}
    </div>
  );
};

export default RentalScheduleInfo;
