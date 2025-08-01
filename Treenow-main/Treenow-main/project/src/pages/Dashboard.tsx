import React from 'react';
import DashboardStats from '../components/DashboardStats';
import Orders from '../components/order';

export default function Dashboard() {
  return (
    <div className="p-6">
      <DashboardStats />
      <Orders />
    </div>
  );
}