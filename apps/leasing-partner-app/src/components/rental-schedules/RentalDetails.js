import { capitalizeFirstLetter } from '@/features/common/utils';
import { useGetRentalScheduleByIDQuery } from '@/features/rental-schedule/api';
import { Button, Chip, Divider } from '@nextui-org/react';
import { Signature } from '@phosphor-icons/react';
import { skipToken } from '@reduxjs/toolkit/query';
import { useCallback, useMemo } from 'react';
import { statusStyles } from '../customers/leads/LeadCard';
import { format } from 'date-fns';

export default function RentalDetails({ id }) {
  const { data: rentalSchedule, isLoading: isRentalScheduleLoading } =
    useGetRentalScheduleByIDQuery(id ?? skipToken);

  const status = useMemo(
    () =>
      rentalSchedule?.status.toLowerCase() === 'provisional'
        ? 'Signature pending'
        : capitalizeFirstLetter(rentalSchedule?.status),
    [rentalSchedule?.status]
  );

  const handleClick = useCallback(() => {
    if (rentalSchedule?.signing_link) {
      window.open(rentalSchedule.signing_link, '_blank');
    }
  }, [rentalSchedule?.signing_link]);

  if (isRentalScheduleLoading) return null;

  return (
    <>
      <div className='font-semibold body-xsmall'>Rental schedule details</div>
      <div className='flex flex-col border mt-2 rounded-xl p-4'>
        <div className='flex justify-between items-center'>
          <div>
            <div className='text-tiny text-gray-400'>Rental ID</div>
            <div className='mt-1 text-sm'>{`${rentalSchedule?.id}`}</div>
          </div>
          <Chip className={statusStyles[status] || 'bg-gray-200'}>
            {status}
          </Chip>
        </div>
        <div className='flex justify-between items-center mt-4'>
          <div className='flex flex-col'>
            <div className='text-tiny text-gray-400'>Commenced on</div>
            <div className='mt-1 text-sm'>
              {format(
                new Date(!!rentalSchedule?.commencement_date),
                'dd MMM yyyy'
              )}
            </div>
          </div>
          <div className='flex flex-col'>
            <div className='text-tiny text-gray-400'>Issued State/UT</div>
            <div className='mt-1 text-sm'>Karnataka</div>
          </div>
          <div className='flex flex-col'>
            <div className='text-tiny text-gray-400'>Total rental amount</div>
            <div className='mt-1 text-sm'>
              ₹{' '}
              {(
                rentalSchedule?.total_amount_ex_taxes +
                rentalSchedule?.total_amount_tax
              ).toFixed(2)}
            </div>
          </div>
        </div>
        <Divider className='my-4' />
        <div className='flex justify-center items-center w-full'>
          <Button
            variant='bordered'
            className='w-full'
            startContent={<Signature size={20} />}
            onClick={handleClick}
          >
            View and sign
          </Button>
        </div>
      </div>
    </>
  );
}
