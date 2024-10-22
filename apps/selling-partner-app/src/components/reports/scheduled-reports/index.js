import React, { useMemo, useState } from 'react';
import { Alarm } from '@phosphor-icons/react';
import { useGetScheduleddReportsQuery } from '@/features/reports/api';
import { Pagination, Spinner } from '@nextui-org/react';
import ScheduledReportCard from './ScheduledReportCard.js';

const PAGE_SIZE = 15;
export default function ScheduledReports({ scheduledReportsClick }) {
  const [page, setPage] = useState(1);
  const { data: scheduledReports, isLoading: isDataLoading } =
    useGetScheduleddReportsQuery({ page, page_size: PAGE_SIZE });

  const pages = useMemo(() => {
    return scheduledReports?.count
      ? Math.ceil(scheduledReports.count / PAGE_SIZE)
      : 0;
  }, [scheduledReports]);

  if (isDataLoading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <Spinner />
      </div>
    );
  }

  if (scheduledReports?.count === 0) {
    return (
      <div className='h-full'>
        <div>
          <h3>Scheduled Reports</h3>
          <p className='text-xs font-medium text-black-6 '>
            Receive recurring reports automatically, you don&apos;t need to
            generate them manually every time
          </p>
        </div>
        <div className='flex flex-col justify-center items-center pt-[100px] gap-5'>
          <div>
            <p className='text-center text-xs font-medium text-black-5 '>
              You haven&apos;t scheduled any reports yet,
            </p>
            <p className='text-center text-xs font-medium text-black-5'>
              Schedule your first report
            </p>
          </div>
          <div
            className='flex items-center gap-2 text-sm rounded-lg p-2 px-3 cursor-pointer'
            style={{
              border: '1px solid #EEEEEE',
              boxShadow: '0px 1px 0px 0px #EEEEEE',
            }}
            onClick={() => scheduledReportsClick('Schedule this report')}
          >
            <Alarm size={18} weight='fill' className='text-black-6' />
            <p>Schedule Report</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-4'>
      <div>
        <h3>Scheduled reports</h3>
        <div className='font-medium text-black-6 text-xs'>
          Receive recurring reports automatically, you don&apos;t need to
          generate them manually every time
        </div>
      </div>
      <div className='my-5 flex flex-col gap-10'>
        {scheduledReports?.results?.map((report) => (
          <ScheduledReportCard key={report.id} {...report} />
        ))}
      </div>
      {pages > 1 ? (
        <Pagination
          className='self-end pt-2'
          current={page}
          onChange={(page) => setPage(page)}
          pageSize={PAGE_SIZE}
          total={scheduledReports?.count}
          showSizeChanger={false}
        />
      ) : null}
    </div>
  );
}
