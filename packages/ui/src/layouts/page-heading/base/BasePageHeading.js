'use client';

import React from 'react';

export default function BasePageHeading({ leftSlot, rightSlot }) {
  return (
    <div className='px-5 pb-5 border-b-1 flex items-center justify-between'>
      {leftSlot}
      {rightSlot}
    </div>
  );
}
