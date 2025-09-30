'use client';

import { Provider } from 'react-redux';
import { store } from '@/store';
import Layout from '@/components/layout/Layout';

export default function Home() {
  return (
    <Provider store={store}>
      <Layout />
    </Provider>
  );
}
