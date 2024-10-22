import React from 'react';
import PropTypes from 'prop-types';
import { ArrowSquareOut } from '@phosphor-icons/react';
import { Spinner, Link } from '@nextui-org/react';
import { formatAsCurrency } from '@/features/common/utils';
import { useGetRentalScheduleByIDQuery } from '@/features/rental-schedule/api';

const RentalSchedule = ({ rentalScheduleId }) => {
  const { data: rentalSchedule, isLoading: isRentalScheduleLoading } =
    useGetRentalScheduleByIDQuery(rentalScheduleId, {
      skip: !rentalScheduleId,
    });

  if (isRentalScheduleLoading || !rentalSchedule || !rentalScheduleId) {
    return (
      <div className='border-2 rounded-lg p-5 w-96 flex items-center justify-center'>
        {isRentalScheduleLoading ? <Spinner /> : <p>No Rental Schedule</p>}
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-5 border-2 rounded-lg p-5 w-96'>
      <p className='text-sm font-semibold pb-5'>Rental schedule details</p>

      <div className='pb-5'>
        <p className='text-sm leading-4 font-medium to-black-8 opacity-60 pb-1'>
          Rental ID
        </p>
        <Link
          className='p-0 text-green-9 text-sm font-medium gap-1 '
          href={`/customers/rental-schedule/${rentalScheduleId}`}
          target='_blank'
          showAnchorIcon
          anchorIcon={<ArrowSquareOut size={20} />}
        >
          {rentalSchedule?.rental_schedule_number}
        </Link>
      </div>

      <div className='pb-10 border-b-1'>
        <p className='text-sm leading-4 font-medium to-black-8 opacity-60 pb-1'>
          Deposit paid
        </p>
        <div className='flex gap-1'>
          <p className='text-sm font-medium'>
            {formatAsCurrency(
              rentalSchedule?.security_deposits_summary?.paid_amount
            )}
          </p>
        </div>
      </div>

      <div className='pt-5'>
        <div className='flex justify-between pr-10 pb-5'>
          <div>
            <p className='text-sm font-medium to-black-8 opacity-60 pb-2'>
              Yet to pay
            </p>
            <p className='text-2xl font-semibold'>
              {formatAsCurrency(
                rentalSchedule?.security_deposits_summary?.unpaid_amount
              )}
            </p>
          </div>

          <div>
            <p className='text-sm font-medium to-black-8 opacity-60 pb-2'>
              Devices
            </p>
            <p className='text-2xl font-semibold'>
              {rentalSchedule?.security_deposits_summary
                ?.unpaid_rental_schedule_ids?.length
                ? rentalSchedule?.security_deposits_summary?.num_deposits
                : 0}
            </p>
          </div>
        </div>

        <Link
          className='border-1 rounded-lg text-sm font-semibold text-black-8  shadow-md flex align-center justify-center p-2'
          isBlock
          href={`/customers/rental-schedule/${rentalScheduleId}`}
          target='_blank'
        >
          View rental schedule
        </Link>
      </div>
    </div>
  );
};

RentalSchedule.propTypes = {
  rentalScheduleId: PropTypes.string,
};

export default RentalSchedule;
