import React from 'react';
import PropTypes from 'prop-types';
import SecurityDepositsTable from '@/components/rental-schedules/rental-schedule-detail/SecurityDeposits';

const Transactions = ({ rentalScheduleId }) => {
  return (
    <div className='border-2 rounded-lg p-5 w-9/12'>
      <p className='text-sm font-semibold pb-3'>Transactions</p>
      {rentalScheduleId ? (
        <SecurityDepositsTable
          rentalScheduleId={rentalScheduleId}
          pageSize={5}
        />
      ) : (
        <div className=' p-5 flex items-center justify-center'>
          <p>Transactions Not Found</p>
        </div>
      )}
    </div>
  );
};

Transactions.PropTypes = {
  rentalScheduleId: PropTypes.string,
};

export default Transactions;
