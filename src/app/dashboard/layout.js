"use client";

import DashboardHeader from '@/components/dashboard/DashboardHeader';

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}