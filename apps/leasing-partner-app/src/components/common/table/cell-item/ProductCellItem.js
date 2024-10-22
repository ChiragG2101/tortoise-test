import { User } from '@nextui-org/react';
import React from 'react';

export default function ProductCellItem({ products, subtitle }) {
  return (
    <User
      name={products[0]?.short_name ?? products[0]?.name}
      description={
        subtitle
          ? subtitle
          : products?.length === 1
            ? 'No add-ons'
            : `+${products?.length - 1} add-ons`
      }
      avatarProps={{
        src: products?.[0]?.image_url,
        radius: 'md',
        className: 'p-0.5 bg-black-2',
      }}
    />
  );
}
