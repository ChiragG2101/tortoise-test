import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { selectSupplier } from '@/features/auth/slice';
import { Button } from '@nextui-org/react';
import Dropzone from '@/components/common/Dropzone';
import DropzonePreview from '@/components/common/DropzonePreview';
import { useUploadDeliveryProofMutation } from '@/features/order/api';

const AddDeliveryProof = ({ orderData }) => {
  const [files, setFiles] = useState(null);
  const supplier = useSelector(selectSupplier);
  const [uploadDeliveryProof, { isLoading: isProofOfDeliveryUploading }] =
    useUploadDeliveryProofMutation();

  const onUploadDeliveryProof = async () => {
    if (!files) {
      toast.error('Please upload proof of delivery');
      return;
    }
    try {
      await uploadDeliveryProof({
        supplierId: supplier,
        lessorOrderProductIds: orderData?.order_products?.map(
          (product) => product?.id
        ),
        proofOfDeliveryFiles: files,
      }).unwrap();
      setFiles(null);
      toast.success('Delivery proof uploaded successfully');
    } catch (error) {
      console.error('Error in uploading files:', error);
    }
  };

  return (
    <div className='flex flex-col gap-2'>
      <div className='flex justify-between'>
        <p className='font-semibold text-base'>Upload proof of delivery</p>
        <p
          className='text-sm text-green-8 cursor-pointer'
          onClick={() => {
            setFiles(null);
          }}
        >
          Reset
        </p>
      </div>
      <div className='flex flex-col p-4 gap-4 border border-black-3 border-b-2 rounded-lg'>
        <Dropzone
          title='Upload files'
          acceptedFormats={{
            'application/pdf': ['.pdf'],
            'image/jpeg': ['.jpeg'],
            'image/png': ['.png'],
            'image/jpg': ['.jpg'],
            'text/csv': ['.csv'],
          }}
          onDrop={(acceptedFiles) => {
            setFiles(files ? [...files, ...acceptedFiles] : acceptedFiles);
          }}
        />

        {files?.map((file, index) => (
          <DropzonePreview key={`${file?.name}_${index}`} file={file} />
        ))}

        <Button
          type='submit'
          className='text-white bg-black-10 rounded-lg'
          isLoading={isProofOfDeliveryUploading}
          onClick={onUploadDeliveryProof}
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

AddDeliveryProof.propTypes = {
  orderData: PropTypes.object,
};
export default AddDeliveryProof;
