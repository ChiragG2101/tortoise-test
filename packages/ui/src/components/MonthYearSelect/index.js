import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  startOfMonth,
  format,
  addMonths,
  subMonths,
  isAfter,
  parse,
  getMonth,
  getYear,
} from 'date-fns';
import { Select, SelectItem } from '@nextui-org/react';

const MonthYearSelect = ({ setMonthYear }) => {
  const [currentPeriod, setCurrentPeriod] = useState(startOfMonth(new Date()));
  const [periodOptions, setPeriodOptions] = useState([]);

  useEffect(() => {
    const [start_month, start_year] = format(currentPeriod, 'M yyyy').split(
      ' '
    );
    setMonthYear({ month: start_month, year: start_year });

    let currentDate = addMonths(startOfMonth(new Date()), 2); // Start 2 months from now
    const pastDate = subMonths(startOfMonth(new Date()), 12); // Go back to 1 year ago
    const periods = [];

    while (
      isAfter(currentDate, pastDate) ||
      currentDate.getTime() === pastDate.getTime()
    ) {
      periods.push(format(currentDate, 'MMM yyyy'));
      currentDate = subMonths(currentDate, 1);
    }

    setPeriodOptions(periods);
  }, []);

  const handlePeriodChange = (e) => {
    if (e.target.value) {
      const date = parse(e.target.value, 'MMM yyyy', new Date());
      setMonthYear({ month: getMonth(date) + 1, year: getYear(date) });
      setCurrentPeriod(date);
    } else {
      setMonthYear(null);
      setCurrentPeriod(null);
    }
  };

  return (
    <div className='flex gap-2'>
      <Select
        defaultSelectedKeys={
          currentPeriod && new Set([format(currentPeriod, 'MMM yyyy')])
        }
        size='sm'
        style={{
          width: '150px',
          border: '2px solid #E1E1E1',
          borderRadius: '8px',
        }}
        aria-label='Month & Year'
        placeholder='Select month & year'
        onChange={handlePeriodChange}
      >
        {periodOptions.map((period) => (
          <SelectItem key={period} value={period}>
            {period}
          </SelectItem>
        ))}
      </Select>
    </div>
  );
};

MonthYearSelect.PropTypes = {
  setMonthYear: PropTypes.func,
};

export default MonthYearSelect;
