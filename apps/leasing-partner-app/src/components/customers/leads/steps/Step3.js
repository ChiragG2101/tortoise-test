/* eslint-disable @next/next/no-img-element */
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Checkbox,
  Divider,
} from '@nextui-org/react';
import { CheckCircle } from '@phosphor-icons/react';
import Dropzone from './Dropzone';
import { useCallback, useState } from 'react';
import {
  useGetLeadQuery,
  useGetOnboardingOrganizationsQuery,
  usePostDocumentMutation,
} from '@/features/onboarding/api';
import { useRouter } from 'next/navigation';

const stateNames = Object.freeze([
  'Andaman and Nicobar Islands',
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chandigarh',
  'Chhattisgarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jammu and Kashmir',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Ladakh',
  'Lakshadweep',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Puducherry',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
]);

export default function Step3({ slug }) {
  const router = useRouter();
  const [selectedState, setSelectedState] = useState('');
  const handleSelect = (value) => {
    setSelectedState(value);
  };
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const [documentPreview, setDocumentPreview] = useState(null);

  const { data: lead, refetch } = useGetLeadQuery(slug);
  const { refetch: refetchOnboardingOrganizations } =
    useGetOnboardingOrganizationsQuery();
  const [postDocument] = usePostDocumentMutation();

  const handleUploadMRA = useCallback(async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('document', file);
    formData.append('document_type', 'master_rental_agreement');
    formData.append('description', 'Master Rental Agreement');
    try {
      await postDocument({ organizationId: slug, data: formData }).unwrap();
      refetch();
      refetchOnboardingOrganizations();
      router.push('/customers/leads');
    } catch (error) {
      console.error('Failed to upload document:', error);
    }
  }, [
    file,
    postDocument,
    slug,
    router,
    refetch,
    refetchOnboardingOrganizations,
  ]);

  const handleDrop = useCallback(async (acceptedFiles) => {
    setFile(acceptedFiles[0]);
    setDocumentPreview(acceptedFiles[0]);
    const url = URL.createObjectURL(acceptedFiles[0]);
    setFileUrl(url);
  }, []);

  const handleViewClick = useCallback(() => {
    if (fileUrl) {
      window.open(fileUrl, '_blank');
    }
  }, [fileUrl]);

  return (
    <div className='w-11/12 md:w-1/2 lg:w-1/3 mx-auto flex flex-col items-center gap-5'>
      <div className='w-full'>
        <div className='body-xsmall font-semibold text-darkGrey self-start'>
          STEP 3 OF 3
        </div>
        <div className='font-semibold body-large'>
          Upload Master Rental Agreement - MRA
        </div>
      </div>
      <Button
        startContent={<CheckCircle size={15} weight='fill' />}
        className='w-full bg-primary-main text-white border border-primary-dark'
        onClick={handleUploadMRA}
      >
        Share MRA with {lead?.organization?.display_name}
      </Button>
      <div className='flex flex-col gap-2'>
        <div className='text-darkGrey body-xsmall'>
          First choose a State/UT for which you want the agreement to be
          e-stamped
        </div>
        <Autocomplete
          label='Choose a State/UT'
          variant='bordered'
          onChange={(e) => handleSelect(e.target.value)}
        >
          {stateNames.map((state, index) => (
            <AutocompleteItem key={index} value={state}>
              {state}
            </AutocompleteItem>
          ))}
        </Autocomplete>
        <div className='bg-grey p-4 rounded-xl'>
          <Checkbox defaultSelected isDisabled={true}>
            <div className='text-xs'>
              Set this State/UT default for rental schedule and other legal
              agreements
            </div>
          </Checkbox>
        </div>
      </div>
      <div className='flex flex-col gap-2'>
        <div className='text-darkGrey text-xs'>
          Upload the Rental Agreement or select one from the templates
        </div>
        <Dropzone onDrop={handleDrop} documentPreview={documentPreview} />
        {documentPreview && (
          <div className='flex flex-col gap-4 mt-4'>
            <div>
              <div className='font-semibold text-sm'>Uploaded MRA</div>
              <div className='text-darkGrey text-xs'>
                After uploading the MRA, the customer needs to sign it first
              </div>
            </div>
            <div className='border px-2 py-4 rounded-xl flex flex-col gap-4'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center -mb-2'>
                  <img src='/assets/document.svg' alt='Document' />
                  <div className='-mt-1'>
                    <div className='text-xs font-semibold'>
                      {documentPreview.name}
                    </div>
                    <div className='text-xs text-darkGrey'>
                      Between CloudWave and Connect
                    </div>
                  </div>
                </div>
                <Button
                  variant='bordered'
                  size='small'
                  className='text-xs p-0'
                  onClick={handleViewClick}
                >
                  View
                </Button>
              </div>
              <Divider />
              <div className='flex items-center text-darkGrey text-xs gap-2 ml-4'>
                <img src='/assets/signature.svg' alt='Signature' />
                <div>Yet to be signed by CloudWave</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
