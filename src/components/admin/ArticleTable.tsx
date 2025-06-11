'use client';
import { AdminGetArticles200ResponseDataInner } from '@/api/client';
import ApiAdminArticles from '@/api/ApiAdminArticles';
import { Table } from 'antd';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { ArticleSearchBar } from './ArticleSearchBar';
import { ArticleSelection } from './ArticleSelection';
import { ArticleActions } from './ArticleActions';


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
  const [article, setArticle] = useState<Article | null>(null);

  const fetchData = async (page: number, pageSize: number, search: string) => {
    setLoading(true);
    try {
      const response = await ApiAdminArticles.adminGetArticles({
        page,
        limit: pageSize,
        search,
      });
      console.log('get article:', response);
      
      if (response.status === 200) {
        const articles = 
          response.data?.data?.map(
            (article: AdminGetArticles200ResponseDataInner) => ({
              ...article,
              id: article.id || '',
              author: article.author?.name || '',
              title: article.title || '',
              category: article.category?.name || '',
              slug: article.slug || '',
              summary: article.summary || '',
              status: article.status || '',
              tags: article.tags || ''
            })
          ) || [];

        setData(articles);
        setPagination((prev) => ({
          ...prev,
          total: response.data?.pagination?.totalArticles || 0,
        }));
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

  const deleteArticle = async (ids: string[]) => {};

  const createArticle = async (values: any) => {};

  const updateArticle = async (values: any) => {};

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const handleTableChange = (pagination: any) => {
    setPagination(pagination);
    fetchData(pagination.current, pagination.pageSize, searchText);
  };

  const handleEdit = (record: Article) => {
    setArticle({ ...record});
    // setIsEditModalVisible(true);
  };

  const handleDelete = (record: Article) => {
    if(record.id) {
      deleteArticle([record.id.toString()]);
    }
  };

  const columns = [
    {
      title: 'Select',
      key: 'select',
      render: (_: any, record: Article) => (
        <ArticleSelection
          record={record}
          selectedRowKeys={selectedRowKeys}
          onSelectChange={handleSearchChange}
        />
      ),
    },
    { title: 'Title', dataIndex: 'title', key: 'title' },
    { title: 'Author', dataIndex: 'author', key: 'author' },
    { title: 'Summary', dataIndex: 'summary', key: 'summary' },
    { title: 'Category', dataIndex: 'category', key: 'category' },
    { title: 'Slug', dataIndex: 'slug', key: 'slug' },
    { title: 'Status', dataIndex: 'status', key: 'status' },
    { title: 'Tags', dataIndex: 'tags', key: 'tags' },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: Article) => (
        <ArticleActions
          record={record}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ),
    },
  ];

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

    </div>
  );
}