import { useState, useEffect, useCallback } from 'react';
import {
  Button,
  Input,
  Radio,
  RadioGroup,
  Select,
  SelectItem,
} from '@nextui-org/react';
import { useInfiniteScroll } from '@nextui-org/use-infinite-scroll';
import { Controller } from 'react-hook-form';
import { useGetRentalSchedulesQuery } from '@/features/rental-schedule/api';

export function useRentalScheduleList({ fetchDelay = 0 } = {}) {
  const [items, setItems] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const limit = 10; // Number of items per page, adjust as necessary

  const { data: rentalSchedulesList, isLoading } = useGetRentalSchedulesQuery({
    page,
    page_size: limit,
  });

  const loadData = useCallback(() => {
    if (!rentalSchedulesList) return;

    setItems((prev) => [...prev, ...rentalSchedulesList?.results]);
    setHasMore(page > 0 && !(page > rentalSchedulesList.count / limit));
  }, [rentalSchedulesList, page]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onLoadMore = () => {
    setPage((prev) => prev + 1);
    loadData();
  };

  return {
    items,
    hasMore,
    isLoading,
    onLoadMore,
  };
}

const TemplateFilter = ({ filter, control }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { items, hasMore, isLoading, onLoadMore } = useRentalScheduleList({
    fetchDelay: 1500,
  });

  const [, scrollerRef] = useInfiniteScroll({
    hasMore,
    isEnabled: isOpen,
    shouldUseLoader: false,
    onLoadMore,
  });

  if (filter.interface_key === 'consolidated_rental_schedule_id') {
    return (
      <div className='flex flex-col gap-1'>
        <div className='text-sm'>{filter.display_name}</div>
        <Controller
          name={`filters.${filter.interface_key}`}
          control={control}
          rules={{ required: `Please select the ${filter.display_name}` }}
          render={({ field, fieldState: { error } }) => (
            <Select
              // className='max-w-xs'
              {...field}
              isLoading={isLoading}
              items={items}
              label='Select Rental Schedule'
              placeholder='Select a Rental Schedule'
              scrollRef={scrollerRef}
              selectionMode='single'
              onOpenChange={(open) => {
                open !== isOpen && setIsOpen(open);
              }}
              isOpen={isOpen}
              errorMessage={error?.message}
              isInvalid={!!error}
              value={field.value ? parseInt(field.value) : null}
              onChange={(e) => {
                field.onChange(parseInt(e.target.value));
              }}
            >
              {(item) => (
                <SelectItem
                  key={item.id}
                  className='capitalize'
                  value={item.id}
                  textValue={item.organization.name}
                >
                  <div className=' flex gap-1 justify-between items-center'>
                    <div className='space-y-1 basis-3/5 overflow-hidden'>
                      <p>{item.organization.name}</p>
                      <p className={'text-xs opacity-60'}>
                        {item.commencement_date}
                      </p>
                    </div>
                    <p className='text-xs'>{item.state_name}</p>
                  </div>
                </SelectItem>
              )}
            </Select>
          )}
        />
      </div>
    );
  }
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
