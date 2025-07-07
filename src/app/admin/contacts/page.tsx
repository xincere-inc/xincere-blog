'use client';

import ApiAdminContact from '@/api/ApiAdminContact';
import { AdminGetContacts200ResponseDataInner } from '@/api/client';
import { Actions } from '@/components/admin/Actions';
import { ContactEditModal } from '@/components/admin/ContactEditModal';
import { SearchBar } from '@/components/admin/SearchBar';
import { Selection } from '@/components/admin/Selection';
import type { Contact } from '@prisma/client';
import { Button, Popconfirm, Table } from 'antd';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export default function ContactsPage() {
  const [data, setData] = useState<Contact[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    limit: 10,
    total: 0,
  });
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [currentContact, setCurrentContact] = useState<Contact | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const fetchData = async (page: number, limit: number, search: string) => {
    setLoading(true);
    try {
      const response = await ApiAdminContact.adminGetContacts(
        page,
        limit,
        search
      );

      if (response.status === 200) {
        const contacts =
          response.data?.data?.map(
            (contact: AdminGetContacts200ResponseDataInner) => ({
              id: contact.id || 0,
              companyName: contact.companyName || '',
              contactName: contact.contactName || '',
              email: contact.email || '',
              phone: contact.phone || '',
              inquiry: contact.inquiry || '',
              privacyPolicy: contact.privacyPolicy || false,
              status: contact.status || 'OPEN',
              createdAt: contact.createdAt
                ? new Date(contact.createdAt)
                : new Date(),
            })
          ) || [];
        setData(contacts as Contact[]);
        setPagination((prev) => ({
          ...prev,
          total: response.data?.pagination?.totalContacts || 0,
        }));
      } else {
        toast.error('Failed to get contacts data.', {
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

  const deleteContact = async (ids: number[]) => {
    setSelectedRowKeys([]);

    try {
      const response = await ApiAdminContact.adminDeleteContacts({ ids });
      if (response.status !== 200) {
        toast.error(response?.data?.message || 'Failed to delete contacts.', {
          position: 'bottom-right',
        });
      } else {
        fetchData(pagination.current, pagination.limit, searchText);
        toast.success(response?.data?.message, { position: 'bottom-right' });
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error deleting contact(s).', {
        position: 'bottom-right',
        autoClose: 3000,
      });
    }
  };

  const handleTableChange = (pagination: any) => {
    setPagination(pagination);
    fetchData(pagination.current, pagination.limit, searchText);
  };

  const handleDelete = (record: Contact) => {
    if (record.id) {
      deleteContact([record.id]);
    }
  };

  const handleSelectChange = (record: Contact) => {
    const newSelectedRowKeys = selectedRowKeys.includes(record.id)
      ? selectedRowKeys.filter((key) => key !== record.id)
      : [...selectedRowKeys, record.id];
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const handleEdit = (record: Contact) => {
    setCurrentContact({ ...record });
    setIsEditModalVisible(true);
  };

  const columns = [
    {
      title: 'Select',
      key: 'select',
      render: (_: any, record: Contact) => (
        <Selection
          record={record}
          selectedRowKeys={selectedRowKeys}
          onSelectChange={handleSelectChange}
        />
      ),
    },
    { title: 'Id', dataIndex: 'id', key: 'id' },
    { title: 'Company Name', dataIndex: 'companyName', key: 'companyName' },
    { title: 'Contact Name', dataIndex: 'contactName', key: 'contactName' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Phone', dataIndex: 'phone', key: 'phone' },
    { title: 'Inquiry', dataIndex: 'inquiry', key: 'inquiry' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => status,
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt: Date) =>
        isMounted ? createdAt.toLocaleString() : createdAt.toISOString(),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: Contact) => (
        <Actions record={record} onEdit={handleEdit} onDelete={handleDelete} />
      ),
    },
  ];

  useEffect(() => {
    if (isMounted) {
      fetchData(pagination.current, pagination.limit, searchText);
    }
  }, [pagination.current, pagination.limit, searchText, isMounted]);

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4 flex-col gap-y-2 md:flex-row">
        <SearchBar
          placeholder="Search contacts"
          searchText={searchText}
          onSearchChange={(e) => {
            setSearchText(e.target.value);
            setPagination((prev) => ({ ...prev, current: 1 }));
          }}
        />
        <div className="flex mb-4 gap-y-2 md:flex-row flex-col">
          <Popconfirm
            title="Are you sure to delete the selected contacts?"
            onConfirm={() => {
              if (selectedRowKeys.length > 0) {
                deleteContact(selectedRowKeys as number[]);
              } else {
                toast.error('No contacts selected.', {
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

      <ContactEditModal
        visible={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        onSuccess={() => {
          setIsEditModalVisible(false);
          fetchData(pagination.current, pagination.limit, searchText);
        }}
        contact={currentContact}
      />
    </div>
  );
}
