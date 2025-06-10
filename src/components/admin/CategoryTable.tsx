'use client';
import CategoryApi from '@/api/CategoryApi';
import { AdminCreateCategory201ResponseCategory } from '@/api/client';
import { Category } from '@/types/admin/category';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Table } from 'antd';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Actions } from './Actions';
import { CategoryCreateModal } from './CategoryCreateModal';
import { CategoryEditModal } from './CategoryEditModal';
import { SearchBar } from './SearchBar';
import { Selection } from './Selection';

export default function CategoryTable() {
  const [data, setData] = useState<Category[]>([]);
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
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);

  const fetchData = async (page: number, pageSize: number, search: string) => {
    setLoading(true);
    try {
      const response = await CategoryApi.adminGetCategories({
        page,
        limit: pageSize,
        search,
      });

      if (response.status === 200) {
        const categories =
          response.data?.data?.map(
            (category: AdminCreateCategory201ResponseCategory) => ({
              id: category.id || 0,
              name: category.name || '',
              slug: category.slug || '',
              description: category.description ?? '',
              createdAt: category.createdAt
                ? new Date(category.createdAt)
                : new Date(),
              updatedAt: category.updatedAt
                ? new Date(category.updatedAt)
                : new Date(),
              deletedAt: category.deletedAt
                ? new Date(category.deletedAt)
                : null,
            })
          ) || [];
        setData(categories);
        setPagination((prev) => ({
          ...prev,
          total: response.data?.pagination?.totalCategories || 0,
        }));
      } else {
        toast.error('Failed to get categories data.', {
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

  const deleteCategory = async (ids: number[]) => {
    setSelectedRowKeys([]);

    try {
      const response = await CategoryApi.adminDeleteCategories({ ids });
      if (response.status !== 200) {
        toast.error(response?.data?.message || 'Failed to delete categories.', {
          position: 'bottom-right',
        });
      } else {
        fetchData(pagination.current, pagination.pageSize, searchText);
        toast.success(response?.data?.message, { position: 'bottom-right' });
      }
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || 'Error deleting category(s).',
        {
          position: 'bottom-right',
          autoClose: 3000,
        }
      );
    }
  };

  const handleTableChange = (pagination: any) => {
    setPagination(pagination);
    fetchData(pagination.current, pagination.pageSize, searchText);
  };

  const handleEdit = (record: Category) => {
    setCurrentCategory({ ...record });
    setIsEditModalVisible(true);
  };

  const handleDelete = (record: Category) => {
    if (record.id) {
      deleteCategory([record.id]);
    }
  };

  const handleSelectChange = (record: Category) => {
    const newSelectedRowKeys = selectedRowKeys.includes(record.id)
      ? selectedRowKeys.filter((key) => key !== record.id)
      : [...selectedRowKeys, record.id];
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const columns = [
    {
      title: 'Select',
      key: 'select',
      render: (_: any, record: Category) => (
        <Selection
          record={record}
          selectedRowKeys={selectedRowKeys}
          onSelectChange={handleSelectChange}
        />
      ),
    },
    { title: 'Id', dataIndex: 'id', key: 'id' },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Slug', dataIndex: 'slug', key: 'slug' },
    { title: 'Description', dataIndex: 'description', key: 'description' },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt: Date) => createdAt.toLocaleString(),
    },
    {
      title: 'Updated At',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (updatedAt: Date) => updatedAt.toLocaleString(),
    },
    {
      title: 'Deleted At',
      dataIndex: 'deletedAt',
      key: 'deletedAt',
      render: (deletedAt: Date | null) =>
        deletedAt ? deletedAt.toLocaleString() : '-',
    },
    {
      title: 'Action',
      key: 'action',

      render: (_: any, record: Category) => (
        <Actions record={record} onEdit={handleEdit} onDelete={handleDelete} />
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
          placeholder="Search categories"
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
            Create Category
          </Button>
          <Popconfirm
            title="Are you sure to delete the selected categories?"
            onConfirm={() => {
              if (selectedRowKeys.length > 0) {
                deleteCategory(selectedRowKeys as number[]);
              } else {
                toast.error('No categories selected.', {
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

      <CategoryCreateModal
        visible={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        onSuccess={fetchData}
        pagination={pagination}
        searchText={searchText}
      />

      <CategoryEditModal
        visible={isEditModalVisible}
        onSuccess={fetchData}
        pagination={pagination}
        searchText={searchText}
        onCancel={() => {
          setIsEditModalVisible(false);
        }}
        category={currentCategory}
      />
    </div>
  );
}
