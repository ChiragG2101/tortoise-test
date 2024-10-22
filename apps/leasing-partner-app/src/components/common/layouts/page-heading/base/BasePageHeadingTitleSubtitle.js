import React from 'react';

export default function BasePageHeadingTitleSubtitle({ title, subtitle }) {
  if (subtitle) {
    return (
      <div className='flex flex-col'>
        <div className='flex gap-1 items-center text-xs font-light text-black-5 leading-tight'>
          {subtitle}
        </div>
        <div className='flex gap-1 items-center font-medium text-sm text-black-9 leading-tight'>
          {title}
        </div>
      </div>
    );
  }
  return <div className='font-semibold body-xlarge'>{title}</div>;
}
