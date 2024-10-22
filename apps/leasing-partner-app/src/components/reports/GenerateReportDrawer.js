'use client';

import React, { useState } from 'react';
import {
  Button,
  Input,
  Radio,
  RadioGroup,
  Select,
  SelectItem,
} from '@nextui-org/react';
import {
  useCreateDataExportRequestMutation,
  useCreatePeriodicDataExportRequestMutation,
} from '@/features/reports/api';
import { toast } from 'react-toastify';
import CustomTortoiseDrawer, {
  CustomTortoiseDrawerBody,
} from '../common/drawer';
import { useForm, Controller } from 'react-hook-form';
import { ReportTemplateSelector } from './ReportTemplateSelector';
import { useInfiniteScroll } from '@nextui-org/use-infinite-scroll';
import TemplateFilter from './TemplateFilter';

const GenerateReportForm = ({ template, control }) => {
  if (template.filters?.length === 0) {
    return null;
  }
  return (
    <div className='flex flex-col gap-1'>
      <div className='flex flex-col gap-2'>
        <div className='text-xs'>Select relevant filters for the report</div>
      </div>
      <div className='grid grid-cols-1 gap-x-4'>
        {template?.filters?.map((filter) => (
          <TemplateFilter key={filter.id} filter={filter} control={control} />
        ))}
      </div>
    </div>
  );
};

const ScheduleAndRecurringFormWrapper = ({ template, control }) => {
  const [reportFrequency, setReportFrequency] = useState(null);
  const reportTypes = [
    { value: 'onetime', label: 'One Time' },
    { value: 'recurring', label: 'Recurring' },
  ];
  return (
    <>
      {/* <div className='flex flex-col gap-4'>
        <div>How often do you want this report?</div>
        <Controller
          name='report_frequency'
          control={control}
          rules={{ required: 'Please select how often you want this report' }}
          render={({ field }) => (
            <RadioGroup
              {...field}
              onValueChange={(value) => {
                setReportFrequency(value);
                field.onChange(value);
              }}
              className='flex gap-4'
              color='success'
            >
              {reportTypes.map((reportType) => (
                <div
                  className='w-full p-4'
                  style={{
                    border:
                      reportFrequency === reportType.value
                        ? '2px solid #2AC393'
                        : '2px solid #E4E4E7',
                    borderRadius: '8px',
                  }}
                  key={`report_type_${reportType.value}`}
                >
                  <Radio value={reportType.value}>{reportType.label}</Radio>
                </div>
              ))}
            </RadioGroup>
          )}
        />
      </div>
      {reportFrequency === 'onetime' && (
        <ScheduleReportForm template={template} control={control} />
      )}
      {reportFrequency === 'recurring' && (
        <ScheduleRecurringReportForm control={control} />
      )} */}
      <ScheduleReportForm template={template} control={control} />
    </>
  );
};

