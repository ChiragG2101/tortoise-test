/* eslint-disable @next/next/no-img-element */

import { CheckFat } from '@phosphor-icons/react';

export function BottomLine() {
  return (
    <div className='bg-grey p-4 rounded-2xl text-xs'>
      <div>
        It takes upto seven days to update the total count of the stamp papers
        on the dashboard, if you face any difficulties,{' '}
        <span className='text-primary-main font-semibold'>Contact us!</span>
      </div>
    </div>
  );
}

export default function TopBanner({ totalUnused, totalStampPapers }) {
  return (
    <div className='flex flex-col md:flex-row items-center justify-between border mx-5 rounded-lg'>
      <div className='w-full flex items-center justify-between gap-5 sm:gap-10 border-b-1 md:border-b-0 md:border-r-1'>
        <img src='/assets/stamps-banner.svg' alt='Stamp Banner' />
        <div>
          <div className='flex items-end gap-1'>
            <div className='font-semibold body-3xlarge'>{totalUnused}</div>
            <div className='body-xsmall text-darkGrey'>/{totalStampPapers}</div>
          </div>
          <div className='body-xsmall sm:body-normal'>
            Stamp papers remaining
          </div>
        </div>
        <div></div>
      </div>
      <div className='md:w-3/5 flex flex-col gap-4 p-5 justify-center'>
        <div className='flex items-center gap-2 '>
          <CheckFat size={20} weight='fill' className='text-[#167E62]' />
          <div className='body-xsmall'>
            Keep a track of your stamp papers across each state
          </div>
        </div>
        <div className='flex items-center gap-2'>
          <CheckFat size={20} weight='fill' className='text-[#167E62]' />
          <div className='body-xsmall'>Request more stamp papers on demand</div>
        </div>
        <BottomLine />
      </div>
    </div>
  );
}
