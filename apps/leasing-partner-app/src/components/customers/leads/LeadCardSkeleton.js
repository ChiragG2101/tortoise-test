import {
  Card,
  CardBody,
  CardHeader,
  Skeleton,
  Divider,
} from '@nextui-org/react';
import { CaretRight } from '@phosphor-icons/react';

export default function LeadCardSkeleton() {
  return (
    <Card className='px-4 py-2 shadow-none border'>
      <CardHeader className='flex justify-between'>
        <div className='w-full flex items-center gap-2'>
          <Skeleton className='flex rounded-full w-12 h-12' />
          <Skeleton className='h-3 w-1/3 rounded-lg' />
        </div>
        <div className='rounded-full bg-opacity-30 bg-darkGrey p-1'>
          <CaretRight size={16} className='text-white' />
        </div>
      </CardHeader>
      <Divider />
      <CardBody>
        <div className='flex items-center justify-between py-2'>
          <div className='flex flex-col gap-1'>
            <div className='text-darkGrey body-xsmall'>Status</div>
            <Skeleton className='h-5 w-20 rounded-lg' />
          </div>
          <div className='flex flex-col gap-1'>
            <div className='text-darkGrey body-xsmall'>Employees</div>
            <Skeleton className='h-5 rounded-lg' />
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
