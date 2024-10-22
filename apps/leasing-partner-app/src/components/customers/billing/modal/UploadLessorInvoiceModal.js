import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { TortoiseModal, TortoiseModalFooter } from '@/components/common/modal';
import { ModalBody } from '@nextui-org/react';
import { DropzoneInput } from '@/components/common/form';
import { useUploadLessorInvoiceMutation } from '@/features/customer-billing/api';
import DropzonePreview from '@/components/common/form/DropzonePreview';
import { toast } from 'react-toastify';

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

export default function UploadLessorInvoiceModal({
  isOpen,
  onOpenChange,
  onClose,
  lessorInvoice,
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

  const [uploadLessorInvoice, { isLoading }] = useUploadLessorInvoiceMutation();

  const handleUploadLessorInvoice = async (data) => {
    try {
      const formData = new FormData();
      formData.append('document', data.document);
      await uploadLessorInvoice({
        lessorInvoiceId: lessorInvoice.id,
        body: formData,
      }).unwrap();
      toast.success('Invoice uploaded successfully!');
      onClose();
    } catch (uploadError) {
      setError('document', { type: 'manual', message: uploadError.message });
    }
  };

  return (
    <TortoiseModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title={'Upload Invoice'}
    >
      <>
        {lessorInvoice && (
          <form onSubmit={handleSubmit(handleUploadLessorInvoice)}>
            <ModalBody>
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
