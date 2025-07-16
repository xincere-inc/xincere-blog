'use client';
import '@ant-design/v5-patch-for-react-19';
import React from 'react';

import HeaderBar from '@/components/admin/HeaderBar';
import Sidebar from '@/components/admin/Sidebar';
import { Layout } from 'antd';
import { useState } from 'react';

const { Content } = Layout;

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <Layout className="min-h-screen">
      {/* Sidebar */}
      <Sidebar collapsed={collapsed} />

      {/* Main Layout */}
      <Layout
        className={
          collapsed
            ? 'ml-20 transition-margin duration-300 ease-in-out'
            : 'ml-200 transition-margin duration-300 ease-in-out'
        }
      >
        {/* Header */}
        <HeaderBar
          collapsed={collapsed}
          toggleSidebar={() => setCollapsed(!collapsed)}
        />

        {/* Content */}
        <Content className="m-4">
          <div className="p-6 bg-white min-h-87vh">{children}</div>
        </Content>
      </Layout>
    </Layout>
  );
}
