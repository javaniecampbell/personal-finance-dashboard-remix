import React, { useState } from 'react';
import { Outlet } from '@remix-run/react';
import Layout from '~/components/Layout';
import NestedNavigation from '~/components/NestedNavigation';
import SideDrawer from '~/components/SideDrawer.v2';

const navigationItems = [
  {
    label: 'Dashboard',
    to: '/dashboard',
  },
  {
    label: 'Finance',
    to: '/finance',
    children: [
      { label: 'Budgets', to: '/finance/budgets' },
      { label: 'Transactions', to: '/finance/transactions' },
    ],
  },
  {
    label: 'Analytics',
    to: '/analytics',
    children: [
      { label: 'Overview', to: '/analytics/overview' },
      { label: 'Reports', to: '/analytics/reports' },
    ],
  },
];

export default function DashboardLayout() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerContent, setDrawerContent] = useState(null);

  const openDrawer = (content) => {
    setDrawerContent(content);
    setIsDrawerOpen(true);
  };

  return (
    <Layout>
      <div className="flex">
        <NestedNavigation items={navigationItems} />
        <div className="flex-grow p-6">
          <button
            onClick={() => openDrawer(<p>This is example drawer content.</p>)}
            className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Open Drawer
          </button>
          <Outlet context={{ openDrawer }} />
        </div>
      </div>

      <SideDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Drawer Title"
      >
        {drawerContent}
      </SideDrawer>
    </Layout>
  );
}
