import { CalendarDots, Money, Package, User } from '@phosphor-icons/react';
import { format } from 'date-fns';

const activityMapping = Object.freeze({
  order_placed: {
    title: 'Ordered from',
    icon: <Package size={28} weight='fill' className='text-purple-6' />,
    description: (details) => `${details.supplier_name}`,
  },
  asset_assigned: {
    title: 'Assigned to',
    icon: <User size={28} weight='fill' className='text-yellow-7' />,
    description: (details) => `${details.user_email}`,
  },
  tenure_completed: {
    title: 'Tenure completed',
    icon: <CalendarDots size={28} weight='fill' className='text-green-7' />,
    description: () => '',
  },
  asset_sold: {
    title: 'Sold to',
    icon: <Money size={28} weight='fill' className='text-green-8' />,
    description: (details) => `${details.buyer_name}`,
  },
});

export default function History({ history }) {
  return (
    <div className='flex flex-col border border-b-2 border-black-3 rounded-lg py-4'>
      {history?.map((event, index) => {
        const { title, icon, description } = activityMapping[event.activity];
        return (
          <div key={event.id} className='flex flex-col items-center'>
            <div className='flex flex-col items-center gap-1'>
              <div>{icon}</div>
              <div className='flex flex-col items-center'>
                <p className='text-black-8 font-semibold text-base'>{title}</p>
                <p className='text-black-6 text-sm'>
                  {description(event.details)}
                </p>
                <p className='text-black-5 text-sm'>
                  {format(new Date(event.created_at), 'do MMM yyyy')}
                </p>
              </div>
            </div>
            {index !== history.length - 1 && (
              <div className='w-px h-5 bg-black-4 my-3'></div>
            )}
          </div>
        );
      })}
    </div>
  );
}
