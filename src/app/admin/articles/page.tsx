'use client'
import { 
  AdminCreateCategory201ResponseCategory,
  AdminGetArticles200ResponseDataInner,
} from "@/api/client";
import ApiAdminArticles from "@/api/ApiAdminArticles";
import ApiAdminCategory from "@/api/ApiAdminCategory";
import ApiAdminAuthors from "@/api/ApiAdminAuthors";
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
  authorId?: string;
  title?: string;
  category?: string;
  categoryId?: number;
  slug?: string;
  summary?: string;
  content?: string;
  thumbnailUrl: any;
  status?: string;
  tags?: string[];
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
  const [tags, setTags] = useState<string[]>([]);

  const fetchData = async (page: number, pageSize: number, search: string) => {
    setLoading(true);
    try {
      const response = await ApiAdminArticles.adminGetArticles({
        page,
        limit: pageSize,
        search,
      });
      
      if (response.status === 200) {
        const articles = 
          response.data?.data?.map(
            (article: AdminGetArticles200ResponseDataInner) => ({
              id: article.id || 0,
              title: article.title || '',
              slug: article.slug || '',
              summary: article.summary || '',
              status: article.status || '',
              content: article.content || '', // if needed for markdownContent
              thumbnailUrl: article.thumbnailUrl || '',
              author: article.author?.name || '',
              authorId: article.author?.id || null, // ✅ NEW
              category: article.category?.name || '',
              categoryId: article.category?.id || null, // ✅ NEW
              tags: Array.isArray(article.tags) ? article.tags : [], // ✅ array, not joined string
              createdAt: article.createdAt,
              updatedAt: article.updatedAt,
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

  const deleteArticle = async (ids: number[]) => {
    setSelectedRowKeys([]);
    try {
      const response = await ApiAdminArticles.adminDeleteArticles({
        articleIds: ids
      });
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
      deleteArticle([record.id]);
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
      deleteArticle(selectedRowKeys as number[]);
    } else {
      toast.error('No article selected.', { position: 'bottom-right' });
    }
  };

  const fetchAuthors = async () => {
    try {
      const response = await ApiAdminAuthors.adminGetAuthors({
        page: 1,
        limit: 100,
        search: ''
      });

      if (response.status === 200) {
        const authorsData = response.data?.data ?? [];
        const formatted = authorsData.map((author) => ({
          id: author.id,
          name: author.name,
        }));
        setAuthors(formatted);
      }
    } catch (error: any) {
      console.error('Failed to fetch authors', error);
      toast.error(error.response?.data?.message || 'Error fetching authors', {
        position: 'bottom-right',
      });
    }
  };


  const fetchCategories = async () => {
    try {
      const response = await ApiAdminCategory.adminGetCategories(
        1,
        100
      );
      console.log('fetch categories', response);
      if (response.status === 200) {
        const categories =
          response.data?.data?.map(
            (category: AdminCreateCategory201ResponseCategory) => ({
              id: category.id || 0,
              name: category.name || '',
            })
          ) || [];
        setCategories(categories);
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

  const fetchTags = async () => {
    try {
      const res = await fetch('/api/admin/tags/get-tags?page=1&limit=1000');
      const result = await res.json();
      const tagNames = result?.data?.map((tag: { name: string }) => tag.name) || [];
      setTags(tagNames);
    } catch (error) {
      console.error('Failed to fetch tags', error);
    }
  };

  useEffect(() => {
    fetchAuthors();
    fetchCategories();
    fetchTags();
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
        tags={tags}
      />
      <ArticleEditModal
        visible={isEditModalVisible}
        onCancel={handleCancelEditModal}
        onEdit={updateArticle}
        loading={loading}
        article={article}
        serverError={serverError} 
        authors={authors}
        categories={categories}
        tags={tags}
      />
    </div>
  );
}
