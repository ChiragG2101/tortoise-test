import { User } from '@nextui-org/react';
import React from 'react';

export default function OrganizationCellItem({ name, logo }) {
  return (
    <User
      name={name}
      avatarProps={{
        src: logo,
        radius: 'md',
        className: 'p-0.5 bg-black-2',
        imgProps: {
          className: 'object-fill',
        },
      }}
    />
  );
}
