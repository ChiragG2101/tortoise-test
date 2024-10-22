import { Card, CardHeader, CardBody, Avatar, Divider } from '@nextui-org/react';

export default function VendorCard({ info }) {
  return (
    <Card className='px-4 py-2'>
      <CardHeader className='flex justify-between'>
        <div className='flex gap-2 items-center'>
          <Avatar src={info.logo} />
          <div className='body-small'>{info.supplier_name}</div>
        </div>
      </CardHeader>
      <Divider />
      <CardBody>
        <div className='flex items-center justify-between py-2'>
          <div className='flex flex-col'>
            <div className='text-darkGrey text-xs'>Total orders placed</div>
            <div className='font-semibold text-sm'>{info.orders}</div>
          </div>
          <div>
            <div className='text-darkGrey text-xs'>
              Total amount paid till date
            </div>
            <div className='font-semibold text-sm'>₹ {info.paid_amount}</div>
          </div>
          <div>
            <div className='text-darkGrey text-xs'>Upcoming payment</div>
            <div className='font-semibold text-sm'>
              ₹ {info.upcoming_amount}
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
