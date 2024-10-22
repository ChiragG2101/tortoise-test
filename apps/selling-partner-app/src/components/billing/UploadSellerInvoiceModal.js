import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { TortoiseModal, TortoiseModalFooter } from '../common/modal';
import { ModalBody } from '@nextui-org/react';
import { DropzoneInput } from '../common/form';
import DropzonePreview from '../common/form/DropzonePreview';
import { BILLING_STATUS } from '@/features/billing/constants';

const fileSchema = yup.object().shape({
  invoice: yup
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

export default function UploadSellerInvoiceModal({
  isOpen,
  onOpenChange,
  onClose,
  sellerInvoice,
}) {
  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(fileSchema),
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleUploadSellerInvoice = async (data) => {
    try {
      const file = data.invoice;
      const path = URL.createObjectURL(file);
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      sellerInvoice.file = path;
      sellerInvoice.status = BILLING_STATUS.UNPAID;
      onClose();
    } catch (uploadError) {}
  };

  return (
    <TortoiseModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title={'Upload Invoice'}
    >
      <>
        {sellerInvoice && (
          <form onSubmit={handleSubmit(handleUploadSellerInvoice)}>
            <ModalBody>
              <DropzoneInput
                control={control}
                name={'invoice'}
                errors={errors}
                clearErrors={clearErrors}
                accept={{ 'application/pdf': ['.pdf'] }}
                allowedFileFormat={'pdf'}
              />
              {control._formValues.document && (
                <DropzonePreview file={control._formValues.document} />
              )}
            </ModalBody>
            <TortoiseModalFooter
              isForm={true}
              negativeActionButtonHandler={() => {
                onClose();
                reset({ document: null });
              }}
              positiveActionButtonHandler={onClose}
              positiveActionButtonText={'Upload Invoice'}
              positiveActionButtonProps={{ isLoading }}
            />
          </form>
        )}
      </>
    </TortoiseModal>
  );
}
