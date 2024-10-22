import { openViewDocumentDrawer } from '@/features/rental-schedule/slice';
import { Button } from '@nextui-org/react';
import { useDispatch } from 'react-redux';

export default function ViewRentalScheduleButton({ rentalSchedule }) {
  const dispatch = useDispatch();
  const handleButtonClick = () => {
    dispatch(openViewDocumentDrawer());
  };

  return (
    <>
      <Button
        variant='solid'
        size='sm'
        className='bg-primary-main text-white border border-primary-dark'
        onClick={handleButtonClick}
      >
        View Rental Schedule
      </Button>
    </>
  );
}
