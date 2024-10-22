import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { TortoiseModal, TortoiseModalFooter } from '@/components/common/modal';
import { DatePicker, ModalBody } from '@nextui-org/react';
import { useMarkInvoiceAsPaidMutation } from '@/features/customer-billing/api';
import { toast } from 'react-toastify';

const fileSchema = yup.object().shape({
  paid_date: yup
    .date()
    .required('Please enter the date when the invoice was paid.')
    .max(new Date(), 'Paid date cannot be in the future'),
});

export default function MarkInvoiceAsPaidModal({
  isOpen,
  onOpenChange,
  onClose,
  lessorInvoice,
}) {
  const {
    control,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(fileSchema),
  });

  const [markInvoiceAsPaid, { isLoading }] = useMarkInvoiceAsPaidMutation();

  const handleMarkInvoiceAsPaid = async (data) => {
    try {
      const body = {
        ...data,
        paid_date: data.paid_date?.toISOString().split('T')[0],
      };
      await markInvoiceAsPaid({
        lessorInvoiceId: lessorInvoice.id,
        body,
      }).unwrap();
      onClose();
      toast.success('Successfully marked the invoice as paid!');
    } catch (_) {}
  };

  return (
    <TortoiseModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title={'Mark invoice as paid'}
    >
      <>
        {lessorInvoice && (
          <form onSubmit={handleSubmit(handleMarkInvoiceAsPaid)}>
            <ModalBody className='flex flex-col gap-4 justify-center items-center'>
              <div className='flex flex-col justify-center items-center'>
                <div className='text-xl'>
                  {lessorInvoice.total_payable_amount}
                </div>
                <div className='text-sm text-black-6'>Total payable amount</div>
              </div>
              <Controller
                name='paid_date'
                control={control}
                defaultValue={null}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    size='sm'
                    className='max-w-[284px]'
                    label='Paid on'
                    isInvalid={errors.paid_date}
                    errorMessage={errors.paid_date?.message}
                  />
                )}
              />
            </ModalBody>
            <TortoiseModalFooter
              isForm={true}
              negativeActionButtonHandler={() => {
                onClose();
                reset({ document: null });
              }}
              positiveActionButtonHandler={onClose}
              positiveActionButtonText={'Mark as Paid'}
              positiveActionButtonProps={{ isLoading }}
            />
          </form>
        )}
      </>
    </TortoiseModal>
  );
}
