'use client';
import { AdminCreateCategory201ResponseCategory } from '@/api/client';
import IdoCategory from '@/api/IdoCategory';
import { Table } from 'antd';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { CategoryActions } from './CategoryActions';
import { CategoryCreateModal } from './CategoryCreateModal';
import { CategoryEditModal } from './CategoryEditModal';
import { CategorySearchBar } from './CategorySearchBar';
import { CategorySelection } from './CategorySelection';

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

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
      const response = await IdoCategory.adminGetCategories({
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
      const response = await IdoCategory.adminDeleteCategories({ ids });
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

  const createCategory = async (values: any) => {
    setLoading(true);
    try {
      const response = await IdoCategory.adminCreateCategory({
        name: values.name,
        slug: values.slug,
        description: values.description,
      });

      if (response.status === 201) {
        toast.success(
          response.data.message || 'Category created successfully',
          {
            position: 'bottom-right',
          }
        );
        fetchData(pagination.current, pagination.pageSize, searchText);
        setIsCreateModalVisible(false);
        setServerError(null);
      } else {
        toast.error(response.data.message || 'Failed to create category', {
          position: 'bottom-right',
        });
      }
    } catch (error: any) {
      setServerError(error?.response?.data?.error || 'Error creating category');
    } finally {
      setLoading(false);
    }
  };

  const updateCategory = async (values: any) => {
    if (currentCategory?.id) {
      setLoading(true);
      try {
        const response = await IdoCategory.adminUpdateCategory({
          id: currentCategory.id,
          ...values,
        });

        if (response.status === 200) {
          toast.success('Category updated successfully', {
            position: 'bottom-right',
          });
          setServerError(null);
          setIsEditModalVisible(false);
          fetchData(pagination.current, pagination.pageSize, searchText);
        } else {
          toast.error('Failed to update category', {
            position: 'bottom-right',
          });
        }
      } catch (error: any) {
        setServerError(
          error?.response?.data?.error || 'Error updating category'
        );
      } finally {
        setLoading(false);
      }
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
        <CategorySelection
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
        <CategoryActions
          record={record}
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
      <CategorySearchBar
        searchText={searchText}
        onSearchChange={(e) => {
          setSearchText(e.target.value);
          setPagination((prev) => ({ ...prev, current: 1 }));
        }}
        onCreateClick={() => setIsCreateModalVisible(true)}
        onBulkDeleteClick={() => {
          if (selectedRowKeys.length > 0) {
            deleteCategory(selectedRowKeys as number[]);
          } else {
            toast.error('No categories selected.', {
              position: 'bottom-right',
            });
          }
        }}
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

      <CategoryCreateModal
        visible={isCreateModalVisible}
        onCancel={() => {
          setIsCreateModalVisible(false);
          setServerError(null);
        }}
        onCreate={createCategory}
        loading={loading}
        serverError={serverError}
      />

      <CategoryEditModal
        visible={isEditModalVisible}
        onCancel={() => {
          setIsEditModalVisible(false);
          setServerError(null);
        }}
        onEdit={updateCategory}
        loading={loading}
        category={currentCategory}
        serverError={serverError}
      />
    </div>
  );
}
