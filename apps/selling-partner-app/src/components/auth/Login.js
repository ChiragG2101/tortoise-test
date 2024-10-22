/* eslint-disable @next/next/no-img-element */
'use client';

import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Button, Card, Divider, Input } from '@nextui-org/react';
import { useCallback, useState } from 'react';
import { Eye, EyeSlash } from '@phosphor-icons/react';
import { useLoginMutation } from '@/features/auth/api';
import { useDispatch } from 'react-redux';
import { setUser } from '@/features/auth/slice';
import { useRouter } from 'next/navigation';

const schema = yup.object().shape({
  email: yup
    .string()
    .email('Invalid email format')
    .required('Email is required'),
  member_type: yup.string().required('Member type is required'),
});

const defaultValues = {
  email: '',
  password: '',
  member_type: 'supplier',
};

export default function Login() {
  const dispatch = useDispatch();
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = useCallback(
    () => setIsVisible(!isVisible),
    [isVisible]
  );

  const [login, { isLoading: isLoginLoading }] = useLoginMutation();

  const onSubmit = useCallback(
    async (data) => {
      try {
        const response = await login(data).unwrap();
        dispatch(setUser(response));
        router.push('/orders');
      } catch (err) {
        console.error('Login failed:', err);
      }
    },
    [login, dispatch, router]
  );

  return (
    <div className='w-full flex items-center justify-center min-h-screen'>
      <div className='bg-white border border-b-2 border-black-4 py-10 w-11/12 sm:w-3/5 md:w-1/2 lg:w-1/3 h-fit rounded-lg flex flex-col items-center gap-4'>
        <img
          src='/assets/seller-dashboard-logo.svg'
          alt='tortoise'
          className='self-start px-4 md:px-6'
        />
        <Divider />
        <form
          onSubmit={handleSubmit(onSubmit)}
          className='w-full flex flex-col gap-4 px-5 md:px-10'
        >
          <div className='body-small font-semibold self-start'>
            Login to Tortoise seller dashboard
          </div>
          <Controller
            name='email'
            control={control}
            defaultValue=''
            render={({ field }) => (
              <Input
                {...field}
                type='email'
                label='Email'
                variant='bordered'
                isInvalid={errors.email}
                error={errors.email?.message}
              />
            )}
          />
          <Controller
            name='password'
            control={control}
            defaultValue=''
            render={({ field }) => (
              <Input
                {...field}
                label='Password'
                variant='bordered'
                className='w-full'
                isInvalid={errors.password}
                error={errors.password?.message}
                endContent={
                  <button
                    className='focus:outline-none'
                    type='button'
                    onClick={toggleVisibility}
                  >
                    {isVisible ? (
                      <Eye
                        size={30}
                        className='text-2xl text-default-400 pointer-events-none'
                      />
                    ) : (
                      <EyeSlash
                        size={30}
                        className='text-2xl text-default-400 pointer-events-none'
                      />
                    )}
                  </button>
                }
                type={isVisible ? 'text' : 'password'}
              />
            )}
          />
          <Button
            type='submit'
            className='w-full btn-primary'
            isLoading={isLoginLoading}
          >
            Login
          </Button>
        </form>
      </div>
    </div>
  );
}
