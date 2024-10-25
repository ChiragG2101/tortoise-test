/* eslint-disable @next/next/no-img-element */
import {
  Avatar,
  Button,
  Progress,
  Link,
  Divider,
  Spinner,
} from '@nextui-org/react';
import { ArrowCircleRight, Signature } from '@phosphor-icons/react';
import { CustomTortoiseDrawerBody } from '@repo/ui/components';
import { useGetLessorActiveOrganisationByIdQuery } from '@/features/lessor/api';
import { skipToken } from '@reduxjs/toolkit/query';
import { useCallback } from 'react';
import { formatAsCurrency } from '@/features/common/utils';

export default function CustomerDetailsTab({ customerId }) {
  const {
    data: customerDetails,
    isLoading: isCustomerDetailsLoading,
    isFetching: isCustomerDetailsFetching,
  } = useGetLessorActiveOrganisationByIdQuery(
    { organisationId: 1, customerId },
    { skip: !customerId || customerId === skipToken }
  );
  const handleViewDocument = useCallback(() => {
    const documentUrl = customerDetails.master_rental_agreement?.document;
    if (documentUrl) {
      window.open(documentUrl, '_blank');
    }
  }, [customerDetails]);

  if (isCustomerDetailsLoading || isCustomerDetailsFetching)
    return (
      <CustomTortoiseDrawerBody>
        <Spinner />
      </CustomTortoiseDrawerBody>
    );

  return (
    <CustomTortoiseDrawerBody>
      <div className='flex flex-col gap-8'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center'>
            <Avatar size={36} className='w-8 h-8 mr-3' radius='lg' />
            <div className='text-sm'>{customerDetails?.organization_name}</div>
          </div>
          {/* <Button
            variant='bordered'
            radius='lg'
            startContent={
              <img
                src='/assets/document.svg'
                alt='tortoise'
                className='w-6 mt-1 -ml-2'
              />
            }
            onClick={handleViewDocument}
            className='text-xs'
          >
            View MRA
          </Button> */}
        </div>
        <div>
          <div className='text-sm font-semibold'>Credit limit</div>
          <div className='mt-2 border rounded-lg flex flex-col p-4'>
            <div className='flex justify-between items-baseline'>
              <div className='font-semibold body-normal'>
                ₹ {customerDetails?.credit_utilised}
              </div>
              <div className='text-sm'>
                / ₹ {customerDetails?.total_credit_limit}
              </div>
            </div>
            <div className='my-2'>
              <Progress
                size='md'
                minValue={0}
                maxValue={customerDetails?.total_credit_limit}
                value={customerDetails?.credit_utilised}
                color='default'
              />
            </div>
          </div>
        </div>
        <div>
          <div className='text-sm font-semibold'>Active rental schedules</div>
          <div className='mt-2 border rounded-lg flex flex-col p-4'>
            <div className='flex'>
              <div className='font-semibold body-normal'>
                {customerDetails?.active_rental_schedules}
              </div>
            </div>
            <div className='mt-2 text-sm cursor-pointer'>
              <Link className='text-primary-800 '>
                <div className='text-xs'>View rental schedules</div>
                <ArrowCircleRight weight='fill' size={20} className='ml-1' />
              </Link>
            </div>
          </div>
        </div>
        {customerDetails?.subsidary_data?.length > 1 && (
          <div>
            <div className='text-sm font-semibold mb-0.5'>
              Organizations registered with{' '}
              {customerDetails.organization?.display_name}
            </div>
            <div className='text-xs text-black-5'>Credit consumption</div>
            <div className='flex flex-col mt-2 divide-y-1 divide-black-3'>
              {customerDetails?.subsidary_data.map((subsidary) => (
                <div
                  className='flex flex-row justify-between py-3 items-center text-sm'
                  key={subsidary?.id}
                >
                  <p className='capitalize'>{subsidary.name.toLowerCase()}</p>
                  <p>{formatAsCurrency(subsidary.credit_utilised)}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* <div>
          <div className='body-small font-semibold'>Billing details</div>
          <div className='mt-2 border rounded-lg flex flex-col p-4'>
            <div className='flex items-center justify-between'>
              <div className='flex flex-col'>
                <div>Latest payment</div>
                <div className='text-sm text-gray-400'>
                  ₹ {customerDetails?.latest_payment?.amount}
                </div>
              </div>
              <div>
                <Button
                  variant='bordered'
                  radius='lg'
                  className='py-1.5 px-3'
                  endContent={<DownloadSimple size={20} />}
                  className='text-xs'
                >
                  Invoice
                </Button>
              </div>
            </div>
            <div className='mt-3'>
              <Link className='text-primary-800'>
                View billing details
                <ArrowCircleRight weight='fill' size={20} className='ml-1' />
              </Link>
            </div>
          </div>
        </div> */}
        {/* <div>
          <div className='text-sm font-semibold'>
            Master rental agreement
          </div>
          <div className='text-xs text-darkGrey'>Signed copy of MRA</div>
          <div className='mt-2 border rounded-lg flex flex-col p-4'>
            <div className='flex items-center justify-between'>
              <div className='flex'>
                <div className='mr-2'>
                  <img src='/assets/document.svg' alt='tortoise' />
                </div>
                <div className='flex flex-col mt-2'>
                  <div className='text-sm'>MRA</div>
                  <div className='text-xs text-gray-400'>
                    Between Connect and Google
                  </div>
                </div>
              </div>
              <div>
                <Button
                  variant='bordered'
                  radius='lg'
                  onClick={handleViewDocument}
                  className='text-xs'
                >
                  View
                </Button>
              </div>
            </div>
            <Divider className='my-4' />
            <div className='flex flex-col gap-2'>
              <div className='flex items-center'>
                <Signature size={20} className='mr-3 text-darkGrey' />
                <div className='text-gray-500 text-xs'>
                  Signed by Google on 4 Apr 2024
                </div>
              </div>
              <div className='flex items-center'>
                <Signature size={20} className='mr-3 text-darkGrey' />
                <div className='text-gray-500 text-xs'>
                  Signed by Connect on 4 Apr 2024
                </div>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </CustomTortoiseDrawerBody>
  );
}
