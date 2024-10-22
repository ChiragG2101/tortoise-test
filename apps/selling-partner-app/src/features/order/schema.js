import * as yup from 'yup';

export const shippingValidationSchema = yup.object().shape({
  shipping_provider: yup.string().required('Shipping provider is required'),
  tracking_number: yup
    .string()
    .required('Tracking number is required')
    .matches(/^[a-zA-Z0-9]+$/, 'Tracking number must be alphanumeric'),
});

export const uploadInvoiceValidationSchema = yup.object().shape({
  invoice_number: yup
    .string()
    .required('Invoice number is required')
    .typeError('Invoice number must be a string'),
  invoice_date: yup
    .date()
    .required('Invoice date is required')
    .max(
      new Date(new Date().setHours(23, 59, 59, 999)),
      'Invoice date cannot be in the future'
    )
    .min(
      new Date(new Date().setDate(new Date().getDate() - 7)),
      'Invoice date cannot be older than 7 days'
    )
    .typeError('Invoice date must be a valid date'),
  gross_amount: yup
    .number()
    .required('Gross amount is required')
    .positive()
    .typeError('Gross amount must be a number'),
  total_gst_amount: yup
    .number()
    .required('GST amount is required')
    .positive('GST amount must be positive')
    .typeError('GST amount must be a number'),
  gst_percentage: yup
    .number()
    .required('GST percentage is required')
    .positive()
    .max(100)
    .typeError('GST percentage must be a number'),
});
