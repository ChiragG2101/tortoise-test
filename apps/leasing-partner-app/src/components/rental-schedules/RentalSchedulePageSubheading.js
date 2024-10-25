import { TitleSubtitlePageSubheading } from '@repo/ui/components';
import { RENTAL_SCHEDULE_STATUS } from '@/features/rental-schedule/constants';

export default function RentalSchedulePageSubheading({ status }) {
  const data = Object.freeze({
    [RENTAL_SCHEDULE_STATUS.PROVISIONAL]: {
      title: 'Provisional rental schedules',
      subtitle:
        'This gives you visibility on the devices in the rental schedule until the commencement date. The schedules will automatically move to For Review on that date.',
    },
    [RENTAL_SCHEDULE_STATUS.READY_FOR_SIGNING]: {
      title: 'Customer signature pending on these rental schedules',
      subtitle:
        'These rental schedules have been share with the customers and are yet to be signed by them. Once they are signed you can find them on Confirmed',
    },
    [RENTAL_SCHEDULE_STATUS.CONFIRMED]: {
      title:
        'The following rental schedules have been signed by your customers',
      subtitle: 'Keep track of devices and rental payments',
    },
  });
  return (
    data?.[status]?.title && (
      <TitleSubtitlePageSubheading
        title={data?.[status]?.title}
        subtitle={data?.[status]?.subtitle}
      />
    )
  );
}
