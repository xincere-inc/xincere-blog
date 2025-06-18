'use client';

import ApiCategory from '@/api/ApiCategory';
import InputField from '@/components/inputs/InputField';
import '@ant-design/v5-patch-for-react-19';
import { Alert, Button, Col, Modal, Row } from 'antd';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

interface CategoryFormValues {
  name: string;
  slug: string;
  description?: string;
}

interface CategoryCreateModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: (page: number, limit: number, search: string) => void; // Callback to refresh data
  pagination: { current: number; limit: number };
  searchText: string;
}

export function CategoryCreateModal({
  visible,
  onCancel,
  onSuccess,
  pagination,
  searchText,
}: CategoryCreateModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    mode: 'onChange',
  });
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      reset();
      setServerError(null);
    }
  }, [visible, reset]);

  const createCategory = async (values: CategoryFormValues) => {
    setLoading(true);
    try {
      const response = await ApiCategory.adminCreateCategory({
        name: values.name,
        slug: values.slug,
        description: values.description || '',
      });
      if (response.status === 201) {
        toast.success(
          response.data.message || 'Category created successfully',
          {
            position: 'bottom-right',
          }
        );
        setServerError(null);
        reset();
        onCancel(); // Close modal
        onSuccess(1, pagination.limit, searchText); // Refresh data
      } else {
        toast.error(response.data.message || 'Failed to create category', {
          position: 'bottom-right',
        });
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        'Error creating category';
      setServerError(errorMessage);
      toast.error(errorMessage, { position: 'bottom-right', autoClose: 3000 });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (data: CategoryFormValues) => {
    createCategory(data);
  };

  return (
    <Modal
      title="Create Category"
      open={visible}
      onCancel={() => {
        onCancel();
        reset();
      }}
      footer={[
        <Button
          key="cancel"
          onClick={() => {
            onCancel();
            reset();
          }}
          className="mr-2"
        >
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={handleSubmit(onSubmit)}
        >
          Create Category
        </Button>,
      ]}
      destroyOnHidden
      centered
      className="w-80vw max-w-800 my-5"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <InputField
              id="name"
              label="Name"
              placeholder="Category Name"
              register={register('name', {
                required: 'Category name is required',
                maxLength: {
                  value: 150,
                  message: 'Name must be at most 150 characters',
                },
              })}
              error={errors.name}
            />
          </Col>
          <Col xs={24} sm={12}>
            <InputField
              id="slug"
              label="Slug"
              placeholder="Category Slug"
              register={register('slug', {
                required: 'Slug is required',
                maxLength: {
                  value: 150,
                  message: 'Slug must be at most 150 characters',
                },
                pattern: {
                  value: /^[a-z0-9-]+$/i,
                  message:
                    'Slug must contain only alphanumeric characters and hyphens',
                },
              })}
              error={errors.slug}
            />
          </Col>
          <Col xs={24}>
            <InputField
              id="description"
              label="Description"
              inputType="textarea"
              placeholder="Optional description"
              register={register('description', {
                maxLength: {
                  value: 300,
                  message: 'Description must be at most 300 characters',
                },
              })}
              error={errors.description}
            />
          </Col>
        </Row>

        {serverError && (
          <Row>
            <Col xs={24}>
              <Alert message={serverError} type="error" className="mt-2.5" />
            </Col>
          </Row>
        )}
      </form>
    </Modal>
  );
}
