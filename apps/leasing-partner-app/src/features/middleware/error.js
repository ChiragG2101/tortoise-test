import { isRejectedWithValue } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

export const rtkQueryErrorLogger = (api) => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    console.warn('We got a rejected action!', action);
    if (action.meta?.baseQueryMeta?.request?.method !== 'GET') {
      if (action.payload?.data?.errors?.detail) {
        toast.error(action.payload?.data?.errors?.detail);
      } else if (action.payload?.data?.errors) {
        toast.error(action.payload?.data?.errors);
      }
    }
  }
  return next(action);
};
