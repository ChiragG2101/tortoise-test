import { selectSupplier } from '@/features/auth/slice';
import { useGetOrderByIdQuery } from '@/features/order/api';
import { skipToken } from '@reduxjs/toolkit/query';
import React from 'react';
import { useSelector } from 'react-redux';
import ProductCard from '../cards/ProductCard';
import { LESSOR_ORDER_PRODUCT_STATUS } from '@/features/order/constants';
import ShippingForm from '../forms/ShippingForm';
import AddInvoice from '../forms/AddInvoice';
import InvoiceCard from '../cards/InvoiceCard';

export default function ShippingDetails({ orderId }) {
  const supplier = useSelector(selectSupplier);
  const { data: orderData } = useGetOrderByIdQuery(
    orderId && supplier ? { orderId: orderId, supplierId: supplier } : skipToken
  );

  const filteredProducts = orderData?.order_products.filter(
    (product) => product.status === LESSOR_ORDER_PRODUCT_STATUS.CONFIRMED
  );

  const hasInvoice = filteredProducts?.some(
    (product) => product.supplier_invoice
  );

  if (!orderData) return <></>;
  return (
    <div className='flex flex-col gap-5'>
      <ProductCard
        orderData={orderData}
        status={LESSOR_ORDER_PRODUCT_STATUS.CONFIRMED}
        allowEdit={true}
      />
      {hasInvoice ? (
        <InvoiceCard orderData={orderData} />
      ) : (
        <AddInvoice orderData={orderData} orderId={orderId} />
      )}
      <ShippingForm orderData={orderData} orderId={orderId} />
    </div>
  );
}
