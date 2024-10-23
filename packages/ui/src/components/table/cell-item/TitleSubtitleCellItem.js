import { User } from '@nextui-org/react';
import React from 'react';

export default function TitleSubtitleItem({ title, subtitle }) {
  return (
    <div className='flex flex-col'>
      <p>{title}</p>
      <p className='text-xs text-black-5'>{subtitle}</p>
    </div>
  );
}
