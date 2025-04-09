'use client';
import { AdminGetUsers200ResponseDataInner } from "@/api/client";
import IdoAdminUsers from '@/api/IdoAdminUsers';
import { Table } from 'antd';
import { useSession } from 'next-auth/react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { UserActions } from './UserActions';
import { UserCreateModal } from './UserCreateModal';
import { UserEditModal } from './UserEditModal';
import { UserSearchBar } from './UserSearchBar';
import { UserSelection } from './UserSelection';

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

export default function UserTable() {
  const { data: session } = useSession();
  const loggedInUserId = session?.user?.id;
  const createFormRef = useRef<any>(null);

  const [data, setData] = useState<User[]>([]);
  const [serverError, setServerError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const fetchData = async (page: number, pageSize: number, search: string) => {
    setLoading(true);
    try {
      const response = await IdoAdminUsers.adminGetUsers({
        page,
        limit: pageSize,
        search,
      });
      console.log('get data', response?.data?.data?.length);

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
        });
      }
    } catch (err: any) {
      toast.error(err.response?.data.message || 'Something went wrong.', {
        position: 'bottom-right',
        autoClose: 3000
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (ids: string[]) => {
    setSelectedRowKeys([]);

    try {
      const response = await IdoAdminUsers.adminDeleteUsers({ ids });
      if (response.status !== 200) {
        toast.error(response?.data?.message || 'Failed to delete users data.', { position: 'bottom-right' });
      } else {
        fetchData(pagination.current, pagination.pageSize, searchText);
        toast.success(response?.data?.message, { position: 'bottom-right' });
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error deleting user(s).', {
        position: 'bottom-right',
        autoClose: 3000
      });
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
        password: values.password,
      });

      if (response.status === 201) {
        toast.success(response.data.message || 'User created successfully', { position: 'bottom-right' });
        fetchData(pagination.current, pagination.pageSize, searchText);
        setIsCreateModalVisible(false);
        setServerError(null);
        createFormRef.current?.resetFields();
      } else {
        toast.error(response.data.message || 'Failed to create user', { position: 'bottom-right' });
      }
    } catch (error: any) {
      setServerError(error?.response?.data?.error || 'Error creating user');

    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (values: any) => {
    if (currentUser?.id) {
      setLoading(true);
      try {
        const response = await IdoAdminUsers.adminUpdateUser({
          id: currentUser.id,
          ...values
        });

        if (response.status === 200) {
          toast.success('User updated successfully', { position: 'bottom-right' });
          setServerError(null);
          setIsEditModalVisible(false);
          fetchData(pagination.current, pagination.pageSize, searchText);
        } else {
          toast.error('Failed to update user', { position: 'bottom-right' });
        }
      } catch (error: any) {
        setServerError(error?.response?.data?.error || 'Error updating user');
      } finally {
        setLoading(false);
      }
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
    setCurrentUser({ ...record });
    setIsEditModalVisible(true);
  };
  const handleCancelEditModal = () => {
    setIsEditModalVisible(false);
    setServerError(null);
  }

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

  const handleSelectChange = (record: User) => {
    const newSelectedRowKeys = selectedRowKeys.includes(record.id!)
      ? selectedRowKeys.filter(key => key !== record.id)
      : [...selectedRowKeys, record.id!];
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const columns = [
    {
      title: 'Select',
      key: 'select',
      render: (_: any, record: User) => (
        <UserSelection
          record={record}
          selectedRowKeys={selectedRowKeys}
          onSelectChange={handleSelectChange}
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
        <UserActions
          record={record}
          loggedInUserId={loggedInUserId}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ),
    },
  ];

  useEffect(() => {
    fetchData(pagination.current, pagination.pageSize, searchText);
  }, [pagination.current, pagination.pageSize, searchText]);

  return (
    <div className="p-4">
      <UserSearchBar
        searchText={searchText}
        onSearchChange={handleSearchChange}
        onCreateClick={() => setIsCreateModalVisible(true)}
        onBulkDeleteClick={handleBulkDelete}
        selectedRowCount={selectedRowKeys.length}
      />

      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        pagination={pagination}
        loading={loading}
        onChange={handleTableChange}
        scroll={{ x: true }}
        style={{ width: '100%' }}
      />

      <UserCreateModal
        visible={isCreateModalVisible}
        onCancel={() => {
          setIsCreateModalVisible(false);
          setServerError(null);
        }}
        onCreate={createUser}
        loading={loading}
        serverError={serverError}
        formRef={createFormRef}
      />

      <UserEditModal
        visible={isEditModalVisible}
        onCancel={handleCancelEditModal}
        onEdit={updateUser}
        loading={loading}
        user={currentUser}
        serverError={serverError}
      />
    </div>
  );
}