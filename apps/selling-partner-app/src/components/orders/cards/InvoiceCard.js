import React from 'react';

export default function InvoiceCard({ orderData }) {
  const productWithInvoice = orderData?.order_products?.find(
    (product) => product.supplier_invoice
  );

  if (!productWithInvoice) {
    return <></>;
  }

  return (
    <div>
      <p className='font-semibold'>Invoice</p>
      <a
        href={productWithInvoice.supplier_invoice_url}
        className='cursor-pointer'
        target='_blank'
        rel='noopener noreferrer'
      >
        <div className='mt-2 flex items-center gap-4 border-1 border-black-3 p-4 rounded-lg'>
          <img
            src={'/assets/logo/pdf.svg'}
            className='p-2 bg-heat-1 rounded-md'
          />
          <p className='font-semibold text-sm'>
            {productWithInvoice.supplier_invoice}
          </p>
        </div>
      </a>
    </div>
  );
}
