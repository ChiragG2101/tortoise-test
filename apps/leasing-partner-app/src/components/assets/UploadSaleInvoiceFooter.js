import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { DropzoneInput } from '@repo/ui';
import DropzonePreview from '../common/form/DropzonePreview';
const { useUploadSaleInvoiceMutation } = require('@/features/assets/api');
const { Button } = require('@nextui-org/react');
const { toast } = require('react-toastify');

const fileSchema = yup.object().shape({
  document: yup
    .mixed()
    .required('A file is required')
    .test(
      'fileType',
      'Unsupported file format, only PDF format is supported',
      (value) => {
        return value && ['application/pdf'].includes(value.type);
      }
    )
    .test('fileSize', 'File size is too large', (value) => {
      return value && value.size <= 5 * 1024 * 1024; // 5MB
    }),
});

export default function UploadSaleInvoiceFooter({
  organizationId,
  assetId,
  onClose,
}) {
  const {
    control,
    handleSubmit,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(fileSchema),
    defaultValues: {
      document: null,
    },
  });

  const [uploadSaleInvoice, { isLoading: isUploadSaleInvoiceLoading }] =
    useUploadSaleInvoiceMutation();

  const handleUploadSaleInvoiceClick = async (data) => {
    const formData = new FormData();
    formData.append('document', data.document);
    try {
      await uploadSaleInvoice({
        organizationId,
        assetId,
        body: formData,
      }).unwrap();
      toast.success('Successfully uploaded sale invoice!');
      onClose();
    } catch {}
  };

  return (
    <form onSubmit={handleSubmit(handleUploadSaleInvoiceClick)}>
      <div className='flex flex-col gap-4 px-4'>
        <div className='flex flex-col gap-1'>
          <div className='text-md text-black-9'>Approve device purchase</div>
          <div className='text-xs'>
            Once you approve the device purchase, the voucher will be redeemed
            and ownership of the device will be transferred.
          </div>
        </div>
        <DropzoneInput
          control={control}
          name={'document'}
          errors={errors}
          clearErrors={clearErrors}
          accept={{ 'application/pdf': ['.pdf'] }}
          allowedFileFormat={'pdf'}
        />
        {control._formValues.document && (
          <DropzonePreview file={control._formValues.document} />
        )}
        <hr className='h-px bg-gray-200 border-0'></hr>
        <Button
          size='sm'
          bordered
          className='w-full bg-primary-main text-white border border-primary-dark'
          isLoading={isUploadSaleInvoiceLoading}
          type='submit'
        >
          Submit and approve
        </Button>
      </div>
    </form>
  );
}
