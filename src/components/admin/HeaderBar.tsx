import {
  BellOutlined,
  GlobalOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  QuestionCircleOutlined,
  SearchOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Avatar, Badge, Button, Dropdown, Layout, Select, Space } from 'antd';
import { signOut } from 'next-auth/react';
import { useState } from 'react';

const { Header } = Layout;

interface HeaderBarProps {
  collapsed: boolean;
  toggleSidebar: () => void;
}

const HeaderBar: React.FC<HeaderBarProps> = ({ collapsed, toggleSidebar }) => {
  const [language, setLanguage] = useState('en');

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
  };

  const userMenu = {
    items: [
      { key: '1', label: 'Profile', icon: <UserOutlined /> },
      { key: '2', label: 'Settings', icon: <SettingOutlined /> },
      {
        key: '3',
        label: 'Logout',
        icon: <LogoutOutlined />,
        onClick: () => signOut({ redirectTo: '/' }),
      },
    ],
  };

  return (
    <Header
      style={{
        background: '#fff',
        padding: '0 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      {/* Left Side: Toggle & Title */}
      <div className="flex items-center">
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={toggleSidebar}
          style={{ fontSize: '18px', marginRight: '16px' }}
        />
        <h2 style={{ margin: 0 }}>Admin Dashboard</h2>
      </div>

      {/* Right Side: Icons & User Menu */}
      <Space size="middle">
        {/* Search Icon */}
        <Button type="text" icon={<SearchOutlined />} />

        {/* Help Icon */}
        <Button type="text" icon={<QuestionCircleOutlined />} />

        {/* Notifications with Badge */}
        <Badge count={12} size="small">
          <Button type="text" icon={<BellOutlined />} />
        </Badge>

        {/* Language Selector */}
        <Select
          value={language}
          onChange={handleLanguageChange}
          style={{ width: 80 }}
          options={[
            { value: 'en', label: 'EN' },
            { value: 'zh', label: '中文' },
          ]}
          suffixIcon={<GlobalOutlined />}
        />

        {/* User Profile */}
        <Dropdown menu={userMenu} trigger={['click']}>
          <Avatar
            size="large"
            icon={<UserOutlined />}
            style={{ cursor: 'pointer' }}
          />
        </Dropdown>
      </Space>
    </Header>
  );
};

export default HeaderBar;
