import React from 'react';
import AppLayout from '@/components/AppLayout';
import AccountSettingsPage from './components/AccountSettingsPage';

export default function Page() {
  return (
    <AppLayout>
      <AccountSettingsPage />
    </AppLayout>
  );
}
