'use client';
import AdminUsersApi from '@/api/AdminUsersApi';
import { AdminGetUsers200ResponseDataInner } from '@/api/client';
import { User } from '@/types/admin/user';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Table } from 'antd';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { SearchBar } from './SearchBar';
import { Selection } from './Selection';
import { UserActions } from './UserActions';
import { UserCreateModal } from './UserCreateModal';
import { UserEditModal } from './UserEditModal';

export default function UserTable() {
  const { data: session } = useSession();
  const loggedInUserId = session?.user?.id;

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
      const response = await AdminUsersApi.adminGetUsers({
        page,
        limit: pageSize,
        search,
      });
      console.log('get data', response);

      if (response.status === 200) {
        const users =
          response.data?.data?.map(
            (user: AdminGetUsers200ResponseDataInner) => ({
              ...user,
              id: user.id || '',
              email: user.email || '',
              firstName: user.firstName || '',
              lastName: user.lastName || '',
              gender: user.gender || '',
              country: user.country || '',
              address: user.address || '',
              role: user.role || '',
            })
          ) || [];

        setData(users);
        setPagination((prev) => ({
          ...prev,
          total: response.data?.pagination?.totalUsers || 0,
        }));
      } else {
        toast.error('Failed to get users data.', {
          position: 'bottom-right',
        });
      }
    } catch (err: any) {
      toast.error(err.response?.data.message || 'Something went wrong.', {
        position: 'bottom-right',
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (ids: string[]) => {
    setSelectedRowKeys([]);

    try {
      const response = await AdminUsersApi.adminDeleteUsers({ ids });
      if (response.status !== 200) {
        toast.error(response?.data?.message || 'Failed to delete users data.', {
          position: 'bottom-right',
        });
      } else {
        fetchData(pagination.current, pagination.pageSize, searchText);
        toast.success(response?.data?.message, { position: 'bottom-right' });
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error deleting user(s).', {
        position: 'bottom-right',
        autoClose: 3000,
      });
    }
  };

  const updateUser = async (values: any) => {
    if (currentUser?.id) {
      setLoading(true);
      try {
        const response = await AdminUsersApi.adminUpdateUser({
          id: currentUser.id,
          ...values,
        });

        if (response.status === 200) {
          toast.success('User updated successfully', {
            position: 'bottom-right',
          });
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
  };

  const handleDelete = (record: User) => {
    if (record.id) {
      deleteUser([record.id]);
    }
  };

  const handleSelectChange = (record: User) => {
    const newSelectedRowKeys = selectedRowKeys.includes(record.id!)
      ? selectedRowKeys.filter((key) => key !== record.id)
      : [...selectedRowKeys, record.id!];
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const columns = [
    {
      title: 'Select',
      key: 'select',
      render: (_: any, record: User) => (
        <Selection
          record={record}
          selectedRowKeys={selectedRowKeys}
          onSelectChange={handleSelectChange}
        />
      ),
    },
    { title: 'First Name', dataIndex: 'firstName', key: 'firstName' },
    { title: 'Last Name', dataIndex: 'lastName', key: 'lastName' },
    { title: 'Gender', dataIndex: 'gender', key: 'gender' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Country', dataIndex: 'country', key: 'country' },
    { title: 'Address', dataIndex: 'address', key: 'address' },
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
      <div className="flex justify-between mb-4 flex-col gap-y-2 md:flex-row">
        <SearchBar
          placeholder="Search users"
          searchText={searchText}
          onSearchChange={(e) => {
            setSearchText(e.target.value);
            setPagination((prev) => ({ ...prev, current: 1 }));
          }}
        />
        <div className="flex mb-4 gap-y-2 md:flex-row flex-col">
          <Button
            type="primary"
            onClick={() => setIsCreateModalVisible(true)}
            icon={<PlusOutlined />}
            className="md:mr-2"
          >
            Create User
          </Button>
          <Popconfirm
            title="Are you sure to delete the selected users?"
            onConfirm={() => {
              if (selectedRowKeys.length > 0) {
                deleteUser(selectedRowKeys as string[]);
              } else {
                toast.error('No users selected.', {
                  position: 'bottom-right',
                });
              }
            }}
            placement="bottomLeft"
            okText="Yes"
            cancelText="No"
            disabled={selectedRowKeys.length === 0}
          >
            <Button
              type="primary"
              danger
              disabled={selectedRowKeys.length === 0}
            >
              Delete Selected
            </Button>
          </Popconfirm>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        pagination={pagination}
        loading={loading}
        onChange={handleTableChange}
        scroll={{ x: true }}
        className="w-full"
      />

      <UserCreateModal
        visible={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        onSuccess={fetchData}
        pagination={pagination}
        searchText={searchText}
      />

      <UserEditModal
        visible={isEditModalVisible}
        onCancel={handleCancelEditModal}
        onEdit={updateUser}
        loading={loading}
        user={
          currentUser
            ? {
                firstName: currentUser.firstName || '',
                lastName: currentUser.lastName || '',
                email: currentUser.email || '',
                country: currentUser.country || '',
                address: currentUser.address || '',
                role: currentUser.role || '',
                gender: (currentUser as any).gender || '',
              }
            : null
        }
        serverError={serverError}
      />
    </div>
  );
}
