`use client`;
import { AdminGetArticles200Response } from "@/api/client";
import IdoAdminUsers from "@/api/IdoAdminUsers";


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
    
    const fetchData = async (page: number, pageSize: number, search: string) => {};

    const deleteArticle = async (ids: string[]) => {};

    const createArticle = async (values: any) => {};

    const updateArticle = async (values: any) => {};

    return (
        <div className="p-4"></div>
    );
}