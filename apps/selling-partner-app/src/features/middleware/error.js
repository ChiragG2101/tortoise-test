import { isRejectedWithValue } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

export const rtkQueryErrorLogger = (api) => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    console.warn('We got a rejected action!', action);
    toast.error(action.payload?.data?.errors?.detail || 'Something went wrong');
  }
  return next(action);
};
