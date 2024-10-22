import { Alarm, Table } from '@phosphor-icons/react';
import React from 'react';

const DAYS_OF_WEEK = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export default function ScheduledReportCard({
  report_name,
  created_at,
  day_of_month,
  day_of_week,
  recurring_choice,
  scheduled_date_time,
}) {
  return (
    <div className='flex items-center justify-between'>
      <div className='flex items-center justify-between gap-5'>
        <div className='p-5 rounded-lg bg-purple-1 flex'>
          <Table size={24} weight='fill' className='text-purple-9' />
        </div>
        <div>
          <p className='font-semibold text-sm'>{report_name}</p>
          <div className='flex items-start gap-2'>
            {(day_of_month || day_of_week) && (
              <Alarm size={16} className='text-black-5' weight='fill' />
            )}
            <p className='text-black-5 font-medium'>
              {day_of_month && (
                <>
                  Scheduled for{' '}
                  <span className='text-black-9'>
                    {day_of_month} of every month
                  </span>
                </>
              )}
              {day_of_week && DAYS_OF_WEEK[day_of_week] && (
                <>
                  Scheduled for{' '}
                  <span className='text-black-9'>
                    {DAYS_OF_WEEK[day_of_week]} every week
                  </span>
                </>
              )}
              {!recurring_choice && (
                <>
                  Scheduled for{' '}
                  <span className='text-black-9'>
                    {new Date(scheduled_date_time).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}{' '}
                  </span>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
      <div>
        <p className='text-black-7 text-sm'>Created on</p>
        <p className='text-black-5 text-xs'>
          {new Date(created_at).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          })}{' '}
        </p>
      </div>
    </div>
  );
}
