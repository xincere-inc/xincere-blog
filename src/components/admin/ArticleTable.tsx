'use client';
import { AdminGetUsers200ResponseDataInner } from '@/api/client';
import IdoAdminArticles from '@/api/IdoAdminArticles';
import { Table } from 'antd';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { ArticleSearchBar } from './ArticleSearchBar';


export interface Article {
  id?: number;
  author?: string;
  title?: string;
  category?: string;
  slug?: string;
  summary?: string;
  status?: string;
  tags?: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
}

export default function ArticleTable() {
  const [searchText, setSearchText] = useState('');
  const [data, setData] = useState<User[]>([]);
  const [serverError, setServerError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total:0
  });
  const [loading, setLoading] = useState(false)
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const fetchData = async (page: number, pageSize: number, search: string) => {
    setLoading(true);
    try {
      const response = await IdoAdminArticles.adminGetArticles({
        page,
        limit: pageSize,
        search,
      });
      console.log('get article:', response);
    } catch (err: any) {
      toast.error(err.response?.data.message || 'Something went wrong.', {
        position: 'bottom-right',
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteArticle = async (ids: string[]) => {};

  const createArticle = async (values: any) => {};

  const updateArticle = async (values: any) => {};

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const handleBulkDelete = () => {
      if (selectedRowKeys.length > 0) {
        deleteArticle(selectedRowKeys as string[]);
      } else {
        toast.error('No article selected.', { position: 'bottom-right' });
      }
    };

  return (
    <div className="p-4">
      <ArticleSearchBar
        searchText={searchText}
        onSearchChange={handleSearchChange}
        onCreateClick={() => setIsCreateModalVisible(true)}
        onBulkDeleteClick={handleBulkDelete}
        selectedRowCount={selectedRowKeys.length}
      />
      <Table/>
    </div>
  );
}