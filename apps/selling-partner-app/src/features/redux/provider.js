'use client';

import { store } from '@/store/store';
import { Provider } from 'react-redux';

export function ReduxProviders({ children }) {
  return <Provider store={store}>{children}</Provider>;
}
