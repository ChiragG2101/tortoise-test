import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { formatAsCurrency } from '@/features/common/utils';

const selectedChipStyles = {
  border: '2px solid #16AF8E',
  background: '#E6FFE6',
};

const InvoiceCards = ({ list = [], setSelectedBillingOverview }) => {
  const [selectedChip, setSelectedChip] = useState(0);

  const handleChipClick = (item, index) => {
    setSelectedChip(index);
    setSelectedBillingOverview(item);
  };

  if (list?.length === 0) {
    return (
      <div className='flex flex-col p-5 border border-black-2 rounded-lg items-center justify-center'>
        <p>No data to display</p>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-3'>
      {list?.map((item, index) => (
        <div
          className='flex flex-col p-5 border gap-6 border-black-2 rounded-lg'
          style={index === selectedChip ? selectedChipStyles : {}}
          onClick={() => handleChipClick(item, index)}
          key={item?.id || index}
        >
          <p className='text-sm font-semibold leading-5 text-black-10'>
            {item.state__name}
          </p>

          <div className='flex justify-between'>
            <div className='flex flex-col gap-2'>
              <p className='text-sm font-medium leading-5 text-black-8 opacity-60'>
                Invoice amount
              </p>
              <p className='text-xl leading-5 font-semibold text-black-10'>
                {formatAsCurrency(item.total_amount)}
              </p>
            </div>

            <div className='flex flex-col gap-2'>
              <p className='text-sm font-medium leading-5 text-black-8 opacity-60'>
                Delivered orders
              </p>
              <p className='text-xl leading-5 font-semibold text-black-10'>
                {item?.orders_delivered}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

InvoiceCards.propTypes = {
  list: PropTypes.array,
  setSelectedBillingOverview: PropTypes.func,
};
export default InvoiceCards;
