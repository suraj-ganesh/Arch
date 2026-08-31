'use client';

import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { ToastProvider } from './ToastProvider';

export default function ClientShell({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <Navbar />
      {children}
      <Footer />
    </ToastProvider>
  );
}
