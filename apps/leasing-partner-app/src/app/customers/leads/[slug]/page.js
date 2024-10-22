'use client';

import { statusStyles } from '@/components/customers/leads/LeadCard';
import Step1 from '@/components/customers/leads/steps/Step1';
import Step2 from '@/components/customers/leads/steps/Step2';
import Step3 from '@/components/customers/leads/steps/Step3';
import { useGetLeadQuery } from '@/features/onboarding/api';
import { Chip, User } from '@nextui-org/react';
import { ArrowLeft } from '@phosphor-icons/react';
import Link from 'next/link';
import { useMemo } from 'react';

export default function Lead({ params }) {
  const { slug } = params;

  const { data: lead, isLoading: isLeadLoading } = useGetLeadQuery(slug);

  const stepToComponent = useMemo(() => {
    return {
      in_review: <Step1 slug={slug} />,
      approved: <Step2 slug={slug} />,
      credit_details_assigned: <Step3 slug={slug} />,
    };
  }, [slug]);

  const status = lead?.status;

  if (isLeadLoading) return null;

  return (
    <>
      <div className='flex items-center px-5 pb-4 border-b-1 gap-2'>
        <Link href={'/customers/leads'}>
          <ArrowLeft size={25} weight='bold' className='text-primary-dark' />
        </Link>
        <div className='font-semibold body-large'>Lead onboarding info</div>
      </div>
      <div className='flex flex-col min-h-full py-5 gap-10 items-center justify-center'>
        <div>
          <div className='flex items-center justify-center gap-10'>
            <User name={lead?.organization?.display_name} />
            <div className='h-5 w-px bg-[#CBCBCB]'></div>
            <Chip
              className={
                statusStyles[lead?.status_display] || 'bg-gray-300 text-black'
              }
            >
              {lead?.status_display}
            </Chip>
          </div>
        </div>
        <div className='w-full'>{stepToComponent[status]}</div>
      </div>
    </>
  );
}
