import * as yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { I18nProvider } from '@react-aria/i18n';
import { Button, DatePicker, Input } from '@nextui-org/react';
import Dropzone from '@/components/common/Dropzone';
import { useAddInvoiceMutation } from '@/features/order/api';
import { useCallback, useMemo, useState } from 'react';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import DropzonePreview from '@/components/common/DropzonePreview';
import { useSelector } from 'react-redux';
import { selectSupplier } from '@/features/auth/slice';
import { uploadInvoiceValidationSchema } from '@/features/order/schema';

const rupeeStartContent = <div className='text-xs text-black-5'>₹</div>;

const percentageStartContent = <div className='text-xs text-black-5'>%</div>;

const formFields = [
  {
    name: 'invoice_number',
    label: 'Invoice number',
    type: 'text',
    placeholder: 'Enter invoice number',
  },
  {
    name: 'invoice_date',
    label: 'Invoice date',
    type: 'date',
    placeholder: 'Select invoice date',
  },
  {
    name: 'gross_amount',
    label: 'Gross amount',
    type: 'number',
    placeholder: 'Enter gross amount',
    startContent: rupeeStartContent,
  },
  {
    name: 'total_gst_amount',
    label: 'GST amount',
    type: 'number',
    placeholder: 'Enter GST amount',
    startContent: rupeeStartContent,
  },
  {
    name: 'gst_percentage',
    label: 'GST percentage',
    type: 'number',
    placeholder: 'Enter GST percentage',
    startContent: percentageStartContent,
  },
];

const defaultGST = 18;

export default function AddInvoice({ orderId, orderData }) {
  const [file, setFile] = useState(null);

  const [addInvoice, { isLoading: isAddingInvoice }] = useAddInvoiceMutation();
  const supplier = useSelector(selectSupplier);

  const ordersWithoutSupplierInvoice = orderData?.order_products.filter(
    (product) => !product.supplier_invoice
  );

  const defaultValues = useMemo(() => {
    const gross_amount = ordersWithoutSupplierInvoice.reduce(
      (total, product) => {
        return total + (product.price ?? 0);
      },
      0
    );

    return {
      invoice_number: '',
      invoice_date: null,
      gross_amount: gross_amount,
      total_gst_amount: (
        (gross_amount * defaultGST) /
        (100 + defaultGST)
      ).toFixed(2),
      gst_percentage: defaultGST,
    };
  }, [orderData?.order_products]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(uploadInvoiceValidationSchema),
    defaultValues,
  });

  const onSubmit = useCallback(
    async (data) => {
      data['invoice_date'] = format(data['invoice_date'], 'yyyy-MM-dd');
      if (!file) {
        toast.error('Please upload an invoice');
        return;
      }
      try {
        await addInvoice({
          lessorOrderProductIds: ordersWithoutSupplierInvoice.map(
            (product) => product.id
          ),
          formInputs: data,
          supplierId: supplier,
          invoiceFile: file,
          orderId: orderId,
        }).unwrap();
        reset();
        setFile(null);
        toast.success('Invoice added successfully');
      } catch (error) {
        console.error('Failed to add invoice:', error);
      }
    },
    [addInvoice, orderId, file]
  );

  if (ordersWithoutSupplierInvoice.length === 0) return <></>;

  return (
    <div>
      <div className='flex items-center justify-between text-sm'>
        <p className='font-semibold text-base'>Upload Invoice</p>
        <p
          className='text-green-8 cursor-pointer'
          onClick={() => {
            reset();
            setFile(null);
          }}
        >
          Reset
        </p>
      </div>
      <form
        className='p-4 border border-black-3 border-b-2 rounded-lg flex flex-col gap-4 mt-2'
        onSubmit={handleSubmit(onSubmit)}
      >
        {formFields.slice(0, 2).map((field) => (
          <Controller
            key={field.name}
            name={field.name}
            control={control}
            render={({ field: { onChange, value } }) => (
              <>
                {field.type === 'date' ? (
                  <I18nProvider locale='en-IN'>
                    <DatePicker
                      variant='bordered'
                      radius='lg'
                      size='md'
                      label={field.label}
                      onChange={(date) => onChange(date)}
                      isInvalid={errors[field.name]}
                      errorMessage={errors[field.name]?.message}
                      value={value}
                    />
                  </I18nProvider>
                ) : (
                  <Input
                    type={field.type}
                    variant='bordered'
                    radius='lg'
                    label={field.label}
                    onChange={(e) => onChange(e.target.value)}
                    isInvalid={errors[field.name]}
                    errorMessage={errors[field.name]?.message}
                    value={value}
                  />
                )}
              </>
            )}
          />
        ))}
        <div className='grid grid-cols-3 gap-2'>
          {formFields.slice(2).map((field) => (
            <Controller
              key={field.name}
              name={field.name}
              control={control}
              render={({ field: { onChange, value } }) => (
                <Input
                  type={field.type}
                  variant='bordered'
                  radius='lg'
                  label={field.label}
                  onChange={(e) => onChange(e.target.value)}
                  isInvalid={errors[field.name]}
                  errorMessage={errors[field.name]?.message}
                  value={value}
                  startContent={field.startContent}
                />
              )}
            />
          ))}
        </div>
        {!orderData?.invoice?.url && (
          <Dropzone
            title='Upload invoice'
            onDrop={(acceptedFiles) => {
              setFile(acceptedFiles[0]);
            }}
          />
        )}
        {!orderData?.invoice?.url && file && <DropzonePreview file={file} />}
        <Button
          type='submit'
          className='text-white bg-black-10 rounded-lg'
          isLoading={isAddingInvoice}
        >
          Submit
        </Button>
      </form>
    </div>
  );
}
