/* eslint-disable @next/next/no-img-element */
import { DownloadSimple } from '@phosphor-icons/react';
import { docTypeToLabel } from './Step1';

async function downloadFile(doc) {
  const url = doc.document;
  const response = await fetch(url);
  const blob = await response.blob();
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = doc.description ?? docTypeToLabel[doc.document_type];
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export default function DocumentCard({ doc }) {
  return (
    <div className='border border-b-2 p-2 rounded-lg flex items-center justify-between'>
      <div className='flex items-center -mb-2 gap-2'>
        <img src='/assets/document.svg' alt='Document' />
        <div className='-mt-1'>
          <div className='text-sm font-semibold'>
            {doc.description ?? docTypeToLabel[doc.document_type]}
          </div>
        </div>
      </div>
      <div className='pr-2'>
        <DownloadSimple
          size={24}
          weight='fill'
          className='cursor-pointer text-black-6'
          onClick={() => downloadFile(doc)}
        />
      </div>
    </div>
  );
}
