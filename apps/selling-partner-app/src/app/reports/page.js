'use client';

import { Alarm, CaretDown, File, GridFour, Table } from '@phosphor-icons/react';
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Tab,
  Tabs,
} from '@nextui-org/react';
import { useState, useMemo } from 'react';
import ReportTemplates from '../../components/reports/report-templates/ReportTemplates';
import GeneratedReports from '@/components/reports/generated-reports/GeneratedReports';
import ScheduledReports from '@/components/reports/scheduled-reports';
import GenerateReportDrawer from '@/components/reports/GenerateReportDrawer';

export default function Reports() {
  const [isScheduling, setIsScheduling] = useState(false);
  const [isGenerateReportDrawer, setIsGenerateReportDrawer] = useState(false);

  const menuOptions = useMemo(
    () => [
      {
        label: (
          <div className='flex items-center gap-2'>
            <Table size={18} weight='fill' className='text-black-6' />
            <p>Generate Report</p>
          </div>
        ),
        value: 'Generate Report',
      },
      {
        label: (
          <div className='flex items-center gap-2'>
            <Alarm size={18} weight='fill' className='text-black-6' />
            <p>Schedule this report</p>
          </div>
        ),
        value: 'Schedule this report',
      },
    ],
    [isScheduling]
  );

  const handleCustomLabel = (value) => {
    return (
      <div className='flex justify-center items-center gap-2'>
        {isScheduling ? (
          <Alarm size={18} color='#fff' />
        ) : (
          <Table size={18} color='#fff' />
        )}
        <div
          className='pr-5 text-white'
          style={{ borderRight: '2px solid #167E62' }}
        >
          <p>{value?.value}</p>
        </div>
      </div>
    );
  };

  const handleSelectChange = (e) => {
    setIsScheduling(e === 'Schedule this report');
    setIsGenerateReportDrawer(true);
  };

  return (
    <div className='flex flex-col gap-5'>
      <div className='px-5 pb-5 border-b-1 flex items-center justify-between'>
        <div className='flex items-center gap-2 '>
          <File size={32} weight='duotone' className='text-primary-dark' />
          <div className='font-semibold body-xlarge'>Reports</div>
        </div>
      </div>

      <div
        className='flex items-center justify-between bg-green-1 px-10 py-2'
        style={{ borderTop: '2px solid #0000000D' }}
      >
        <div className='flex items-center gap-5'>
          <img src={'/assets/logo/excel-logo.svg'} alt='excel' />
          <div className='flex flex-col'>
            <h3>Generate reports for</h3>
            <p>
              Get reports in .xlsx for all employee and billing related
              information
            </p>
          </div>
        </div>

        <Dropdown>
          <DropdownTrigger defaultValue={'Generate Report'}>
            <Button
              variant='bordered'
              className='min-w-[200px] bg-green-7 border border-[#167E62] border-b-2 border-b-[#167E62] rounded-lg text-white'
              startContent={
                <Table size={20} weight='fill' className='text-white' />
              }
              endContent={
                <CaretDown size={20} weight='fill' className='text-white' />
              }
            >
              Generate Reports for
            </Button>
          </DropdownTrigger>

          <DropdownMenu
            aria-label='Generate reports for'
            placeholder='Generate reports for'
          >
            {menuOptions.map((option) => (
              <DropdownItem
                key={option.value}
                onClick={() => handleSelectChange(option.value)}
              >
                {option.label}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
      </div>
      <div className='p-10 py-2 h-full flex gap-10'>
        <div
          className='w-3/5 rounded-lg overflow-auto py-5 px-10'
          style={{
            border: '1px solid #E1E1E1',
            borderBottom: '2px solid #E1E1E1',
          }}
        >
          <Tabs
            aria-label='Options'
            color='primary'
            variant='underlined'
            classNames={{
              tabList:
                'gap-6 w-[1200px] relative rounded-none p-0 border-b border-divider',
              cursor: 'w-full bg-green-8',
              tab: 'max-w-fit px-0 h-10',
              tabContent: 'group-data-[selected=true]:text-green-8 h-full',
            }}
            className='w-full'
          >
            <Tab key='generated' title={'Generated Reports'}>
              <GeneratedReports generatedReportsClick={handleSelectChange} />
            </Tab>
            <Tab key='scheduled' title={'Scheduled Reports'}>
              <ScheduledReports scheduledReportsClick={handleSelectChange} />
            </Tab>
          </Tabs>
        </div>
        <div
          className='w-2/5 h-full rounded-lg overflow-y-auto p-10 '
          style={{
            border: '1px solid #E1E1E1',
            borderBottom: '2px solid #E1E1E1',
          }}
        >
          <div className='flex items-center justify-between mb-2'>
            <GridFour size={32} weight='fill' className='text-black-5' />
          </div>
          <div className='flex flex-col gap-10'>
            <div className='flex flex-col gap-2'>
              <h3>Report templates</h3>
              <p className='text-xs font-medium text-black-6'>
                Use these templates as is to define your report.
              </p>
            </div>
            <ReportTemplates />
          </div>
        </div>
      </div>
      <GenerateReportDrawer
        isScheduling={isScheduling}
        isDrawerOpen={isGenerateReportDrawer}
        onClose={() => setIsGenerateReportDrawer(false)}
      />
    </div>
  );
}
