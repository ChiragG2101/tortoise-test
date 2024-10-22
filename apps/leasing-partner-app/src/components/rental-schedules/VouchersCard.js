import { ArrowCircleRight } from '@phosphor-icons/react';

export default function VouchersCard({ id }) {
  return (
    <div className='mt-6'>
      <div className='font-semibold body-xsmall'>Vouchers</div>
      <div className='flex flex-col border rounded-xl p-4 mt-2'>
        <div className='flex'>
          <div className='flex flex-col w-full'>
            <div className='text-sm text-gray-400 mb-1'>Vouchers issued</div>
            <div>12</div>
          </div>
          <div className='flex flex-col w-full'>
            <div className='text-sm text-gray-400 mb-1'>Amount</div>
            <div>₹ 40000</div>
          </div>
        </div>
        <div className='text-primary-800 text-xs flex items-center mt-4'>
          View voucher details
          <ArrowCircleRight weight='fill' size={20} className='ml-1' />
        </div>
      </div>
    </div>
  );
}
