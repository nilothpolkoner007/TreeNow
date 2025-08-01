import React from 'react';
import { DollarSign, Package, ShoppingCart, Users } from 'lucide-react';

const stats = [
  {
    title: 'Total Sales',
    value: '$24,567',
    change: '+12%',
    icon: DollarSign,
    color: 'bg-blue-500',
  },
  {
    title: 'Pending Orders',
    value: '45',
    change: '+5%',
    icon: ShoppingCart,
    color: 'bg-yellow-500',
  },
  {
    title: 'Total Products',
    value: '145',
    change: '+2%',
    icon: Package,
    color: 'bg-green-500',
  },
  {
    title: 'Total Users',
    value: '1,234',
    change: '+8%',
    icon: Users,
    color: 'bg-purple-500',
  },
];

export default function DashboardStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
        >
          <div className="flex items-center justify-between mb-4">
            <div
              className={`${stat.color} p-3 rounded-full text-white`}
            >
              <stat.icon className="h-6 w-6" />
            </div>
            <span
              className={`text-sm font-medium ${
                stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {stat.change}
            </span>
          </div>
          <h3 className="text-gray-500 text-sm font-medium">{stat.title}</h3>
          <p className="text-2xl font-semibold text-gray-900 mt-1">
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
}