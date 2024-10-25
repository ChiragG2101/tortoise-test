/* eslint-disable @next/next/no-img-element */
import { Spinner } from '@nextui-org/react';
import { CustomTortoiseDrawerBody } from '@repo/ui/components';
import { skipToken } from '@reduxjs/toolkit/query';
import { useGetLessorActiveOrganisationByIdQuery } from '@/features/lessor/api';
import { useGetDocumentsQuery } from '@/features/onboarding/api';
import DocumentCard from '../../leads/steps/DocumentCard';
import { docTypeToLabel } from '../../leads/steps/Step1';
import { useSelector } from 'react-redux';

export default function CreditUnderwritingTab({ customerId }) {
  const user = useSelector((state) => state.auth.user);
  const {
    data: customerDetails,
    isLoading: isCustomerDetailsLoading,
    isFetching: isCustomerDetailsFetching,
  } = useGetLessorActiveOrganisationByIdQuery(
    { organisationId: user?.lessor, customerId },
    { skip: !user?.lessor || !customerId }
  );
  const { data: documents, isLoading: isDocumentsLoading } =
    useGetDocumentsQuery(customerDetails?.live_onboarding_id || skipToken);

  if (
    isCustomerDetailsLoading ||
    isDocumentsLoading ||
    isCustomerDetailsFetching
  )
    return (
      <CustomTortoiseDrawerBody>
        <Spinner />
      </CustomTortoiseDrawerBody>
    );

  return (
    <CustomTortoiseDrawerBody>
      <div className='flex flex-col gap-5'>
        {!isDocumentsLoading &&
          documents &&
          documents.map((doc) => (
            <div key={doc.document_type} className='w-full flex flex-col gap-2'>
              <div>
                <div className='text-sm font-semibold'>
                  {docTypeToLabel[doc.document_type]}
                </div>
                <div className='text-xs text-black-5'>
                  Last updated on{' '}
                  {new Date(doc.last_updated).toLocaleDateString()}
                </div>
              </div>
              <div className='flex flex-col gap-2'>
                {doc.document.map((docItem) => (
                  <DocumentCard key={docItem.id} doc={docItem} />
                ))}
              </div>
            </div>
          ))}
      </div>
    </CustomTortoiseDrawerBody>
  );
}
