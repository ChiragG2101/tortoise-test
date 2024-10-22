'use client';

import HeadingLayout from '@/components/common/HeadingLayout';
import { UsersThree } from '@phosphor-icons/react';

export default function Customers() {
  return (
    <div className='flex flex-col gap-5'>
      <HeadingLayout
        title='Customers'
        icon={
          <UsersThree
            size={32}
            weight='duotone'
            className='text-primary-dark'
          />
        }
      />
      <div></div>
    </div>
  );
}
