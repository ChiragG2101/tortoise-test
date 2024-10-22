import React from 'react';
import { User, Divider } from '@nextui-org/react';
import { format } from 'date-fns';

const OrganizationCell = (props) => {
  const { title, logo } = props;

  return (
    <User
      name={title}
      avatarProps={{
        src: logo,
        radius: 'md',
      }}
    />
  );
};

const SignedCell = (props) => {
  const { title, date, userName, logo } = props;

  return (
    <div className='flex align-center'>
      <Divider orientation='vertical' className='me-4' />
      <div className='flex gap-2 align-center'>
        <div>{logo}</div>
        <div>
          <p className='text-sm text-black-5'>{title}</p>
          <p>
            <span className='text-sm'>
              {format(new Date(date), 'do MMMM yyyy')}
            </span>{' '}
            <span className='text-xs text-black-5'>by {userName}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

const DefaultCell = (props) => {
  const { title, data } = props;
  return (
    <div className='flex'>
      <Divider orientation='vertical' className='me-4' />
      <div>
        <p className='text-black-5 text-sm'>{title}</p>
        <p className='text-sm'>{data || '-'}</p>
      </div>
    </div>
  );
};

const RentalScheduleCell = (props) => {
  const { statistics } = props;
  const { title, logo, data, name } = statistics;

  if (name === 'organization') {
    return <OrganizationCell {...statistics} />;
  }

  if (name === 'approved_on') {
    const { done_at: doneAt, full_name: fullName } = data.lesser_approver;
    const approvedData = { title, date: doneAt, logo, userName: fullName };
    return <SignedCell {...approvedData} />;
  }

  if (name === 'signed_on') {
    const { done_at: doneAt, full_name: fullName } = data.signed_by;
    const signedData = { title, date: doneAt, logo, userName: fullName };
    return <SignedCell {...signedData} />;
  }

  return <DefaultCell {...statistics} />;
};

export default RentalScheduleCell;
