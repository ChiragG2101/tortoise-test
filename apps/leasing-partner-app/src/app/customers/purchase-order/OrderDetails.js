import React, { useCallback } from 'react';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import {
  Copy,
  SealWarning,
  Package,
  CalendarCheck,
  ShoppingBag,
  Money,
  Coins,
} from '@phosphor-icons/react';
import { Select, SelectItem, User } from '@nextui-org/react';
import OrganizationCellItem from '@/components/common/table/cell-item/OrganizationCellItem';
import ProductCellItem from '@/components/common/table/cell-item/ProductCellItem';
import { formatAsCurrency } from '@/features/common/utils';
import { copyToClipboard } from '@/features/common/utils';
import DescriptorItem from '@/components/common/DescriptorItem';
import {
  useGetGstInfoQuery,
  useGetLessorOrderDetailsQuery,
  useUpdateRentalScheduleStateMutation,
  useUpdateBillingAddressMutation,
} from '@/features/customer/order/api';

const OrderDetails = ({ customerPurchaseOrder }) => {
  const { data: gstInfo, isLoading: isGstInfoLoading } = useGetGstInfoQuery(
    {
      id: 1, // temp change- Which id should i send here?
    },
    { skip: !customerPurchaseOrder?.id }
  );

  const { data: lessorOrderDetails } = useGetLessorOrderDetailsQuery(
    {
      order_id: customerPurchaseOrder?.id,
    },
    { skip: !customerPurchaseOrder?.id }
  );

  const [updateRentalScheduleState, { isLoading: isStateUpdating }] =
    useUpdateRentalScheduleStateMutation();
  const [updateBillingAddress, { isLoading: isBillingAddressUpdating }] =
    useUpdateBillingAddressMutation();

  const handleStateChange = useCallback(
    async (e) => {
      try {
        const selectedGstInfo = gstInfo?.find(
          (gst) => gst?.state_name === e.target.value
        );
        await updateRentalScheduleState({
          rental_schedule_id:
            lessorOrderDetails?.order_details?.rental_schedule?.id,
          gst_info_id: selectedGstInfo?.id,
          order_id: lessorOrderDetails?.id,
        }).unwrap();
      } catch (error) {
        console.error('Failed to change state:', error);
      }
    },
    [updateRentalScheduleState, gstInfo, lessorOrderDetails]
  );

  const handleBillingAddressChange = useCallback(
    async (e) => {
      try {
        const selectedGstInfo = gstInfo?.find(
          (gst) => gst?.address_str === e.target.value
        );
        await updateBillingAddress({
          order_id: lessorOrderDetails?.id,
          billing_address_id: selectedGstInfo?.address,
        }).unwrap();
      } catch (error) {
        console.error('Failed to change billing address:', error);
      }
    },
    [updateBillingAddress, gstInfo, lessorOrderDetails]
  );

  const productCount = customerPurchaseOrder?.lessor_order_products?.length;
  const sortedLessorOrderProducts = customerPurchaseOrder?.lessor_order_products
    ? [
        ...customerPurchaseOrder?.lessor_order_products.filter(
          (item) => item?.type === 'base'
        ),
        ...customerPurchaseOrder?.lessor_order_products.filter(
          (item) => item?.type !== 'base'
        ),
      ]
    : [];
  const uniqueSuppliers = [
    ...new Set(sortedLessorOrderProducts?.map((item) => item?.supplier_name)),
  ];

  const { first_name, last_name, email, phone, avatar } =
    lessorOrderDetails?.order_details?.consumer || {};

  return (
    <div className='flex flex-col gap-5'>
      <div className='flex flex-col gap-1'>
        <p className='text-sm font-semibold text-black-10'>
          Purchase order details
        </p>
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
              name={customerPurchaseOrder?.organization?.display_name}
              logo={customerPurchaseOrder?.organization?.logo}
            />
          </div>
          <div className='flex justify-between items-center'>
            <DescriptorItem
              title={'Order ID'}
              subtitle={customerPurchaseOrder?.id}
              isTitleHasOpacity={true}
              copyIcon={
                <Copy
                  onClick={() => {
                    toast.success('Order ID copied to clipboard!');
                    copyToClipboard(customerPurchaseOrder?.lease_request?.id);
                  }}
                  className='text-black-5 hover:cursor-pointer'
                />
              }
            />
            <DescriptorItem
              title={'Requested on'}
              subtitle={
                customerPurchaseOrder &&
                format(
                  new Date(customerPurchaseOrder?.created_at),
                  'dd MMMM yyyy'
                )
              }
              isTitleHasOpacity={true}
            />
          </div>
          <div className='flex justify-between items-center'>
            <DescriptorItem
              title={'Request ID'}
              subtitle={customerPurchaseOrder?.lease_request?.id}
              isTitleHasOpacity={true}
              copyIcon={
                <Copy
                  onClick={() => {
                    toast.success('Request ID copied to clipboard!');
                    copyToClipboard(customerPurchaseOrder?.lease_request?.id);
                  }}
                  className='text-black-5 hover:cursor-pointer'
                />
              }
            />
          </div>
          <div className='relative flex flex-col p-4 pt-6 mt-1 border border-black-3 rounded-lg'>
            <p className='absolute top-0 left-0 transform -translate-y-1/2 translate-x-2 bg-white px-2 text-sm font-medium text-black-6'>
              {productCount} {productCount > 1 ? 'items' : 'item'}
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
                  {sortedLessorOrderProducts.map((item) =>
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
            <div className='grid grid-cols-2 items-center '>
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
              <div className=''>
                <Select
                  items={gstInfo || []}
                  placeholder='Change state'
                  className='border border-gray-200 shadow rounded-lg'
                  size='md'
                  isLoading={isGstInfoLoading}
                  onChange={handleStateChange}
                >
                  {(state) => (
                    <SelectItem
                      key={state?.state_name}
                      textValue={state?.state_name}
                    >
                      <div className='flex flex-col'>
                        <span className='text-small'>{state?.state_name}</span>
                        <span className='text-tiny text-default-400'>
                          {state?.gstin}
                        </span>
                      </div>
                    </SelectItem>
                  )}
                </Select>
              </div>
            </div>
            {lessorOrderDetails?.order_details?.rental_schedule
              ?.is_state_updated && (
              <div className='flex gap-3 bg-highlight-grey-light-1 rounded-lg p-3 '>
                <SealWarning
                  size={25}
                  weight='fill'
                  className='text-[#AFAFAF]'
                />
                <div className='flex flex-col gap-1'>
                  <p className='text-xs font-semibold '>
                    Rental schedule state updated
                  </p>
                  <p className='text-xs font-medium'>
                    We&apos;ve assigned your default location and its GST for
                    this purchase order
                  </p>
                </div>
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
          <div className='flex flex-col gap-4'>
            <DescriptorItem
              title={'Billing address'}
              subtitle={lessorOrderDetails?.order_details?.billing_address}
              isTitleHasOpacity={true}
            />
            <div className=''>
              <Select
                items={gstInfo || []}
                placeholder='Change billing address'
                className='border border-gray-200 shadow rounded-lg'
                size='md'
                isLoading={isGstInfoLoading}
                onChange={handleBillingAddressChange}
              >
                {(state) => (
                  <SelectItem
                    key={state?.address_str}
                    textValue={state?.address_str}
                  >
                    <div className='flex flex-col'>
                      <p className='text-small'>
                        {state?.address_str?.split(' ').slice(0, 3).join(' ')}
                      </p>
                      <p className='text-wrap text-default-400'>
                        {state?.address_str}
                      </p>
                    </div>
                  </SelectItem>
                )}
              </Select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

OrderDetails.propTypes = {
  customerPurchaseOrder: PropTypes.object,
};

export default OrderDetails;
