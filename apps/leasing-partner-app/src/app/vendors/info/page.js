'use client';

import VendorCard from '@/components/vendors/info/VendorCard';
import { useGetVendorInfoQuery } from '@/features/vendor/api';
import { Package } from '@phosphor-icons/react';

export default function VendorInfo() {
  const { data: info, isLoading: isInfoLoading } = useGetVendorInfoQuery();
  return (
    <div className='flex flex-col gap-5'>
      <div className='flex justify-between px-5 pb-5 border-b-1'>
        <div className='flex items-center gap-2'>
          <Package size={32} weight='duotone' className='text-primary-dark' />
          <div className='font-semibold body-xlarge'>Vendor Info</div>
        </div>
      </div>
      <div className='px-5 grid md:grid-cols-2 gap-5'>
        {info?.map((info) => (
          <VendorCard key={info?.supplier_id} info={info} />
        ))}
      </div>
    </div>
  );
}
