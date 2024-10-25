import {
  CustomTortoiseDrawer,
  CustomTortoiseDrawerBody,
} from '@repo/ui/components';
import { BottomLine } from '@/components/stamp-papers/TopBanner';
import { Button, Divider, Input } from '@nextui-org/react';
import { useCallback, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useStampsRequestMutation } from '@/features/stamps/api';
import Info from '@/components/common/Info';
import { toast } from 'react-toastify';

const schema = yup.object().shape({
  state: yup.string(),
  seriesNumber: yup.string(),
  quantity: yup
    .number()
    .typeError('Quantity must be a number')
    .required('Quantity is required')
    .positive('Quantity must be positive')
    .integer('Quantity must be an integer'),
  denomination: yup
    .number()
    .positive('Denomination must be positive')
    .integer('Denomination must be an integer'),
});

export default function StampsDrawer({
  isDrawerOpen,
  title,
  onClose,
  selectedRowData,
}) {
  const defaultValues = useMemo(
    () => ({
      state: selectedRowData?.state,
      seriesNumber: selectedRowData?.seriesNumber,
      denomination: selectedRowData?.denomination,
    }),
    [selectedRowData]
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const stampPapersInfo = useMemo(
    () => [
      { label: 'State', value: selectedRowData?.state },
      { label: 'Denomination', value: selectedRowData?.denomination },
      { label: 'Utilised stamp papers', value: selectedRowData?.used },
      { label: 'Remaining stamp papers', value: selectedRowData?.unused },
    ],
    [selectedRowData]
  );

  const [stampRequest, { isLoading: isStampsRequestLoading, reset }] =
    useStampsRequestMutation();

  const onSubmit = useCallback(
    async (data) => {
      try {
        await stampRequest(data).unwrap();
        reset();
        onClose();
        toast.success('Request has been raised');
      } catch (error) {
        console.error('Failed to request:', error);
      }
    },
    [stampRequest, reset, onClose]
  );

  return (
    <CustomTortoiseDrawer
      isDrawerOpen={isDrawerOpen}
      onClose={() => {
        onClose();
        reset();
      }}
      title={title}
      footer={
        <Button
          className='w-full bg-primary-main text-white border border-primary-dark'
          isLoading={isStampsRequestLoading}
          onClick={() => handleSubmit(onSubmit)()}
        >
          Raise a request
        </Button>
      }
    >
      <CustomTortoiseDrawerBody>
        <div className='border rounded-xl p-4 flex flex-col items-center gap-4'>
          <div className='w-full flex items-center justify-between'>
            <div className='flex flex-col justify-between gap-4'>
              {stampPapersInfo.slice(0, 2).map((info) => (
                <Info key={info.label} {...info} />
              ))}
            </div>
            <div className='flex flex-col justify-between gap-4 pr-9'>
              {stampPapersInfo.slice(2).map((info) => (
                <Info key={info.label} {...info} />
              ))}
            </div>
          </div>
          <Divider />
          <div className='w-full flex justify-between gap-2'>
            <Controller
              name='quantity'
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label='Stamp papers required'
                  type='number'
                  placeholder='0'
                  className='w-1/2'
                  variant='bordered'
                  isInvalid={!!errors?.[field.name]}
                  errorMessage={errors?.[field.name]?.message}
                />
              )}
            />
            {/* <Info label={'Updated quantity after addition'} value={1790} /> */}
          </div>
          <BottomLine />
        </div>
      </CustomTortoiseDrawerBody>
    </CustomTortoiseDrawer>
  );
}
