import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { AppShell } from './navigation/AppShell';
import { AppStoreProvider } from '../store/AppStore';

export const App = () => {
  return (
    <AppStoreProvider>
      <AppShell />
      <StatusBar style="dark" />
    </AppStoreProvider>
  );
};
