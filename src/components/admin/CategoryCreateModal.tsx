'use client';

import InputField from '@/components/inputs/InputField';
import { Alert, Button, Col, Modal, Row } from 'antd';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

interface CategoryFormValues {
  name: string;
  slug: string;
  description?: string;
}

interface CategoryCreateModalProps {
  visible: boolean;
  onCancel: () => void;
  onCreate: (values: CategoryFormValues) => void;
  loading: boolean;
  serverError: string | null;
}

export function CategoryCreateModal({
  visible,
  onCancel,
  onCreate,
  loading,
  serverError,
}: CategoryCreateModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    mode: 'onChange',
  });

  useEffect(() => {
    if (visible) {
      reset();
    }
  }, [visible, reset]);

  const onSubmit = (data: CategoryFormValues) => {
    onCreate(data);
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
          Create Category
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
              <Alert
                message={serverError}
                type="error"
                style={{ marginTop: '10px' }}
              />
            </Col>
          </Row>
        )}
      </form>
    </Modal>
  );
}
