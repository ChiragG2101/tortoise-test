import React from 'react';

export default function BasePageHeadingIcon({ Icon, iconProps }) {
  return (
    Icon && (
      <Icon
        size={32}
        weight='duotone'
        className='text-primary-dark'
        {...iconProps}
      />
    )
  );
}
