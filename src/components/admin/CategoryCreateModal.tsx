'use client';
import { Alert, Button, Col, Form, Input, Modal, Row } from 'antd';
import { useEffect } from 'react';

interface CategoryCreateModalProps {
  visible: boolean;
  onCancel: () => void;
  onCreate: (values: any) => void;
  loading: boolean;
  serverError: string | null;
  formRef: React.MutableRefObject<any>;
}

export function CategoryCreateModal({
  visible,
  onCancel,
  onCreate,
  loading,
  serverError,
  formRef,
}: CategoryCreateModalProps) {
  const [form] = Form.useForm();

  // Assign form instance to formRef for external control
  useEffect(() => {
    formRef.current = form;
  }, [form, formRef]);

  // Reset form when modal opens or closes
  useEffect(() => {
    if (visible) {
      form.resetFields();
    }
  }, [visible, form]);

  return (
    <Modal
      title="Create Category"
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
          Create Category
        </Button>,
      ]}
      destroyOnHidden
      centered
      width="80vw"
      style={{ maxWidth: '800px', margin: '20px 0' }}
    >
      <Form form={form} onFinish={onCreate} layout="vertical">
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
