import { Upload } from '@phosphor-icons/react';
import { useDropzone } from 'react-dropzone';
import { useController } from 'react-hook-form';

export default function DropzoneInput({
  control,
  name,
  accept,
  errors,
  clearErrors,
  allowedFileFormat,
}) {
  const {
    field: { onChange, onBlur, ref },
  } = useController({
    name,
    control,
    defaultValue: [],
  });

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      onChange(acceptedFiles[0]);
      clearErrors(name);
    },
    accept,
  });

  return (
    <>
      <div
        {...getRootProps()}
        className={
          'border-2 border-dashed px-10 py-5 rounded-xl text-center cursor-pointer border-primary-main'
        }
      >
        <input {...getInputProps()} onBlur={onBlur} ref={ref} />
        {isDragActive ? (
          <p className='text-blue-500'>Drop the files here ...</p>
        ) : (
          <div className='flex flex-col items-center'>
            <Upload size={20} weight='fill' className='text-primary-main' />
            <div className='text-primary-main body-xsmall'>{}</div>
            {allowedFileFormat && (
              <p className='text-black-5 text-xs'>
                In {allowedFileFormat} format
              </p>
            )}
          </div>
        )}
      </div>
      {errors[name] && <p className='text-red-500'>{errors[name].message}</p>}
    </>
  );
}
