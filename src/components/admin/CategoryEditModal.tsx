'use client';
import InputField from '@/components/inputs/InputField';
import '@ant-design/v5-patch-for-react-19';
import { Button, Col, Modal, Row } from 'antd';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Category } from './CategoryTable';
interface CategoryEditModalProps {
  visible: boolean;
  onCancel: () => void;
  onEdit: (values: any) => void;
  loading: boolean;
  category: Category | null;
  serverError: string | null;
}

interface CategoryFormValues {
  name: string;
  slug: string;
  description?: string;
}

export function CategoryEditModal({
  visible,
  onCancel,
  onEdit,
  loading,
  category,
}: CategoryEditModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    mode: 'onChange',
  });

  useEffect(() => {
    if (category) {
      reset({
        name: category.name || '',
        slug: category.slug || '',
        description: category.description ?? '',
      });
    } else {
      reset();
    }
  }, [category, reset]);

  const onSubmit = (data: CategoryFormValues) => {
    onEdit(data);
  };

  return (
    <Modal
      title="Edit Category"
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
          style={{ marginRight: 8 }}
        >
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={handleSubmit(onSubmit)}
        >
          Update Category
        </Button>,
      ]}
      destroyOnHidden
      centered
      width="80vw"
      style={{ maxWidth: '800px', margin: '20px 0' }}
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
              register={register('description')}
              error={errors.description}
            />
          </Col>
        </Row>
      </form>
    </Modal>
  );
}
