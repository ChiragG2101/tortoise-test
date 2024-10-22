import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import RentalSchedule from './RentalSchedule';
import Transactions from './Transactions';
import MonthYearSelect from '@/components/common/MonthYearSelect';
import { useGetRentalSchedulesQuery } from '@/features/rental-schedule/api';

const SecurityDeposits = ({ title, selectedOrganization }) => {
  const [monthYear, setMonthYear] = useState(null);

  const { data: rentalSchedulesList, isLoading } = useGetRentalSchedulesQuery(
    {
      filters: {
        commencement_month: monthYear?.month,
        commencement_year: monthYear?.year,
        organization_id: selectedOrganization?.organization?.id,
      },
    },
    {
      skip: !monthYear, // Skip the API call if month & year is not selected
    }
  );

  const rentalScheduleId = useMemo(
    () =>
      rentalSchedulesList?.results?.find(
        (item) => item.is_security_deposit_required
      )?.id,
    [rentalSchedulesList]
  );

  return (
    <div className='flex flex-col gap-5 px-5'>
      <div className='flex items-center justify-between'>
        <div className='text-base font-semibold leading-tight'>{title}</div>
        <MonthYearSelect setMonthYear={setMonthYear} />
      </div>

      <div className='flex pb-5 gap-5'>
        <RentalSchedule rentalScheduleId={rentalScheduleId} />

        <Transactions rentalScheduleId={rentalScheduleId} />
      </div>

      <div className=' mb-5 border-b-2'></div>
    </div>
  );
};

SecurityDeposits.propTypes = {
  title: PropTypes.string,
  selectedOrganization: PropTypes.object,
};

export default SecurityDeposits;
