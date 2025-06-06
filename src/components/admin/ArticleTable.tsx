'use client';
import { AdminGetArticles200Response } from "@/api/client";
import { Table } from 'antd';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { ArticleSearchBar } from './ArticleSearchBar';


export interface Article {
  id?: number;
  title?: string; //name?
  slug?: string;
  summary?: string; //description?
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
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const fetchData = async (page: number, pageSize: number, search: string) => {};

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