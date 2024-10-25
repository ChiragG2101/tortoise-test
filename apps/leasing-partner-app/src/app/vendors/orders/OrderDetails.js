import React from 'react';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import {
  Copy,
  ArrowsClockwise,
  Package,
  CalendarCheck,
  ShoppingBag,
  Money,
  Coins,
} from '@phosphor-icons/react';
import { User } from '@nextui-org/react';
import {
  OrganizationCellItem,
  ProductCellItem,
  DescriptorItem,
} from '@repo/ui/components';
import { formatAsCurrency } from '@/features/common/utils';
import { copyToClipboard } from '@/features/common/utils';
import { useGetLessorOrderDetailsQuery } from '@/features/customer/order/api';

const OrderDetails = ({ vendorOrder }) => {
  const { data: lessorOrderDetails } = useGetLessorOrderDetailsQuery(
    {
      order_id: vendorOrder?.id,
    },
    { skip: !vendorOrder?.id }
  );

  const productCount = vendorOrder?.lessor_order_products?.length;
  const sortedOrderProducts = vendorOrder?.lessor_order_products
    ? [
        ...vendorOrder?.lessor_order_products.filter(
          (item) => item?.type === 'base'
        ),
        ...vendorOrder?.lessor_order_products.filter(
          (item) => item?.type !== 'base'
        ),
      ]
    : [];
  const uniqueSuppliers = [
    ...new Set(sortedOrderProducts?.map((item) => item?.supplier_name)),
  ];

  const { first_name, last_name, email, phone, avatar } =
    lessorOrderDetails?.order_details?.consumer || {};

  return (
    <div className='flex flex-col gap-5'>
      <div className='flex flex-col gap-1'>
        <p className='text-sm font-semibold text-black-10'>Order details</p>
        <div className='flex flex-col gap-5 p-4 border border-b-2 border-black-2 rounded-lg shadow-sm'>
          <div className='flex justify-between items-center pb-5 border-b-1 border-black-2 '>
            <User
              name={`${first_name} ${last_name ? last_name : ''}`}
              description={
                <div className='flex flex-col'>
                  <p className='text-black-8 opacity-60'>{email}</p>
                  <p className='text-black-8 opacity-60'>{phone}</p>
                </div>
              }
              avatarProps={{
                src: avatar,
                style: {
                  backgroundColor: '#2AC393',
                },
              }}
            />
            <OrganizationCellItem
              name={vendorOrder?.organization?.name}
              logo={vendorOrder?.organization?.logo}
            />
          </div>
          <div className='flex justify-between items-center'>
            <DescriptorItem
              title={'Order ID'}
              subtitle={vendorOrder?.id}
              isTitleHasOpacity={true}
              copyIcon={
                <Copy
                  onClick={() => {
                    toast.success('Order ID copied to clipboard!');
                    copyToClipboard(vendorOrder?.id);
                  }}
                  className='text-black-5 hover:cursor-pointer'
                />
              }
            />
            <DescriptorItem
              title={'PO placed on'}
              subtitle={
                vendorOrder &&
                format(
                  new Date(vendorOrder?.placed_to_supplier_at),
                  'dd MMMM yyyy'
                )
              }
              isTitleHasOpacity={true}
            />
          </div>
          <div className='flex justify-between items-center'>
            <DescriptorItem
              title={'Request ID'}
              subtitle={vendorOrder?.lease_request?.id}
              isTitleHasOpacity={true}
              copyIcon={
                <Copy
                  onClick={() => {
                    toast.success('Request ID copied to clipboard!');
                    copyToClipboard(vendorOrder?.lease_request?.id);
                  }}
                  className='text-black-5 hover:cursor-pointer'
                />
              }
            />
            <DescriptorItem
              title={'Requested on'}
              subtitle={
                vendorOrder &&
                format(new Date(vendorOrder?.created_at), 'dd MMMM yyyy')
              }
              isTitleHasOpacity={true}
            />
          </div>
          <div className='relative flex flex-col p-4 pt-6 mt-1 border border-black-3 rounded-lg'>
            <p className='absolute top-0 left-0 transform -translate-y-1/2 translate-x-2 bg-white px-2 text-sm font-medium text-black-6'>
              Ordered {productCount} {productCount > 1 ? 'items' : 'item'}
            </p>
            <div className='flex flex-col gap-5'>
              {uniqueSuppliers.map((supplierName, index) => (
                <div
                  key={supplierName}
                  className={`flex flex-col gap-4 ${index !== uniqueSuppliers.length - 1 ? 'pb-5 border-b-1 border-black-2 ' : ''}`}
                >
                  <div className='flex gap-2 items-center'>
                    <Package weight='fill' className='text-[#AFAFAF]' />
                    <p className='text-xs font-medium opacity-60 text-black-8'>
                      Fulfilled by {supplierName}
                    </p>
                  </div>
                  {sortedOrderProducts.map((item) =>
                    item?.supplier_name === supplierName ? (
                      <div
                        className={`flex justify-between items-center `}
                        key={item?.id}
                      >
                        <ProductCellItem
                          products={[item?.product]}
                          subtitle={
                            <div className='flex gap-1 items-center text-inherit'>
                              {(item?.product?.properties?.storage?.name ||
                                item?.product?.properties?.color?.name) && (
                                <p>
                                  {item?.product?.properties?.storage?.name
                                    ? `${item?.product?.properties?.storage?.name}`
                                    : ''}
                                  {item?.product?.properties?.storage?.name &&
                                  item?.product?.properties?.color?.name
                                    ? '  •  '
                                    : ''}
                                  {item?.product?.properties?.color?.name
                                    ? `${item?.product?.properties?.color?.name}`
                                    : ''}
                                  {' | '}
                                </p>
                              )}
                              {item?.product?.manufacturer_product_code}{' '}
                              <Copy
                                onClick={() => {
                                  copyToClipboard(
                                    item?.product?.manufacturer_product_code
                                  );
                                  toast.success(
                                    'Manufacturer product code copied to clipboard',
                                    {
                                      autoClose: 1000,
                                      hideProgressBar: true,
                                    }
                                  );
                                }}
                                className='text-inherit hover:text-black-7 cursor-pointer rounded hover:bg-black-1'
                              />
                            </div>
                          }
                        />
                        <p className='text-sm font-medium text-black-8'>
                          {formatAsCurrency(item?.price)}
                        </p>
                      </div>
                    ) : null
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className='flex flex-col gap-1'>
        <p>Rental info</p>
        <div className='flex flex-col gap-5 p-4 border border-b-2 border-black-2 rounded-lg shadow-sm'>
          <div className='flex justify-between items-center'>
            <div className='flex items-center gap-2'>
              <CalendarCheck size={20} weight='fill' className='text-pink-6' />
              <p className='text-sm'>Tenure</p>
            </div>
            <p className='text-sm font-semibold '>
              {lessorOrderDetails?.order_details?.tenure} months
            </p>
          </div>
          <div className='flex justify-between items-center'>
            <div className='flex items-center gap-2'>
              <ShoppingBag size={20} weight='fill' className='text-pink-6' />
              <p className='text-sm'>Bundle Price</p>
            </div>
            <p className='text-sm font-semibold '>
              {formatAsCurrency(lessorOrderDetails?.order_amount)}
            </p>
          </div>
          <div className='flex justify-between items-center'>
            <div className='flex items-center gap-2'>
              <Money size={20} weight='fill' className='text-pink-6' />
              <p className='text-sm'>Monthly rental</p>
            </div>
            <p className='text-sm font-semibold '>
              {formatAsCurrency(
                lessorOrderDetails?.order_details?.rental_schedule
                  ?.instalment_amount
              )}
            </p>
          </div>
          <div className='flex justify-between items-center'>
            <div className='flex items-center gap-2'>
              <Coins size={20} weight='fill' className='text-pink-6' />
              <p className='text-sm'>Buyback deposit</p>
            </div>
            <p className='text-sm font-semibold '>
              {formatAsCurrency(
                lessorOrderDetails?.order_details?.rental_schedule
                  ?.security_deposit_amount
              )}
            </p>
          </div>
        </div>
      </div>

      <div className='flex flex-col gap-1'>
        <p className='text-base font-semibold text-black-10'>GST details</p>
        <div className='flex flex-col gap-5 p-4 border border-black-2 rounded-lg shadow-sm'>
          <div className='flex flex-col pb-4 gap-2 border-b-1 border-black-2 '>
            <p className='text-xs font-medium text-black-8 opacity-60'>
              Rental Schedule State
            </p>
            <DescriptorItem
              title={
                lessorOrderDetails?.order_details?.rental_schedule?.state
                  ?.name ?? ''
              }
              subtitle={
                lessorOrderDetails?.order_details?.rental_schedule?.state
                  ?.gstin ?? ''
              }
              isTitleHasOpacity={false}
            />
            {lessorOrderDetails?.order_details?.rental_schedule
              ?.is_state_updated && (
              <div className='flex gap-3 bg-highlight-grey-light-1 rounded-lg p-3 '>
                <ArrowsClockwise
                  size={15}
                  weight='fill'
                  className='text-[#AFAFAF]'
                />
                <p className='text-xs font-medium'>
                  {`State was changed to ${lessorOrderDetails?.order_details?.shipping_adress_state} 
                  by ${lessorOrderDetails?.order_details?.rental_schedule?.state_updated_by} 
                  on ${
                    lessorOrderDetails?.order_details?.rental_schedule
                      ?.state_updated_at
                      ? format(
                          new Date(
                            lessorOrderDetails?.order_details?.rental_schedule?.state_updated_at
                          ),
                          'dd MMMM yyyy'
                        )
                      : '-'
                  }`}
                </p>
              </div>
            )}
          </div>

          <div className='flex flex-col pb-4 gap-4 border-b-1 border-black-2 '>
            <DescriptorItem
              title={'Delivery State'}
              subtitle={
                lessorOrderDetails?.order_details?.shipping_adress_state
              }
              isTitleHasOpacity={true}
            />
            <DescriptorItem
              title={'Shipping address'}
              subtitle={lessorOrderDetails?.order_details?.shipping_address}
              isTitleHasOpacity={true}
            />
          </div>
          <div className=''>
            <DescriptorItem
              title={'Billing address'}
              subtitle={lessorOrderDetails?.order_details?.billing_address}
              isTitleHasOpacity={true}
            />
          </div>
        </div>
      </div>

      <div className=''>
        <p className='text-base font-semibold text-black-10'>Vendor details</p>
        <div className='flex gap-5 p-4 border border-black-2 rounded-lg shadow-sm'>
          <OrganizationCellItem name={vendorOrder?.potential_supplier} />
        </div>
      </div>
    </div>
  );
};

OrderDetails.propTypes = {
  vendorOrder: PropTypes.object,
};

export default OrderDetails;
