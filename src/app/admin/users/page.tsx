'use client';
import { AdminGetUsers200ResponseDataInner } from "@/api/client";
import IdoAdminUsers from '@/api/IdoAdminUsers';
import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal, Popconfirm, Select, Space, Table } from 'antd';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const { Option } = Select;

interface User {
  id?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  country?: string;
  username?: string;
  address?: string;
  phone?: string;
  role?: string;
}

export default function UserTablePage() {
  const { data: session } = useSession();
  const loggedInUserId = session?.user?.id;

  const [data, setData] = useState<User[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [form] = Form.useForm();
  const [createForm] = Form.useForm();

  const fetchData = async (page: number, pageSize: number, search: string) => {
    setLoading(true);
    try {
      const response = await IdoAdminUsers.adminGetUsers({
        page,
        limit: pageSize,
        search,
      });

      if (response.status === 200) {
        const users = response.data?.data?.map((user: AdminGetUsers200ResponseDataInner) => ({
          ...user,
          id: user.id || '',
          email: user.email || '',
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          country: user.country || '',
          username: user.username || '',
          address: user.address || '',
          phone: user.phone || '',
          role: user.role || '',
        })) || [];

        setData(users);
        setPagination(prev => ({
          ...prev,
          total: response.data?.pagination?.totalUsers || 0,
        }));
      } else {
        toast.error('Failed to get users data.', {
          position: 'bottom-right'
        })
      }
    } catch (err: any) {
      if (err) {
        toast.error(err.response?.data.message || 'Something went wrong.', {
          position: 'bottom-right',
          autoClose: 3000
        })
      } else {
        toast.error('Unexpected error occurred.', {
          position: 'bottom-right',
          autoClose: 3000
        })
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (ids: string[]) => {
    setLoading(true);
    try {
      const response = await IdoAdminUsers.adminDeleteUsers({ ids });

      if (response.status === 200) {
        toast.success('User(s) deleted successfully', { position: 'bottom-right' });
        fetchData(pagination.current, pagination.pageSize, searchText);
        setSelectedRowKeys([]);
        toast.success(response.data.message || 'User(s) deleted successfully.', { position: 'bottom-right' });
      } else {
        toast.error(response.data.message || 'Failed to delete users data.', { position: 'bottom-right' });
      }
    } catch (err: any) {
      setLoading(false);
      toast.error('Error deleting user(s).', { position: 'bottom-right' });
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (values: any) => {
    setLoading(true);
    try {
      const response = await IdoAdminUsers.adminCreateUser({
        email: values.email,
        firstName: values.firstName,
        lastName: values.lastName,
        username: values.username,
        address: values.address,
        phone: values.phone,
        role: values.role,
        country: values.country,
        password: values.password, // You should generate or require a password
      });

      if (response.status === 201) {
        toast.success(response.data.message || 'User created successfully', { position: 'bottom-right' });
        fetchData(pagination.current, pagination.pageSize, searchText);
        setIsCreateModalVisible(false);
        createForm.resetFields();
      } else {
        toast.error(response.data.message || 'Failed to create user', { position: 'bottom-right' });
      }
    } catch (error: any) {
      toast.error(error.response?.data.message || 'Error creating user', { position: 'bottom-right' });
      console.error('Error creating user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handleTableChange = (pagination: any) => {
    setPagination(pagination);
    fetchData(pagination.current, pagination.pageSize, searchText);
  };

  const handleEdit = (record: User) => {
    setCurrentUser(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleSubmit = async (values: any) => {
    if (currentUser?.id) {
      setLoading(true);
      try {
        const response = await IdoAdminUsers.adminUpdateUser({
          id: currentUser.id,
          ...values
        });

        if (response.status === 200) {
          toast.success('User updated successfully', { position: 'bottom-right' });
          setIsModalVisible(false);
          fetchData(pagination.current, pagination.pageSize, searchText);
        } else {
          toast.error('Failed to update user', { position: 'bottom-right' });
        }
      } catch (error) {
        toast.error('Error updating user', { position: 'bottom-right' });
        console.error('Error updating user:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDelete = (record: User) => {
    if (record.id) {
      deleteUser([record.id]);
    }
  };

  const handleBulkDelete = () => {
    if (selectedRowKeys.length > 0) {
      deleteUser(selectedRowKeys as string[]);
    } else {
      toast.error('No users selected.', { position: 'bottom-right' });
    }
  };

  const columns = [
    {
      title: 'Select',
      key: 'select',
      render: (_: any, record: User) => (
        <input
          type="checkbox"
          checked={selectedRowKeys.includes(record.id!)}
          onChange={() => {
            const newSelectedRowKeys = selectedRowKeys.includes(record.id!)
              ? selectedRowKeys.filter(key => key !== record.id)
              : [...selectedRowKeys, record.id!];
            setSelectedRowKeys(newSelectedRowKeys);
          }}
        />
      ),
    },
    { title: 'First Name', dataIndex: 'firstName', key: 'firstName' },
    { title: 'Last Name', dataIndex: 'lastName', key: 'lastName' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Country', dataIndex: 'country', key: 'country' },
    { title: 'Username', dataIndex: 'username', key: 'username' },
    { title: 'Address', dataIndex: 'address', key: 'address' },
    { title: 'Phone', dataIndex: 'phone', key: 'phone' },
    { title: 'Role', dataIndex: 'role', key: 'role' },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: User) => (
        <Space size="middle">
          <Button type="primary" icon={<EditOutlined />} onClick={() => handleEdit(record)}>Edit</Button>
          {record.id !== loggedInUserId && (
            <Popconfirm
              title="Are you sure to delete this user?"
              onConfirm={() => handleDelete(record)}
              okText="Yes"
              cancelText="No"
            >
              <Button type="primary" danger icon={<DeleteOutlined />}>Delete</Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  useEffect(() => {
    fetchData(pagination.current, pagination.pageSize, searchText);
  }, [pagination.current, pagination.pageSize, searchText]);

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <Input
          placeholder="Search users"
          value={searchText}
          onChange={handleSearchChange}
          style={{ width: 300 }}
          prefix={<SearchOutlined />}
        />
        <div>
          <Button
            type="primary"
            onClick={() => setIsCreateModalVisible(true)}
            icon={<PlusOutlined />}
            className="mr-2"
          >
            Create User
          </Button>
          <Button
            type="primary"
            danger
            onClick={handleBulkDelete}
            disabled={selectedRowKeys.length === 0}
          >
            Delete Selected
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        pagination={pagination}
        loading={loading}
        onChange={handleTableChange}
      />

      {/* Create User Modal */}
      <Modal
        title="Create User"
        open={isCreateModalVisible}
        onCancel={() => {
          setIsCreateModalVisible(false);
          createForm.resetFields();
        }}
        footer={null}
        destroyOnClose
      >
        <Form
          form={createForm}
          onFinish={createUser}
          layout="vertical"
        >
          <Form.Item
            label="First Name"
            name="firstName"
            rules={[{ required: true, message: 'Please input the first name!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Last Name"
            name="lastName"
            rules={[{ required: true, message: 'Please input the last name!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Please input the email!' },
              { type: 'email', message: 'Invalid email format!' }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: 'Please input the username!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Address"
            name="address"
            rules={[{ required: true, message: 'Please input the address!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Phone"
            name="phone"
            rules={[{ required: true, message: 'Please input the phone number!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Role"
            name="role"
            rules={[{ required: true, message: 'Please select the role!' }]}
          >
            <Select>
              <Option value="user">User</Option>
              <Option value="admin">Admin</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Country"
            name="country"
            rules={[{ required: true, message: 'Please input the country!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input the password!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Create User
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit User Modal */}
      <Modal
        title="Edit User"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        destroyOnClose
      >
        <Form
          form={form}
          onFinish={handleSubmit}
          layout="vertical"
        >
          <Form.Item
            label="First Name"
            name="firstName"
            rules={[{ required: true, message: 'Please input the first name!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Last Name"
            name="lastName"
            rules={[{ required: true, message: 'Please input the last name!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Please input the email!' },
              { type: 'email', message: 'Invalid email format!' }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: 'Please input the username!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Address"
            name="address"
            rules={[{ required: true, message: 'Please input the address!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Phone"
            name="phone"
            rules={[{ required: true, message: 'Please input the phone number!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Role"
            name="role"
            rules={[{ required: true, message: 'Please select the role!' }]}
          >
            <Select>
              <Option value="user">User</Option>
              <Option value="admin">Admin</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Country"
            name="country"
            rules={[{ required: true, message: 'Please input the country!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Update User
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}