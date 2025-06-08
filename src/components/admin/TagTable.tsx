'use client';
import { AdminCreateTag201ResponseTag } from '@/api/client';

import IdoTag from '@/api/IdoTag';
import { Table } from 'antd';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { TagActions } from './TagActions';
import { TagCreateModal } from './TagCreateModal';
import { TagEditModal } from './TagEditModal';
import { TagSearchBar } from './TagSearchBar';
import { TagSelection } from './TagSelection';

export interface Tag {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export default function TagTable() {
  const [data, setData] = useState<Tag[]>([]);
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
  const [currentTag, setCurrentTag] = useState<Tag | null>(null);

  const fetchData = async (page: number, pageSize: number, search: string) => {
    setLoading(true);
    try {
      const response = await IdoTag.adminGetTags({
        page,
        limit: pageSize,
        search,
      });

      if (response.status === 200) {
        const tag =
          response.data?.data?.map((tag: AdminCreateTag201ResponseTag) => ({
            id: tag.id || 0,
            name: tag.name || '',
            createdAt: tag.createdAt ? new Date(tag.createdAt) : new Date(),
            updatedAt: tag.updatedAt ? new Date(tag.updatedAt) : new Date(),
            deletedAt: tag.deletedAt ? new Date(tag.deletedAt) : null,
          })) || [];
        setData(tag);
        setPagination((prev) => ({
          ...prev,
          total: response.data?.pagination?.totalTags || 0,
        }));
      } else {
        toast.error('Failed to get tag data.', {
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

  const deleteTag = async (ids: number[]) => {
    setSelectedRowKeys([]);

    try {
      const response = await IdoTag.adminDeleteTags({ ids });
      if (response.status !== 200) {
        toast.error(response?.data?.message || 'Failed to delete tag.', {
          position: 'bottom-right',
        });
      } else {
        fetchData(pagination.current, pagination.pageSize, searchText);
        toast.success(response?.data?.message, { position: 'bottom-right' });
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error deleting tag(s).', {
        position: 'bottom-right',
        autoClose: 3000,
      });
    }
  };

  const createTag = async (values: any) => {
    setLoading(true);
    try {
      const response = await IdoTag.adminCreateTag({
        name: values.name,
      });

      if (response.status === 201) {
        toast.success(response.data.message || 'Tag created successfully', {
          position: 'bottom-right',
        });
        fetchData(pagination.current, pagination.pageSize, searchText);
        setIsCreateModalVisible(false);
        setServerError(null);
      } else {
        toast.error(response.data.message || 'Failed to create tag', {
          position: 'bottom-right',
        });
      }
    } catch (error: any) {
      setServerError(error?.response?.data?.error || 'Error creating tag');
    } finally {
      setLoading(false);
    }
  };

  const updateTag = async (values: any) => {
    if (currentTag?.id) {
      setLoading(true);
      try {
        const response = await IdoTag.adminUpdateTag({
          id: currentTag.id,
          ...values,
        });

        if (response.status === 200) {
          toast.success('Tag updated successfully', {
            position: 'bottom-right',
          });
          setServerError(null);
          setIsEditModalVisible(false);
          fetchData(pagination.current, pagination.pageSize, searchText);
        } else {
          toast.error('Failed to update tag', {
            position: 'bottom-right',
          });
        }
      } catch (error: any) {
        setServerError(error?.response?.data?.error || 'Error updating tag');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleTableChange = (pagination: any) => {
    setPagination(pagination);
    fetchData(pagination.current, pagination.pageSize, searchText);
  };

  const handleEdit = (record: Tag) => {
    setCurrentTag({ ...record });
    setIsEditModalVisible(true);
  };

  const handleDelete = (record: Tag) => {
    if (record.id) {
      deleteTag([record.id]);
    }
  };

  const handleSelectChange = (record: Tag) => {
    const newSelectedRowKeys = selectedRowKeys.includes(record.id)
      ? selectedRowKeys.filter((key) => key !== record.id)
      : [...selectedRowKeys, record.id];
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const columns = [
    {
      title: 'Select',
      key: 'select',
      render: (_: any, record: Tag) => (
        <TagSelection
          record={record}
          selectedRowKeys={selectedRowKeys}
          onSelectChange={handleSelectChange}
        />
      ),
    },
    { title: 'Id', dataIndex: 'id', key: 'id' },
    { title: 'Name', dataIndex: 'name', key: 'name' },
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

      render: (_: any, record: Tag) => (
        <TagActions
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
      <TagSearchBar
        searchText={searchText}
        onSearchChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setSearchText(e.target.value);
          setPagination((prev) => ({ ...prev, current: 1 }));
        }}
        onCreateClick={() => setIsCreateModalVisible(true)}
        onBulkDeleteClick={() => {
          if (selectedRowKeys.length > 0) {
            deleteTag(selectedRowKeys as number[]);
          } else {
            toast.error('No tag selected.', {
              position: 'bottom-right',
            });
          }
        }}
        selectedRowCount={selectedRowKeys.length}
      />

      <Table<Tag>
        columns={columns}
        dataSource={data}
        rowKey="id"
        pagination={pagination}
        loading={loading}
        onChange={handleTableChange}
        scroll={{ x: true }}
        style={{ width: '100%' }}
      />

      <TagCreateModal
        visible={isCreateModalVisible}
        onCancel={() => {
          setIsCreateModalVisible(false);
          setServerError(null);
        }}
        onCreate={createTag}
        loading={loading}
        serverError={serverError}
      />

      <TagEditModal
        visible={isEditModalVisible}
        onCancel={() => {
          setIsEditModalVisible(false);
          setServerError(null);
        }}
        onEdit={updateTag}
        loading={loading}
        tag={currentTag}
        serverError={serverError}
      />
    </div>
  );
}
