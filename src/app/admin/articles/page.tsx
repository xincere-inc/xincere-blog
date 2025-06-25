'use client'
import { AdminGetArticles200ResponseDataInner } from "@/api/client";
import ApiAdminArticles from "@/api/ApiAdminArticles";
import { Table } from "antd";
import { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import { ArticleSearchBar } from "@/components/admin/ArticleSearchBar";
import { ArticleSelection } from "@/components/admin/ArticleSelection";
import { ArticleActions } from "@/components/admin/ArticleActions";
import { ArticleCreateModal } from "@/components/admin/ArticleCreateModal";
import { ArticleEditModal } from "@/components/admin/ArticleEditModal";
import { marked } from 'marked';

export interface Article {
  id?: number;
  author?: string;
  title?: string;
  category?: string;
  slug?: string;
  summary?: string;
  content?: string;
  thumbnailUrl: any;
  status?: string;
  tags?: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
}

export default function ArticleTable() {
  const [searchText, setSearchText] = useState('');
  const [data, setData] = useState<Article[]>([]);
  const [serverError, setServerError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total:0
  });
  const createFormRef = useRef<any>(null);
  const [loading, setLoading] = useState(false)
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [article, setArticle] = useState<Article | null>(null);
  const [authors, setAuthors] = useState<{ id: string; name: string }[]>([]);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);

  const fetchData = async (page: number, pageSize: number, search: string) => {
    setLoading(true);
    console.log('Get Article before fetch');
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
              id: article.id || 0,
              author: article.author?.name || '',
              title: article.title || '',
              category: article.category?.name || '',
              slug: article.slug || '',
              summary: article.summary || '',
              status: article.status || '',
              tags: Array.isArray(article.tags) ? article.tags.join(', ') : article.tags || '',
              thumbnailUrl: article.thumbnailUrl || ''
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

  const deleteArticle = async (ids: string[]) => {
    setSelectedRowKeys([]);
    try {
      const response = await ApiAdminArticles.adminDeleteArticles({ids});
      if (response.status !== 200) {
        toast.error(response?.data?.message || 'Failed to delete Article data.', {
          position: 'bottom-right',
        });
      } else {
        fetchData(pagination.current, pagination.pageSize, searchText);
        toast.success(response?.data?.message, { position: 'bottom-right' });
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error deleting Article(s).', {
        position: 'bottom-right',
        autoClose: 3000,
      });
    }
  };

  const createArticle = async (values: any) => {
    setLoading(true);
    try {
      const htmlContent: string = await marked(values.markdownContent || '');
      const response = await ApiAdminArticles.adminCreateArticle({
        authorId: values.authorId,
        categoryId: values.categoryId,
        title: values.title,
        slug: values.slug,
        summary: values.summary,
        content: htmlContent,
        markdownContent: values.markdownContent,
        thumbnailUrl: values.thumbnailUrl,
        status: values.status,
        tags: values.tags,
      });

      if (response.status === 201) {
        toast.success(response.data.message || 'Article created successfully', {
          position: 'bottom-right',
        });
        fetchData(pagination.current, pagination.pageSize, searchText);
        setIsCreateModalVisible(false);
        setServerError(null);
        createFormRef.current?.resetFields();
      } else {
        toast.error(response.data.message || 'Failed to create article', {
          position: 'bottom-right',
        });
      }
    } catch (error: any) {
       console.error("Create Article Error:", error);
      setServerError(error?.response?.data?.error || 'Error creating article');
    } finally {
      setLoading(false);
    }
  };

  const updateArticle = async (values: any) => {
    if (article?.id) {
      setLoading(true);
      try {
        // TODO: update supporting factory
        const response = await ApiAdminArticles.adminUpdateArticle({
          id: article.id,
          ...values,
        });

        if(response.status === 200) {
          toast.success('Article updated successfully', {
            position: 'bottom-right',
          });
          setServerError(null);
          setIsEditModalVisible(false);
          fetchData(pagination.current, pagination.pageSize, searchText);
        } else {
          toast.error('Failed to update article', { position: 'bottom-right' });
        }
      } catch (error: any) {
        setServerError(error?.response?.data?.error || 'Error updating article');
      } finally {
        setLoading(false);
      }
    }
  };

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
    setIsEditModalVisible(true);
  };

  const handleCancelEditModal = () => {
    setIsEditModalVisible(false);
    setServerError(null);
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

  const fetchAuthors = async () => {
    try {
      // TODO update based on actual API
      // const response = await ApiAdminArticles.adminGetAuthors(); 
      const response = {
        status: 200,
        data: {
          data: [
            { id: '1', name: 'John Doe' },
            { id: '2', name: 'Jane Smith' },
            { id: '3', name: 'Alice Johnson' },
          ],
        },
      };
      if (response.status === 200) {
        setAuthors(response.data.data); // assumes the data is an array of { id, name }
      }
    } catch (error) {
      console.error('Failed to fetch authors', error);
    }
  };

  const fetchCategories = async () => {
    try {
      // TODO update based on actual API
      // const response = await ApiAdminArticles.adminGetCategories(); 
      const response = {
        status: 200,
        data: {
          data: [
            { id: 1, name: 'Tech' },
            { id: 2, name: 'Lifestyle' },
            { id: 3, name: 'Education' },
          ],
        },
      };

      if (response.status === 200) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch categories", error);
    }
  };

  useEffect(() => {
    fetchAuthors();
    fetchCategories();
    fetchData(pagination.current, pagination.pageSize, searchText);
  }, [pagination.current, pagination.pageSize, searchText]);

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
        className="w-full"
      />
      <ArticleCreateModal
        visible={isCreateModalVisible}
        onCancel={() => {
          setIsCreateModalVisible(false);
          setServerError(null);
        }}
        onCreate={createArticle}
        loading={loading}
        serverError={serverError}
        formRef={createFormRef}
        authors={authors}
        categories={categories}
      />
      <ArticleEditModal
        visible={isEditModalVisible}
        onCancel={handleCancelEditModal}
        onEdit={updateArticle}
        loading={loading}
        article={article}
        serverError={serverError} authors={[]} categories={[]}
      />
    </div>
  );
}
