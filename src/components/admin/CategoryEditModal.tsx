'use client';
import { Alert, Button, Col, Form, Input, Modal, Row } from 'antd';
import { useEffect } from 'react';
import { Category } from './CategoryTable';

interface CategoryEditModalProps {
  visible: boolean;
  onCancel: () => void;
  onEdit: (values: any) => void;
  loading: boolean;
  category: Category | null;
  serverError: string | null;
}

export function CategoryEditModal({
  visible,
  onCancel,
  onEdit,
  loading,
  category,
  serverError,
}: CategoryEditModalProps) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (category) {
      const formValues = {
        name: category.name || '',
        slug: category.slug || '',
        description: category.description ?? '',
      };
      form.setFieldsValue(formValues);
    } else {
      form.resetFields();
    }
  }, [category, form]);

  return (
    <Modal
      title="Edit Category"
      open={visible}
      onCancel={() => {
        onCancel();
        form.resetFields();
      }}
      footer={[
        <Button
          key="cancel"
          onClick={() => {
            onCancel();
            form.resetFields();
          }}
          style={{ marginRight: 8 }}
        >
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={() => form.submit()}
        >
          Update Category
        </Button>,
      ]}
      destroyOnHidden
      centered
      width="80vw" // Responsive width
      style={{ maxWidth: '800px', margin: '20px 0' }}
    >
      <Form form={form} onFinish={onEdit} layout="vertical">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Name"
              name="name"
              rules={[
                { required: true, message: 'Please input the category name!' },
                { max: 150, message: 'Name must be at most 150 characters' },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Slug"
              name="slug"
              rules={[
                { required: true, message: 'Please input the slug!' },
                { max: 150, message: 'Slug must be at most 150 characters' },
                {
                  pattern: /^[a-z0-9-]+$/i,
                  message:
                    'Slug must contain only alphanumeric characters and hyphens',
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24}>
            <Form.Item
              label="Description"
              name="description"
              rules={[
                {
                  max: 300,
                  message: 'Description must be at most 300 characters',
                },
              ]}
            >
              <Input.TextArea rows={4} />
            </Form.Item>
          </Col>
        </Row>

        <Row>
          <Col xs={24}>
            {serverError && (
              <Alert
                message={serverError}
                type="error"
                style={{ marginTop: '10px' }}
              />
            )}
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}
