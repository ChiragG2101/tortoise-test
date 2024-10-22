import { Upload } from '@phosphor-icons/react';
import { useDropzone } from 'react-dropzone';

function Dropzone({
  onDrop,
  title,
  subtitle,
  acceptedFormats = {
    'application/pdf': ['.pdf'],
    'text/csv': ['.csv'],
  },
}) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFormats,
  });

  return (
    <div
      {...getRootProps()}
      className={
        'border-2 border-dashed p-10 rounded-xl text-center cursor-pointer border-violet-500 text-violet-500'
      }
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <div className='flex flex-col items-center'>
          <Upload size={20} weight='fill' />
          <div className='body-xsmall'>{title}</div>
          <div className='text-xs text-black-7'>{subtitle}</div>
        </div>
      )}
    </div>
  );
}

export default Dropzone;
