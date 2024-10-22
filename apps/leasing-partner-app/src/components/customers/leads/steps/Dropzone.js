/* eslint-disable @next/next/no-img-element */

import { Upload } from '@phosphor-icons/react';
import { useDropzone } from 'react-dropzone';

function Dropzone({ onDrop }) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: '.docx',
  });

  return (
    <>
      <div
        {...getRootProps()}
        className={
          'border-2 border-dashed px-10 py-5 rounded-xl text-center cursor-pointer border-[#775DB3]'
        }
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className='text-blue-500'>Drop the files here ...</p>
        ) : (
          <div className='flex flex-col items-center'>
            <Upload size={20} weight='fill' className='text-purple' />
            <div className='text-purple body-xsmall'>Upload MRA</div>
            <p className='text-gray-500 text-xs'>In .docx format</p>
          </div>
        )}
      </div>
    </>
  );
}

export default Dropzone;
