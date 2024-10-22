'use client';

import CustomTortoiseDrawer, {
  CustomTortoiseDrawerBody,
} from '@/components/common/Drawer';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Input, Textarea } from '@nextui-org/react';
import { useCallback, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import Dropzone from '@/components/common/Dropzone';
import { useCreatePricingChannelMutation } from '@/features/pricing-channel/api';
import DropzonePreview from '@/components/common/DropzonePreview';

export const validationSchema = yup.object().shape({
  name: yup.string().required('Pricing channel name is required'),
  channelDescription: yup.string().optional(),
  enabledFor: yup
    .array()
    .of(yup.string())
    .min(1, 'At least one customer must be enabled')
    .optional(),
});

export default function PricingChannelsDrawer({ isOpen, onClose }) {
  const [file, setFile] = useState(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const [createPricingChannel, { isLoading: isCreating }] =
    useCreatePricingChannelMutation();

  const onSubmit = useCallback(
    async (data) => {
      if (!file) return;
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        formData.append(key, data[key]);
      });
      formData.append('csv_file', file);
      try {
        await createPricingChannel(formData).unwrap();
        onClose();
      } catch (error) {
        console.error('Failed to create pricing channel:', error);
      }
    },
    [createPricingChannel, file, onClose]
  );

  return (
    <CustomTortoiseDrawer
      isOpen={isOpen}
      onClose={onClose}
      title={'Create pricing channel'}
      footer={
        <Button
          className='w-full btn-primary'
          onClick={handleSubmit(onSubmit)}
          isLoading={isCreating}
        >
          Create pricing channel
        </Button>
      }
    >
      <CustomTortoiseDrawerBody>
        <div className='flex flex-col gap-5'>
          <div>
            <div className='font-semibold text-sm text-black-9'>
              Pricing channel details
            </div>
            <div className='text-xs text-black-7'>
              Add the following details to create a pricing channel
            </div>
            <form className='flex flex-col gap-5 mt-2'>
              <Controller
                name='name'
                control={control}
                defaultValue=''
                render={({ field }) => (
                  <Input
                    {...field}
                    variant='bordered'
                    label='Pricing channel name'
                    isInvalid={!!errors.name}
                    errorMessage={errors.name?.message}
                  />
                )}
              />
              <Controller
                name='channelDescription'
                control={control}
                defaultValue=''
                render={({ field }) => (
                  <Textarea
                    {...field}
                    variant='bordered'
                    label='Channel description (optional)'
                    placeholder='Add your description here'
                    isInvalid={!!errors.channelDescription}
                    errorMessage={errors.channelDescription?.message}
                  />
                )}
              />
            </form>
          </div>
          <div>
            <div className='flex items-center justify-between text-sm'>
              <p className='font-semibold'>Updated pricing list</p>
              <p
                className='text-green-8 cursor-pointer'
                onClick={() => setFile(null)}
              >
                Reset
              </p>
            </div>
            <div className='mt-2 border border-b-2 rounded-lg border-black-3 p-4'>
              <Dropzone
                title='Upload CSV'
                subtitle='Please upload the updated pricing for existing Product IDs'
                onDrop={(acceptedFiles) => {
                  setFile(acceptedFiles[0]);
                }}
                acceptedFormats={{
                  'text/csv': ['.csv'],
                }}
              />
              {file && (
                <div className='my-4'>
                  <DropzonePreview file={file} />
                </div>
              )}
            </div>
          </div>
        </div>
      </CustomTortoiseDrawerBody>
    </CustomTortoiseDrawer>
  );
}
