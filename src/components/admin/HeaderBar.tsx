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
    <Header className="overflow-scroll !bg-white px-4 flex items-center justify-between">
      {/* Left Side: Toggle & Title */}
      <div className="flex items-center">
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={toggleSidebar}
          className="text-lg mr-4"
        />
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
          className="w-20"
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
            className="cursor-pointer"
          />
        </Dropdown>
      </Space>
    </Header>
  );
};

export default HeaderBar;
