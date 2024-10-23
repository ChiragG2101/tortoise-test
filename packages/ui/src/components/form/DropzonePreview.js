export default function DropzonePreview({ file }) {
  if (file)
    return (
      <div className='border-2 border-black-2 rounded-lg overflow-hidden flex items-center gap-5'>
        <img src={'/assets/logo/pdf.svg'} className='p-2 bg-heat-1' />
        <div>
          <p className='text-black-10 text-sm'>{file.name}</p>
          <p className='text-black-8 text-xs'>
            {(file.size / 1024 / 1024).toFixed(2)} MB
          </p>
        </div>
      </div>
    );
  return <></>;
}
