'use client';

import HeadingLayout from '@/components/common/HeadingLayout';
import { ChartLine } from '@phosphor-icons/react';

export default function Overview() {
  return (
    <div className='flex flex-col gap-5'>
      <HeadingLayout
        title='Overview'
        icon={
          <ChartLine size={32} weight='duotone' className='text-primary-dark' />
        }
      />
      <div></div>
    </div>
  );
}
