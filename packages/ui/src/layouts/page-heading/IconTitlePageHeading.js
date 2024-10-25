'use client';
import React from 'react';
import {
  BasePageHeading,
  BasePageHeadingIcon,
  BasePageHeadingTitleSubtitle,
} from './base';

export default function IconTitlePageHeading({
  title,
  Icon,
  iconProps,
  rightSlot,
}) {
  return (
    <BasePageHeading
      leftSlot={
        <div className='flex items-center gap-2'>
          <BasePageHeadingIcon Icon={Icon} iconProps={iconProps} />
          <BasePageHeadingTitleSubtitle title={title} />
        </div>
      }
      rightSlot={rightSlot}
    />
  );
}
