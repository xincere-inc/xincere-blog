'use client';
import { AdminCreateTag201ResponseTag } from '@/api/client';

import TagApi from '@/api/TagApi';
import { Tag } from '@/types/admin/tag';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Table } from 'antd';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Actions } from './Actions';
import { SearchBar } from './SearchBar';
import { Selection } from './Selection';
import { TagCreateModal } from './TagCreateModal';
import { TagEditModal } from './TagEditModal';

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
      const response = await TagApi.adminGetTags({
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
      const response = await TagApi.adminDeleteTags({ ids });
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
        <Selection
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
          placeholder="Search tags"
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
            title="Are you sure to delete the selected tags?"
            onConfirm={() => {
              if (selectedRowKeys.length > 0) {
                deleteTag(selectedRowKeys as number[]);
              } else {
                toast.error('No tags selected.', {
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

      <Table<Tag>
        columns={columns}
        dataSource={data}
        rowKey="id"
        pagination={pagination}
        loading={loading}
        onChange={handleTableChange}
        scroll={{ x: true }}
        className="w-full"
      />

      <TagCreateModal
        visible={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        onSuccess={fetchData}
        pagination={pagination}
        searchText={searchText}
      />

      <TagEditModal
        onSuccess={fetchData}
        pagination={pagination}
        searchText={searchText}
        visible={isEditModalVisible}
        onCancel={() => {
          setIsEditModalVisible(false);
        }}
        tag={currentTag}
      />
    </div>
  );
}
