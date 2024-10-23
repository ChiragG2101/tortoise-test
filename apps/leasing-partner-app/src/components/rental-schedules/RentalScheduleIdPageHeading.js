import React from 'react';
import {
  BasePageHeading,
  BasePageHeadingIcon,
  BasePageHeadingStatus,
  BasePageHeadingTitleSubtitle,
} from '../common/layouts/page-heading/base';
import { ArrowLeft, Copy } from '@phosphor-icons/react';
import Link from 'next/link';
import { RENTAL_SCHEDULE_STATUS } from '@/features/rental-schedule/constants';
import { STATUS_COLORS } from '../common/constants';
import ViewRentalScheduleButton from './ViewRentalScheduleButton';
import { copyToClipboard } from '@/features/common/utils';

const RentalScheduleIdPageHeadingLeftSlot = ({ rentalSchedule }) => {
  const statusDisplayData = {
    [RENTAL_SCHEDULE_STATUS.PROVISIONAL]: {
      color: STATUS_COLORS.GREY,
      title: 'Provisional',
    },
    [RENTAL_SCHEDULE_STATUS.FROZEN]: {
      color: STATUS_COLORS.YELLOW,
      title: 'For review',
    },
    [RENTAL_SCHEDULE_STATUS.READY_FOR_SIGNING]: {
      color: STATUS_COLORS.PURPLE,
      title: 'To be signed',
    },
    [RENTAL_SCHEDULE_STATUS.CONFIRMED]: {
      color: STATUS_COLORS.GREEN,
      title: 'Confirmed',
    },
  };

  return (
    <div className='flex items-center gap-2 divid-solid divide-x divide-black-2'>
      <Link href={`./?tab=${rentalSchedule?.status}`}>
        <BasePageHeadingIcon
          Icon={ArrowLeft}
          iconProps={{
            weight: null,
          }}
        />
      </Link>
      <div className='pl-2 pr-8 flex gap-2'>
        <BasePageHeadingStatus
          color={statusDisplayData[rentalSchedule?.status]?.color}
          content={statusDisplayData[rentalSchedule?.status]?.title}
        />
        <BasePageHeadingTitleSubtitle
          title={
            <>
              {rentalSchedule?.rental_schedule_number}{' '}
              <span>
                <Copy
                  onClick={() =>
                    copyToClipboard(rentalSchedule?.rental_schedule_number)
                  }
                  className='text-black-5 hover:cursor-pointer hover:text-black-7'
                />
              </span>
            </>
          }
          subtitle={'Rental ID'}
        />
      </div>
    </div>
  );
};

const RentalScheduleIdPageHeadingRightSlot = ({ rentalSchedule }) => {
  switch (rentalSchedule.status) {
    case RENTAL_SCHEDULE_STATUS.FROZEN:
    case RENTAL_SCHEDULE_STATUS.READY_FOR_SIGNING:
    case RENTAL_SCHEDULE_STATUS.CONFIRMED:
      return <ViewRentalScheduleButton rentalSchedule={rentalSchedule} />;

    default:
      return <></>;
  }
};

export default function RentalScheduleIdPageHeading({ rentalSchedule }) {
  return (
    <BasePageHeading
      leftSlot={
        <RentalScheduleIdPageHeadingLeftSlot rentalSchedule={rentalSchedule} />
      }
      rightSlot={
        <RentalScheduleIdPageHeadingRightSlot rentalSchedule={rentalSchedule} />
      }
    />
  );
}
