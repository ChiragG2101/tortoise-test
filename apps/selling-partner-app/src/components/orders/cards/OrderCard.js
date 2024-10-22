import { Avatar, User } from '@nextui-org/react';
import { Copy } from '@phosphor-icons/react';
import { toast } from 'react-toastify';
import { copyToClipboard } from '@/features/common/utils';

export default function OrderCard({ orderData }) {
  return (
    <div>
      <p className='font-semibold'>Ordered by</p>
      <div className='mt-2 flex flex-col gap-4 border-1 border-black-3 p-4 rounded-lg'>
        <div className='flex justify-between pb-4 border-b-1 border-b-black-2'>
          <div className='flex flex-col gap-1'>
            <User
              name={orderData?.consumer_details?.full_name}
              description={
                <div className='flex flex-col'>
                  <p className='text-black-8 opacity-60'>
                    {orderData?.consumer_details?.email}
                  </p>
                  <p className='text-black-8 opacity-60'>
                    {orderData?.consumer_details?.phone}
                  </p>
                </div>
              }
              avatarProps={{
                src: orderData?.consumer_details?.avatar,
                style: {
                  backgroundColor: '#2AC393',
                },
              }}
            />
          </div>
          <div className='flex flex-col items-end gap-1'>
            <p className='text-sm'>Customer</p>
            <Avatar
              size='sm'
              radius='lg'
              className='p-0.5 bg-black-2'
              imgProps={{
                className: 'object-fill',
              }}
              src={orderData?.organization_details?.logo}
              name={orderData?.organization_details?.name}
            />
          </div>
        </div>
        <div className='pb-4 border-b-1 border-b-black-2'>
          <p className='text-xs text-black-6 mb-1'>Shipping Address</p>
          <p className='text-sm'>
            {orderData?.shipping_address?.address1},{' '}
            {orderData?.shipping_address?.address2},{' '}
            {orderData?.shipping_address?.city},{' '}
            {orderData?.shipping_address?.state},{' '}
            {orderData?.shipping_address?.country} -{' '}
            {orderData?.shipping_address?.pincode}
          </p>
          <p className='text-sm'>Phone: {orderData?.consumer_details?.phone}</p>
        </div>
        <div>
          <p className='text-xs text-black-6 mb-1'>Billing Address</p>
          <p className='text-sm'>{orderData?.billing_address}</p>
          {orderData?.order_details?.gst && (
            <div className='flex justify-between items-center pt-2'>
              <div className='flex items-center gap-1'>
                <p className='text-xs text-black-8 font-medium opacity-60'>{`GST IN: ${orderData?.order_details?.gst?.gstin}`}</p>
                <Copy
                  size={15}
                  className='cursor-pointer text-black-8 opacity-60'
                  onClick={() => {
                    toast.success('GST copied to clipboard!');
                    copyToClipboard(orderData?.order_details?.gst?.gstin);
                  }}
                />
              </div>
              <div>
                <p className='text-xs text-black-8 font-medium opacity-60'>{`State: ${orderData?.order_details?.gst?.state}`}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
