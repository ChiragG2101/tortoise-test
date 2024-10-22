import { DownloadSimple, Table } from '@phosphor-icons/react';
import React from 'react';

export default function GeneratedReportCard({ report_name, created_at, file }) {
  return (
    <a href={file} target='_blank' rel='noopener noreferrer'>
      <div className='flex items-center justify-between'>
        <div className='flex justify-between gap-5'>
          <div className='p-2.5 rounded-lg bg-purple-1 flex h-1/2'>
            <Table size={24} weight='fill' className='text-purple-9' />
          </div>
          <div className='flex flex-col justify-center'>
            <div className='font-semibold text-sm'>{report_name}</div>
            {/* TODO: Still need to add columns for the report */}
            {/* <div className="text-black-5 font-medium">
            Employee ID, Employee Name, Department, Claim value
          </div> */}
            <div className='text-black-5 text-xs font-medium'>
              {new Date(created_at).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })}{' '}
              {new Date(created_at).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              })}
            </div>
          </div>
        </div>
        <div>
          <DownloadSimple size={20} weight='bold' className='text-black-5' />
        </div>
      </div>
    </a>
  );
}
