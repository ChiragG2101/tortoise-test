import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { TortoiseModal, TortoiseModalFooter } from '@/components/common/modal';
import { ModalBody } from '@nextui-org/react';
import { DropzoneInput } from '@/components/common/form';
import { useUploadSecurityDepositReceiptMutation } from '@/features/rental-schedule/api';

const fileSchema = yup.object().shape({
  file: yup
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

export default function UploadSecurityDepositReceiptModal({
  isOpen,
  onOpenChange,
  onClose,
  paymentId,
  rentalScheduleId,
}) {
  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(fileSchema),
  });

  const [uploadSecurityDepositReceipt, { isLoading }] =
    useUploadSecurityDepositReceiptMutation();
  const uploadRentalReceipt = async (data) => {
    try {
      const formData = new FormData();
      formData.append('document', data.file);
      await uploadSecurityDepositReceipt({
        lessorPaymentId: paymentId,
        rentalScheduleId,
        data: formData,
      }).unwrap();
      onClose();
    } catch (uploadError) {
      setError('file', { type: 'manual', message: uploadError.message });
    }
  };

  return (
    <TortoiseModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title={'Upload Receipt'}
    >
      <>
        {paymentId && (
          <form onSubmit={handleSubmit(uploadRentalReceipt)}>
            <ModalBody>
              <DropzoneInput
                control={control}
                name={'file'}
                errors={errors}
                clearErrors={clearErrors}
                accept={{ 'application/pdf': ['.pdf'] }}
                allowedFileFormat={'pdf'}
              />
            </ModalBody>
            <TortoiseModalFooter
              isForm={true}
              negativeActionButtonHandler={onClose}
              positiveActionButtonHandler={onClose}
              positiveActionButtonText={'Upload Receipt'}
              positiveActionButtonProps={{ isLoading }}
            />
          </form>
        )}
      </>
    </TortoiseModal>
  );
}