const ScheduleReportForm = ({ template, control }) => {
  return (
    <div
      className='flex flex-col p-6 gap-6'
      style={{ border: '1px solid #E1E1E1', borderRadius: '8px' }}
    >
      <div className='flex flex-col gap-2'>
        <div className='text-base font-semibold'>One Time Report</div>
      </div>
      {template.filters?.length > 0 && (
        <GenerateReportForm template={template} control={control} />
      )}
      <div className='flex flex-col gap-1'>
        <div className='text-xs'>
          Select the date and time at which you want to receive this report
        </div>
        <div className='grid grid-cols-2 gap-x-4'>
          <div className='flex flex-col gap-1'>
            <div>Scheduled Date</div>
            <Controller
              name='scheduled_date_time'
              control={control}
              rules={{ required: 'Scheduled date is required' }}
              render={({ field, fieldState: { error } }) => (
                <Input
                  {...field}
                  errorMessage={error?.message}
                  isInvalid={!!error}
                  type='date'
                  className='w-full'
                />
              )}
            />
          </div>
          <div className='flex flex-col gap-1'>
            <div>Scheduled Time</div>
            <Controller
              name='scheduled_time'
              control={control}
              rules={{ required: 'Scheduled time is required' }}
              render={({ field, fieldState: { error } }) => (
                <Input
                  {...field}
                  errorMessage={error?.message}
                  isInvalid={!!error}
                  type='time'
                  className='w-full'
                />
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const ScheduleRecurringReportForm = ({ control }) => {
  const recurringDuration = {
    monthly: {
      value: 'monthly',
      label: 'Monthly',
      options: Array.from({ length: 28 }, (_, i) => ({
        value: (i + 1).toString(),
        label: (i + 1).toString(),
      })),
      selectorLabel: 'Day of month',
      selectorName: 'day_of_month',
      selectorError: 'Day of month is required',
      placeholder: 'Select day',
    },
    weekly: {
      value: 'weekly',
      label: 'Weekly',
      options: Array.from({ length: 7 }, (_, i) => ({
        value: ((i + 1) % 7).toString(),
        label: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
        ][i],
      })),
      selectorLabel: 'Day of the week',
      selectorName: 'day_of_week',
      selectorError: 'Day of week is required',
      placeholder: 'Select day',
    },
  };

  const [reportFrequency, setReportFrequency] = useState('monthly');

  const handleFrequencyChange = (e) => {
    setReportFrequency(e.target.value);
  };

  return (
    <div
      className='flex flex-col p-6 gap-6'
      style={{ border: '1px solid #E1E1E1', borderRadius: '8px' }}
    >
      <div className='flex flex-col gap-2'>
        <div className='text-base font-semibold'>Recurring report</div>
        <div className='text-xs'>When do you want to receive this report?</div>
      </div>
      <div className='grid grid-cols-2 gap-x-4'>
        <div className='flex flex-col gap-1'>
          <div>Frequency</div>
          <Controller
            name='recurring_frequency'
            control={control}
            rules={{ required: 'Report Frequency is Required' }}
            render={({ field }) => (
              <Select
                {...field}
                className='w-full'
                onChange={(e) => {
                  setReportFrequency(e.target.value);
                  field.onChange(e.target.value);
                }}
                value={reportFrequency}
                defaultValue={reportFrequency}
                placeholder='Select Frequency'
              >
                {Object.values(recurringDuration).map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </Select>
            )}
          />
        </div>
        <div className='flex flex-col gap-1'>
          <div>{recurringDuration[reportFrequency]?.selectorLabel}</div>
          <Controller
            name={recurringDuration[reportFrequency]?.selectorName}
            control={control}
            rules={{
              required: recurringDuration[reportFrequency]?.selectorError,
            }}
            placeholder={'Select day'}
            render={({ field }) => (
              <Select {...field} className='w-full'>
                {recurringDuration[reportFrequency].options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </Select>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default function GenerateReportDrawer({
  isScheduling,
  isDrawerOpen,
  onClose,
}) {
  const { handleSubmit, control, reset } = useForm();
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [
    createDataExportRequest,
    { isLoading: isCreateDataExportRequestLoading },
  ] = useCreateDataExportRequestMutation();

  const [
    createPeriodicDataExportRequest,
    { isLoading: isCreatePeriodicDataExportRequestLoading },
  ] = useCreatePeriodicDataExportRequestMutation();

  const onSubmit = async (values) => {
    const report_template = values.selectedTemplate;
    delete values.selectedTemplate;

    if (values.scheduled_date_time && values.scheduled_time) {
      const scheduledDateTime = new Date(
        `${values.scheduled_date_time}T${values.scheduled_time}:00`
      );
      const isoString = scheduledDateTime.toISOString();
      values.scheduled_date_time = isoString;
      delete values.scheduled_time;
      delete values.scheduled_date;
    }

    const temp_report_frequency = 'onetime';

    const request_object = {
      ...values,
      report_frequency: temp_report_frequency,
      report_template,
    };

    try {
      if (isScheduling) {
        await createPeriodicDataExportRequest(request_object).unwrap();
        toast.success('Successfully scheduled report!');
      } else {
        await createDataExportRequest(request_object).unwrap();
        toast.success(
          'Created a report request, find it in the generated reports!'
        );
      }
    } catch (error) {
      return;
    }
    setSelectedTemplate(null);
    reset();
    onClose();
  };

  const onCloseInternal = () => {
    onClose();
    reset();
    setSelectedTemplate(null);
  };

  return (
    <CustomTortoiseDrawer
      isDrawerOpen={isDrawerOpen}
      hasNavigationControls={false}
      title={isScheduling ? 'Schedule Report' : 'Generate report'}
      onClose={onCloseInternal}
      footer={
        <div className='flex flex-col p-2 pt-1'>
          <Button
            // type='primary'
            onClick={handleSubmit(onSubmit, (errors, values) =>
              console.log(errors, values)
            )}
            type='submit'
            className='w-full border-1 border-green-9 bg-green-6 text-white'
            isLoading={
              isCreateDataExportRequestLoading ||
              isCreatePeriodicDataExportRequestLoading
            }
          >
            {isScheduling ? 'Schedule report' : 'Generate report'}
          </Button>
        </div>
      }
    >
      <CustomTortoiseDrawerBody>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='py-4 flex flex-col gap-6'>
            <div className='flex flex-col'>
              <div className='text-base font-semibold'>Select Template</div>
              <div className='text-xs text-black-5'>
                Select one of the templates from the list below
              </div>
            </div>
            <Controller
              name='selectedTemplate'
              control={control}
              rules={{ required: 'Please select a template!' }}
              render={({ field }) => (
                <ReportTemplateSelector
                  value={selectedTemplate?.id || null}
                  onChange={field.onChange}
                  setSelectedTemplate={setSelectedTemplate}
                />
              )}
            />
            <div className='flex flex-col gap-4'>
              {selectedTemplate && (
                <>
                  <div className='flex flex-col'>
                    <div className='text-base font-semibold'>
                      Report details
                    </div>
                    <div className='text-xs text-black-5'>
                      Add report name and select the duration for the report
                    </div>
                  </div>
                  <Controller
                    name='report_name'
                    control={control}
                    rules={{ required: 'Please enter the report name!' }}
                    render={({ field, fieldState: { error } }) => (
                      <Input
                        {...field}
                        errorMessage={error?.message}
                        isInvalid={!!error}
                        placeholder='Report name'
                      />
                    )}
                  />
                  {isScheduling ? (
                    <ScheduleAndRecurringFormWrapper
                      template={selectedTemplate}
                      control={control}
                    />
                  ) : (
                    <GenerateReportForm
                      template={selectedTemplate}
                      control={control}
                      isScheduling={false}
                    />
                  )}
                </>
              )}
            </div>
          </div>
        </form>
      </CustomTortoiseDrawerBody>
    </CustomTortoiseDrawer>
  );
}
