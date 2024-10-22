'use client';

import HeadingLayout from '@/components/common/HeadingLayout';
import { Lifebuoy } from '@phosphor-icons/react';

export default function Support() {
  return (
    <div className='flex flex-col gap-5'>
      <HeadingLayout
        title='Support'
        icon={
          <Lifebuoy size={32} weight='duotone' className='text-primary-dark' />
        }
      />
      <div></div>
    </div>
  );
}
