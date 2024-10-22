import React from 'react';
import PropTypes from 'prop-types';

const DeliveryProofCard = ({ deliveryProofs = [] }) => {
  const getFileName = (url = '') => {
    const fileName = url?.match(/delivery_proofs\/\d+\/([^?]+)/)?.[1];
    return fileName || 'Delivery proof file';
  };

  return (
    <div className='flex flex-col gap-2'>
      <p className='font-semibold'>Delivery Proofs</p>
      <div className='flex flex-col gap-5 border-1 border-black-3 rounded-lg p-4'>
        {deliveryProofs?.length === 0 ? (
          <div className='flex justify-center items-center h-16 text-base text-black-8 '>
            No delivery proofs available
          </div>
        ) : (
          deliveryProofs?.map((item) => (
            <a
              href={item.document}
              className='cursor-pointer'
              target='_blank'
              rel='noopener noreferrer'
              key={item?.id}
            >
              <div className='flex items-center gap-4 border-1 border-black-3 rounded-lg p-4'>
                <img
                  src={'/assets/logo/pdf.svg'}
                  className='p-2 bg-heat-1 rounded-md'
                />
                <p className='font-semibold text-sm'>
                  {getFileName(item.document)}
                </p>
              </div>
            </a>
          ))
        )}
      </div>
    </div>
  );
};

DeliveryProofCard.propTypes = {
  deliveryProofs: PropTypes.object,
};
export default DeliveryProofCard;
