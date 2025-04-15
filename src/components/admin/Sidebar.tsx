import {
  DashboardOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';

const { Sider } = Layout;

interface SidebarProps {
  collapsed: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed }) => {
  const menuItems = [
    { key: '1', icon: <DashboardOutlined />, label: 'Dashboard' },
    { key: '2', icon: <UserOutlined />, label: 'Users' },
    { key: '3', icon: <SettingOutlined />, label: 'Settings' },
  ];

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      style={{
        height: '100vh', // Make it full height
        position: 'fixed', // Stick it to the left side
        left: 0,
        top: 0,
        bottom: 0,
        overflow: 'auto', // Allow scrolling if content overflows
      }}
    >
      <div className="logo text-white text-center font-bold p-4">
        Admin Panel
      </div>
      <Menu
        theme="dark"
        defaultSelectedKeys={['1']}
        mode="inline"
        items={menuItems}
      />
    </Sider>
  );
};

export default Sidebar;
