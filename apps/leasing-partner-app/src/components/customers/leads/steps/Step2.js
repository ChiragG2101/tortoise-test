import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Input,
} from '@nextui-org/react';
import { CheckCircle } from '@phosphor-icons/react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import ExampleQuotation from './ExampleQuotation';
import {
  useConfigureCreditLimitsMutation,
  useGetLeadQuery,
} from '@/features/onboarding/api';
import { useCallback } from 'react';

const paymentCycles = Object.freeze([
  { value: 'quarterly', label: 'Quarterly' },
  // { value: 'Monthly', label: 'Monthly' },
  // { value: 'Bullet Payment', label: 'Bullet Payment' },
]);

const tenures = Object.freeze([
  { value: '6', label: '6 months' },
  { value: '12', label: '12 months' },
]);

const schema = yup.object().shape({
  assigned_credit_limit: yup.string().required('Credit limit is required'),
  rent_collection_cycle: yup.string().required('Payment cycle is required'),
  approved_tenure_in_months: yup
    .string()
    .required('Approved tenure is required'),
  per_thousand_per_quarter_rate: yup.string().required('PTPQ is required'),
  processing_fee: yup.string().required('Processing fee is required'),
  refundable_deposit: yup.string().required('Refundable deposit is required'),
  interim_payment: yup.string().required('Interim payment is required'),
  gst_percentage_on_rental: yup.string().required('GST on rentals is required'),
  buyback_percentage: yup.string().required('Buyback value is required'),
});

const defaultValues = Object.freeze({
  assigned_credit_limit: '',
  rent_collection_cycle: 'quarterly',
  approved_tenure_in_months: '12',
  per_thousand_per_quarter_rate: '0',
  processing_fee: '0',
  refundable_deposit: '0',
  interim_payment: '0',
  gst_percentage_on_rental: '18',
  buyback_percentage: '2',
});

const rupeeStartContent = <div className='text-xs text-darkGrey'>₹</div>;

const percentageStartContent = <div className='text-xs text-darkGrey'>%</div>;

const inputFields = Object.freeze([
  {
    name: 'assigned_credit_limit',
    label: 'Assign credit limit',
    startContent: rupeeStartContent,
  },
  {
    name: 'per_thousand_per_quarter_rate',
    label: 'Per Thousand Per Quarter - (PTPQ)',
    startContent: rupeeStartContent,
  },
  {
    name: 'processing_fee',
    label: 'Processing fee',
    startContent: rupeeStartContent,
  },
  {
    name: 'refundable_deposit',
    label: 'Refundable deposit',
    startContent: rupeeStartContent,
  },
  {
    name: 'interim_payment',
    label: 'Interim Payment',
    startContent: rupeeStartContent,
  },
  {
    name: 'gst_percentage_on_rental',
    label: 'GST on rentals',
    startContent: percentageStartContent,
  },
  {
    name: 'buyback_percentage',
    label: 'Buyback value',
    startContent: percentageStartContent,
  },
]);

const autocompleteFields = Object.freeze([
  {
    name: 'approved_tenure_in_months',
    label: 'Approved tenure',
    options: tenures,
    defaultSelectedKey: '12',
  },
  {
    name: 'rent_collection_cycle',
    label: 'Select Payment Cycle',
    options: paymentCycles,
    defaultSelectedKey: 'quarterly',
  },
]);

export default function Step2({ slug }) {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const { data: lead, refetch } = useGetLeadQuery(slug);

  const [configuredCreditLimit, { isLoading: isConfigureCreditLimitLoading }] =
    useConfigureCreditLimitsMutation();

  const onSubmit = useCallback(
    async (data) => {
      try {
        await configuredCreditLimit({ organizationId: slug, data });
        refetch();
      } catch (error) {
        console.error('Failed to configure credit limit:', error);
      }
    },
    [configuredCreditLimit, slug, refetch]
  );

  return (
    <div className='flex flex-col sm:flex-row gap-5 sm:gap-0 justify-center'>
      <div className='sm:w-1/2'>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className='w-11/12 sm:w-9/12 mx-auto flex flex-col items-center gap-5'
        >
          <div className='w-full'>
            <div className='body-xsmall font-semibold text-darkGrey self-start'>
              STEP 2 OF 3
            </div>
            <div className='font-semibold body-large'>
              Assign credit line for {lead?.organization?.display_name}
            </div>
          </div>
          <Button
            type='submit'
            startContent={<CheckCircle size={15} weight='fill' />}
            isLoading={isConfigureCreditLimitLoading}
            className='w-full bg-primary-main text-white border border-primary-dark'
          >
            Assign and proceed
          </Button>
          <div className='w-full flex flex-col gap-5 border rounded-xl p-4'>
            <Controller
              name={inputFields[0].name}
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label={inputFields[0].label}
                  variant='bordered'
                  isInvalid={!!errors?.[inputFields[0].name]}
                  errorMessage={errors?.[inputFields[0].name]?.message}
                  startContent={inputFields[0].startContent}
                />
              )}
            />
            {autocompleteFields.map((field) => (
              <Controller
                key={field.name}
                name={field.name}
                control={control}
                render={({ field: controllerField }) => (
                  <Autocomplete
                    label={field.label}
                    {...controllerField}
                    onChange={controllerField.onChange}
                    onSelect={controllerField.onChange}
                    error={errors[field.name]?.message}
                    isInvalid={!!errors?.[field.name]}
                    defaultSelectedKey={field.defaultSelectedKey}
                  >
                    {field.options.map((option) => (
                      <AutocompleteItem key={option.value} value={option.label}>
                        {option.label}
                      </AutocompleteItem>
                    ))}
                  </Autocomplete>
                )}
              />
            ))}
            {inputFields.slice(1, 3).map((field) => (
              <Controller
                key={field.name}
                name={field.name}
                control={control}
                render={({ field: controllerField }) => (
                  <Input
                    {...controllerField}
                    label={field.label}
                    variant='bordered'
                    errorMessage={errors?.[inputFields[0].name]?.message}
                    startContent={field.startContent}
                  />
                )}
              />
            ))}
            <div className='grid grid-cols-2 gap-5'>
              {inputFields.slice(3).map((field) => (
                <Controller
                  key={field.name}
                  name={field.name}
                  control={control}
                  render={({ field: controllerField }) => (
                    <Input
                      {...controllerField}
                      label={field.label}
                      variant='bordered'
                      errorMessage={errors?.[inputFields[0].name]?.message}
                      startContent={field.startContent}
                    />
                  )}
                />
              ))}
            </div>
          </div>
        </form>
      </div>
      <div className='sm:w-1/2'>
        <ExampleQuotation />
      </div>
    </div>
  );
}
