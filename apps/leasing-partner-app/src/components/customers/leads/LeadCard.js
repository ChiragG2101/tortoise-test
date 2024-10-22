import {
  Card,
  CardBody,
  CardHeader,
  Chip,
  Divider,
  User,
} from '@nextui-org/react';
import { CaretRight } from '@phosphor-icons/react';
import { useCallback } from 'react';

export const statusStyles = Object.freeze({
  'Documents under review': 'bg-[#F4F4F5] text-black',
  'Documents reviewed': 'bg-[#FFFDE9] text-[#926120]',
  'Credit details assigned': 'bg-[#F1F2FF] text-[#775DB3]',
  'MRA signature pending': 'bg-[#FFEFEA] text-[#AA3628]',
});

export default function LeadCard({ lead }) {
  const getChipStyle = useCallback(
    (status) => statusStyles[status] || 'bg-gray-300 text-black',
    []
  );

  return (
    <Card className='px-4 py-2 hover:cursor-pointer'>
      <CardHeader className='flex justify-between'>
        <User name={lead.organization.display_name} />
        <div className='rounded-full bg-opacity-30 bg-darkGrey p-1'>
          <CaretRight size={16} className='text-white' />
        </div>
      </CardHeader>
      <Divider />
      <CardBody>
        <div className='flex items-center justify-between py-2'>
          <div className='flex flex-col gap-1'>
            <div className='text-darkGrey body-xsmall'>Status</div>
            <Chip className={getChipStyle(lead.status_display)}>
              {lead.status_display}
            </Chip>
          </div>
          <div className='flex flex-col gap-1'>
            <div className='text-darkGrey body-xsmall'>Employees</div>
            <div className='font-semibold body-xsmall'>
              {lead.organization.employees_count}
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
