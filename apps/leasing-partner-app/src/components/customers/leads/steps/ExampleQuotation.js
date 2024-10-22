/* eslint-disable @next/next/no-img-element */
import { Divider } from '@nextui-org/react';

const financialData = [
  { label: 'MRP', value: '₹ 79,900' },
  { label: 'MOP', value: '₹ 76,704' },
  { label: 'Price for a unit', value: '₹ 65,003' },
  { label: 'Applicable taxes', value: '₹ 11,701' },
  { label: 'PTPQ', value: '₹ 266.80' },
  { label: 'Quarterly rent (Paid in advance)', value: '₹ 17,343' },
  { label: 'GST on rentals', value: '₹ 3,122' },
  { label: 'Total quarterly rental (inclusive of GST)', value: '₹ 17,343' },
  { label: 'Total payment in lease term by employee', value: '₹ 69,372' },
  { label: 'Total payment in lease term by employer', value: '₹ 81,859' },
  { label: 'Refundable deposit', value: 'Nil' },
  { label: 'Processing Fees', value: 'Nil' },
  { label: 'PV benefit on total rental paid', value: '- ₹ 4,871' },
  { label: 'Income tax shelter', value: '- ₹ 19,573' },
  { label: 'GST credit available on rent paid', value: '- ₹ 11,744' },
  { label: 'Buyback value @2% (At the end of lease term)', value: '+ ₹ 1,534' },
  { label: 'PV benefit on buyback value', value: '- ₹ 139' },
  { label: 'Net effective price per device', value: '₹ 47,065' },
  { label: 'Net effective price per device (as a % of MRP)', value: '58.91%' },
  { label: 'Savings availed by employee', value: '41.09%' },
];

const FinancialDataComponent = ({ data }) => {
  return (
    <div key={data.label} className='flex justify-between'>
      <div className='text-darkGrey text-xs'>{data.label}</div>
      <div className='font-semibold text-xs'>{data.value}</div>
    </div>
  );
};

export default function ExampleQuotation() {
  return (
    <div className='border-l-1 px-5'>
      <div className='bg-grey px-6 py-4 flex flex-col gap-5'>
        <div>
          <div className='font-semibold body-small'>Example quotation</div>
          <div className='text-darkGrey body-xsmall'>
            The values below are represented for a single device, the{' '}
            <span className='text-black'>iPhone 15</span>, while the rest can be
            configured from the left hand side
          </div>
        </div>
        <Divider />
        <div className='flex gap-2'>
          <img src='/assets/iphone15.svg' alt='iphone 15' />
          <div>
            <div className='font-medium body-xsmall'>iPhone 15</div>
            <div className='text-darkGrey text-xs'>128 GB • Black</div>
          </div>
        </div>
        <div className='bg-white p-4 border rounded-xl flex items-center justify-between'>
          <div>
            <div className='text-xs text-darkGrey'>Payment Frequency</div>
            <div className='font-semibold text-sm'>Quarterly Advance</div>
          </div>
          <div>
            <div className='text-xs text-darkGrey'>Lease Type</div>
            <div className='font-semibold text-sm'>Smart EPP</div>
          </div>
          <div>
            <div className='text-xs text-darkGrey'>Tenure</div>
            <div className='font-semibold text-sm'>12 months</div>
          </div>
        </div>
        <div className='flex flex-col gap-4'>
          <div className='flex flex-col gap-2'>
            {financialData.slice(0, 8).map((data) => (
              <FinancialDataComponent key={data.label} data={data} />
            ))}
          </div>
          <Divider />
          <div className='flex flex-col gap-2'>
            {financialData.slice(8, 10).map((data) => (
              <FinancialDataComponent key={data.label} data={data} />
            ))}
          </div>
          <Divider />
          <div className='flex flex-col gap-2'>
            {financialData.slice(10, 12).map((data) => (
              <FinancialDataComponent key={data.label} data={data} />
            ))}
          </div>
          <Divider />
          <div className='flex flex-col gap-2'>
            {financialData.slice(12).map((data) => (
              <FinancialDataComponent key={data.label} data={data} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
