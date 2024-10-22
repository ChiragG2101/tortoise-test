import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Devices, DeviceMobile } from '@phosphor-icons/react';
import { format } from 'date-fns';
import { I18nProvider } from '@react-aria/i18n';
// import { getLocalTimeZone, today } from '@internationalized/date';
import {
  Button,
  ModalBody,
  ModalFooter,
  Input,
  DatePicker,
  AvatarGroup,
  Avatar,
} from '@nextui-org/react';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { TortoiseModal } from '@/components/common/modal';
import { toast } from 'react-toastify';
import { formatAsCurrency } from '@/features/common/utils';
import { useMarkInvoicesAsPaidMutation } from '@/features/vendor/api';

const formFields = [
  {
    name: 'utr_number',
    label: 'UTR number',
    type: 'text',
    placeholder: 'Enter the utr number',
  },
  {
    name: 'paid_date',
    label: 'Paid date',
    type: 'date',
    placeholder: 'Select paid date',
  },
];

const markInvoicesAsPaidSchema = yup.object().shape({
  utr_number: yup
    .string()
    .required('Utr number is required')
    .typeError('Utr number must be a string'),
  paid_date: yup
    .date()
    .required('Paid date is required')
    // .min(
    //   new Date(new Date().setHours(0, 0, 0, 0)),
    //   'Paid date cannot be before today'
    // )
    .typeError('Paid date must be a valid date'),
});

const MarkAsPaidModal = ({
  title = 'Mark as paid',
  isOpen,
  onOpenChange,
  onClose,
  utr = '',
  configId,
  billingOverview,
  selectedBillingOverview,
}) => {
  const [markInvoicesAsPaid, { isLoading }] = useMarkInvoicesAsPaidMutation();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(markInvoicesAsPaidSchema),
    defaultValues: {
      utr_number: '',
      paid_date: null,
    },
  });

  const handleMarkAsPaid = useCallback(
    async (data) => {
      try {
        const payloadData = {
          body: {
            utr_number: data['utr_number'],
            paid_date: format(data['paid_date'], 'yyyy-MM-dd'),
            paid_amount: selectedBillingOverview?.total_amount,
            state_id: selectedBillingOverview?.state__id,
            due_from: billingOverview?.due_from,
          },
          configId,
        };
        await markInvoicesAsPaid(payloadData).unwrap();
        reset();
        onClose();
        toast.success('Successfully mark as paid.');
      } catch (error) {
        toast.error(error?.message);
        console.error('Failed mark as paid:', error);
      }
    },
    [markInvoicesAsPaid, selectedBillingOverview, billingOverview, configId]
  );

  return (
    <TortoiseModal
      isOpen={isOpen}
      onOpenChange={() => {
        reset();
        onOpenChange();
      }}
      title={title}
    >
      <ModalBody>
        <div className='flex flex-col gap-5'>
          <div className='flex flex-col p-5 items-center justify-center border border-black-3 border-b-2 rounded-xl'>
            <AvatarGroup
              isBordered
              max={2}
              total={
                selectedBillingOverview?.orders_delivered > 2
                  ? selectedBillingOverview?.orders_delivered - 2
                  : 0
              }
              className='pb-5'
            >
              <Avatar src='' fallback={<DeviceMobile size={20} />} />
              {selectedBillingOverview?.orders_delivered > 1 && (
                <Avatar src='' fallback={<Devices size={20} />} />
              )}
            </AvatarGroup>

            <div className='flex flex-col items-center'>
              <p className='text-xs font-medium text-black-8 opacity-60'>
                Invoice amount
              </p>
              <p className='text-2xl font-semibold text-black-8 '>
                {formatAsCurrency(selectedBillingOverview?.total_amount)}
              </p>
            </div>
          </div>

          <p className='text-xs font-medium'>
            {`If you have already paid this amount, please enter the
            UTR number of the transaction`}
          </p>

          <form className='p-5 border border-black-3 border-b-2 rounded-xl flex flex-col gap-5'>
            {formFields.map((field) => (
              <Controller
                key={field.name}
                name={field.name}
                control={control}
                render={({ field: { onChange, value } }) =>
                  field.type === 'text' ? (
                    <>
                      {utr ? (
                        <p className='text-xs font-normal leading-5 '>
                          UTR number: {utr}
                        </p>
                      ) : (
                        <Input
                          label={field.label}
                          type={field.type}
                          labelPlacement='outside'
                          variant='bordered'
                          radius='lg'
                          fullWidth
                          isClearable
                          value={value}
                          placeholder={field.placeholder}
                          isInvalid={errors[field.name]}
                          errorMessage={errors[field.name]?.message}
                          onChange={(e) => onChange(e.target.value)}
                          onClear={() => onChange('')}
                        />
                      )}
                    </>
                  ) : (
                    <I18nProvider locale='en-IN'>
                      <DatePicker
                        label={field.label}
                        labelPlacement='outside'
                        variant='bordered'
                        radius='lg'
                        fullWidth
                        value={value}
                        onChange={(date) => onChange(date)}
                        isInvalid={errors[field.name]}
                        errorMessage={errors[field.name]?.message}
                        // minValue={today(getLocalTimeZone())}
                      />
                    </I18nProvider>
                  )
                }
              />
            ))}
          </form>
        </div>
      </ModalBody>

      <ModalFooter className='grid grid-cols-2 pb-8'>
        <Button
          size='sm'
          variant='bordered'
          className='border border-[#EEEEEE] rounded-lg shadow-[0px_1px_0px_0px_#EEEEEE]'
          onPress={() => {
            reset();
            onClose();
          }}
        >
          Cancel
        </Button>
        <Button
          type='submit'
          size='sm'
          color='primary'
          variant='bordered'
          onPress={handleSubmit(handleMarkAsPaid)}
          isLoading={isLoading}
          spinnerPlacement='end'
          className='bg-green-7 text-white border border-green-9 rounded-lg px-5 shadow-[0px_1px_0px_0px_#167E62]'
        >
          Mark as paid
        </Button>
      </ModalFooter>
    </TortoiseModal>
  );
};

MarkAsPaidModal.propTypes = {
  title: PropTypes.any,
  isOpen: PropTypes.bool,
  onOpenChange: PropTypes.func,
  onClose: PropTypes.func,
  configId: PropTypes.string,
  billingOverview: PropTypes.object,
  selectedBillingOverview: PropTypes.object,
};

export default MarkAsPaidModal;
