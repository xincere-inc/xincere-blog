'use client';
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
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Sidebar */}
      <Sidebar collapsed={collapsed} />

      {/* Main Layout */}
      <Layout
        style={{
          marginLeft: collapsed ? 80 : 200, // Shift content when sidebar expands
          transition: 'margin-left 0.3s ease-in-out',
        }}
      >
        {/* Header */}
        <HeaderBar
          collapsed={collapsed}
          toggleSidebar={() => setCollapsed(!collapsed)}
        />

        {/* Content */}
        <Content style={{ margin: '16px' }}>
          <div className="p-6 bg-white min-h-[87vh]">{children}</div>
        </Content>
      </Layout>
    </Layout>
  );
}
