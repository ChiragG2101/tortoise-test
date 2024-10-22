import { Divider } from '@nextui-org/react';
import { format } from 'date-fns';

export default function RentalScheduleCard({ data }) {
  return (
    <div className='mt-2'>
      <div className='flex flex-col border rounded-xl p-4'>
        <div className='flex justify-between'>
          <div className='flex flex-col'>
            <div className='body-small'>{data?.label}</div>
            <div className='text-darkGrey text-xs'>{`${format(
              new Date(data?.date_from),
              'd MMM'
            )} - ${format(new Date(data?.date_to), 'dd MMM yyyy')}`}</div>
          </div>
          <div className='flex items-center body-small'>{`₹ ${data?.amount}`}</div>
        </div>
        <Divider className='my-4' />
        <div className='flex justify-between'>
          <div className='text-darkGrey text-xs'>{`Due date: ${format(
            new Date(data?.due_on),
            'dd MMM yyyy'
          )}`}</div>
          <div className='text-darkGrey text-xs'>{`Over due: ${format(
            new Date(data?.due_till),
            'dd MMM yyyy'
          )}`}</div>
        </div>
      </div>
    </div>
  );
}
