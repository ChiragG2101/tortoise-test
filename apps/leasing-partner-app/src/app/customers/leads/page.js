'use client';

import { IconTitlePageHeading } from '@repo/ui/components';
import LeadCard from '@/components/customers/leads/LeadCard';
import LeadCardSkeleton from '@/components/customers/leads/LeadCardSkeleton';
import { useGetOnboardingOrganizationsQuery } from '@/features/onboarding/api';
import { UsersThree } from '@phosphor-icons/react';
import Link from 'next/link';

export default function Leads() {
  const { data: leads, isLoading: isLeadsLoading } =
    useGetOnboardingOrganizationsQuery();

  return (
    <div className='flex flex-col gap-5'>
      <IconTitlePageHeading title={'Leads'} Icon={UsersThree} />
      <div className='flex flex-col px-5 gap-5'>
        <div>
          <div className='font-semibold body-small'>Leads</div>
          <div className='text-darkGrey'>
            Leads are new customers who have submitted their credit underwriting
            documents and are almost ready to initiate business with you
          </div>
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-5'>
          {isLeadsLoading ? (
            <>
              {Array.from({ length: 4 }, (_, index) => (
                <LeadCardSkeleton key={index} />
              ))}
            </>
          ) : (
            <>
              {leads?.map((lead) => (
                <Link
                  key={lead.id}
                  href={
                    lead.status !== 'final_sign_pending' &&
                    lead.status !== 'ready'
                      ? `/customers/leads/${lead.id}`
                      : ''
                  }
                >
                  <LeadCard key={lead.id} lead={lead} />
                </Link>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
