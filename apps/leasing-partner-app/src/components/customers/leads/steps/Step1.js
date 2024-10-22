import { Button } from '@nextui-org/react';
import { CheckCircle } from '@phosphor-icons/react';
import FeedbackSection from './FeedbackSection';
import DocumentCard from './DocumentCard';
import {
  useGetDocumentsQuery,
  useGetLeadQuery,
  useMarkAllDocumentsAsReviewedMutation,
  useMarkDocumentAsReviewedForDocTypeMutation,
} from '@/features/onboarding/api';
import { useCallback } from 'react';

export const docTypeToLabel = Object.freeze({
  audited_financial_statements: 'Last 2 years audited financials',
  current_year_provisionals: 'Current year Provisionals',
  bank_statement: 'Latest 6 months Bank Statements of All Bank Accounts',
  debt_profile: 'Debt profile',
  gst_returns: 'GST Returns',
  shareholding_patterns: 'Shareholding Patterns',
  business_and_management_profile: 'Business and Management Profile',
  investors_details: 'Details of Investors',
  other: 'Any other additional information based on credit review.',
  master_rental_agreement: 'Master Rental Agreement',
});

export default function Step1({ slug }) {
  const {
    data: documents,
    isLoading: isDocumentsLoading,
    refetch: refetchDocuments,
  } = useGetDocumentsQuery(slug);

  const { refetch } = useGetLeadQuery(slug);

  const [
    markDocumentAsReviewed,
    { isLoading: isMarkDocumentAsReviewedLoading },
  ] = useMarkDocumentAsReviewedForDocTypeMutation();

  const [
    markAllDocumentAsReviewed,
    { isLoading: isMarkAllDocumentAsReviewedLoading },
  ] = useMarkAllDocumentsAsReviewedMutation();

  const markAsReviewed = useCallback(
    async (document) => {
      try {
        await markDocumentAsReviewed({
          organizationId: slug,
          data: {
            document_type: document.document_type,
          },
        }).unwrap();
        refetch();
        refetchDocuments();
      } catch (error) {
        console.error('Failed to mark document as reviewed:', error);
      }
    },
    [markDocumentAsReviewed, slug, refetch, refetchDocuments]
  );

  const markAllAsReviewed = useCallback(async () => {
    try {
      await markAllDocumentAsReviewed(slug).unwrap();
      refetch();
      refetchDocuments();
    } catch (error) {
      console.error('Failed to mark document as reviewed:', error);
    }
  }, [markAllDocumentAsReviewed, slug, refetch, refetchDocuments]);

  return (
    <div className='flex flex-col sm:flex-row gap-5 sm:gap-0 justify-center'>
      <div className='sm:w-1/2'>
        <div className='w-11/12 md:w-9/12 mx-auto flex flex-col items-center gap-5'>
          <div className='w-full'>
            <div className='body-xsmall font-semibold text-darkGrey self-start'>
              STEP 1 OF 3
            </div>
            <div className='font-semibold body-large'>
              Review credit underwriting documents
            </div>
          </div>
          <Button
            type='submit'
            startContent={<CheckCircle size={15} weight='fill' />}
            className='w-full bg-primary-main text-white border border-primary-dark'
            onClick={markAllAsReviewed}
            isLoading={isMarkAllDocumentAsReviewedLoading}
          >
            Mark all as reviewed and submit
          </Button>
          {!isDocumentsLoading &&
            documents &&
            documents.map((doc) => (
              <div
                key={doc.document_type}
                className='w-full flex flex-col gap-5'
              >
                <div className='flex items-center justify-between'>
                  <div>
                    <div className='text-sm font-semibold'>
                      {docTypeToLabel[doc.document_type]}
                    </div>
                    <div className='text-xs text-darkGrey'>
                      Last updated on{' '}
                      {new Date(doc.last_updated).toLocaleDateString()}
                    </div>
                  </div>
                  {!doc.is_reviewed && (
                    <Button
                      className='text-xs px-2 rounded-xl'
                      variant='bordered'
                      isLoading={isMarkDocumentAsReviewedLoading}
                      endContent={
                        <CheckCircle
                          size={15}
                          weight='fill'
                          className='text-black'
                        />
                      }
                      onClick={() => markAsReviewed(doc)}
                    >
                      Mark as reviewed
                    </Button>
                  )}
                </div>
                <div className='flex flex-col gap-2'>
                  {doc.document.map((docItem) => (
                    <DocumentCard key={docItem.id} doc={docItem} />
                  ))}
                </div>
              </div>
            ))}
          {/* <div className='w-full flex flex-col gap-5'>
            <div className='flex items-center justify-between'>
              <div>
                <div className='text-sm font-semibold'>Additional Links</div>
                <div className='text-xs text-darkGrey'>
                  Last updated on 1 Apr 2024
                </div>
              </div>
              <Button
                className='text-xs px-2 rounded-xl'
                variant='bordered'
                endContent={
                  <CheckCircle size={15} weight='fill' className='text-black' />
                }
              >
                Mark as reviewed
              </Button>
            </div>
            <div className='flex flex-col gap-2'>
              <LinkCard />
            </div>
          </div> */}
        </div>
      </div>
      <div className='sm:w-1/2'>
        <FeedbackSection slug={slug} />
      </div>
    </div>
  );
}
