import { useState, useEffect, useCallback } from 'react';
import {
  Button,
  Input,
  Radio,
  RadioGroup,
  Select,
  SelectItem,
} from '@nextui-org/react';
import { Controller } from 'react-hook-form';

const TemplateFilter = ({ filter, control }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { items, hasMore, isLoading, onLoadMore } = useRentalScheduleList({
    fetchDelay: 1500,
  });

  return (
    <div className='flex flex-col gap-1'>
      <div className='text-sm'>{filter.display_name}</div>
      <Controller
        name={`filters.${filter.interface_key}`}
        control={control}
        rules={{ required: `Please select the ${filter.display_name}` }}
        render={({ field, fieldState: { error } }) => (
          <Input
            {...field}
            errorMessage={error?.message}
            isInvalid={!!error}
            type='date'
            className='w-full'
          />
        )}
      />
    </div>
  );
};

export default TemplateFilter;
