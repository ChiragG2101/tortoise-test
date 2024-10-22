import React, { useMemo, useState } from 'react';
import GeneratedReportCard from './GeneratedReportCard';
import { useGetGeneratedReportsQuery } from '@/features/reports/api';
import { Pagination, Spinner } from '@nextui-org/react';
import { Table } from '@phosphor-icons/react';

const PAGE_SIZE = 15;
export default function GeneratedReports({ generatedReportsClick }) {
  const [page, setPage] = useState(1);
  const { data: generatedReports, isLoading: isDataLoading } =
    useGetGeneratedReportsQuery({ page, page_size: PAGE_SIZE });

  const pages = useMemo(() => {
    return generatedReports?.count
      ? Math.ceil(generatedReports.count / PAGE_SIZE)
      : 0;
  }, [generatedReports]);

  if (isDataLoading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <Spinner />
      </div>
    );
  }

  if (generatedReports?.count === 0) {
    return (
      <div className=''>
        <div>
          <h3>Generated reports</h3>
          <p className='text-xs font-medium text-black-6 '>
            Get instant reports on claims, finance and payroll
          </p>
        </div>
        <div className='flex flex-col justify-center items-center pt-[100px] gap-5'>
          <div>
            <p className='text-center text-xs font-medium text-black-5 '>
              You haven&apos;t generated any reports yet,
            </p>
            <p className='text-center text-xs font-medium text-black-5'>
              Generate your first report
            </p>
          </div>
          <div
            className='flex items-center gap-2 text-sm rounded-lg p-2 px-3 cursor-pointer'
            style={{
              border: '1px solid #EEEEEE',
              boxShadow: '0px 1px 0px 0px #EEEEEE',
            }}
            onClick={generatedReportsClick}
          >
            <Table size={18} weight='fill' className='text-black-6' />
            <p>Generate Report</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-4'>
      <h3>Generated reports</h3>
      <div className='my-5 flex flex-col gap-6'>
        {generatedReports?.results?.map((report) => (
          <GeneratedReportCard key={report.id} {...report} />
        ))}
      </div>
      {pages > 1 ? (
        <Pagination
          className='self-end'
          showControls
          current={page}
          onChange={(page) => setPage(page)}
          pageSize={PAGE_SIZE}
          total={generatedReports?.count / PAGE_SIZE}
          showSizeChanger={false}
        />
      ) : null}
    </div>
  );
}
