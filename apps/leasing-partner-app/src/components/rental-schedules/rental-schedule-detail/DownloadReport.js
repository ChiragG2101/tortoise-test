import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { Button } from '@nextui-org/react';
import {
  useCreateDataExportRequestMutation,
  useGetDataExportByIdQuery,
} from '@/features/rental-schedule/api';

const DownloadReport = ({ templateData, consolidatedRentalScheduleId }) => {
  const [reportId, setReportId] = useState(null);
  const [isPolling, setIsPolling] = useState(false);

  const [createDataExportRequest] = useCreateDataExportRequestMutation();

  const { data: exportedData, error: exportedDataError } =
    useGetDataExportByIdQuery(
      { id: reportId },
      {
        skip: !reportId || !isPolling,
        pollingInterval: 1000,
        skipPollingIfUnfocused: true,
      }
    );

  const downloadReport = (url) => {
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'report.pdf');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    if (isPolling) {
      const timer = setTimeout(() => {
        setIsPolling(false); // Stop polling after 10 seconds
      }, 10000);

      return () => clearTimeout(timer); // Cleanup on unmount or when isPolling changes
    }
  }, [isPolling]);

  useEffect(() => {
    if (exportedData?.status === 'completed') {
      downloadReport(exportedData?.file);
      setIsPolling(false);
      toast.success('Report downloaded successfully');
    } else if (exportedData?.status === 'failed') {
      setIsPolling(false);
      toast.error(
        exportedDataError?.data?.errors?.detail ?? 'Something went wrong...!'
      );
    }
  }, [exportedData]);

  const handleDownloadReport = async () => {
    try {
      const reportPayload = {
        report_template: templateData?.id,
        report_name: templateData?.display_name,
        filters: {
          consolidated_rental_schedule_id: consolidatedRentalScheduleId,
        },
      };
      const report = await createDataExportRequest({
        data: reportPayload,
      }).unwrap();
      setReportId(report?.id);
      setIsPolling(true);
    } catch (error) {
      toast.error(error?.message);
      console.error(error);
    }
  };

  return (
    <>
      <Button
        variant='solid'
        size='sm'
        className='bg-primary-main text-white border border-primary-dark'
        onClick={handleDownloadReport}
        spinnerPlacement='end'
        isLoading={isPolling}
      >
        Download Report
      </Button>
    </>
  );
};

DownloadReport.propTypes = {
  templateData: PropTypes.object,
  consolidatedRentalScheduleId: PropTypes.string,
};

export default DownloadReport;
