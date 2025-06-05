'use client';
import { Alert, Button, Col, Form, Input, Modal, Row } from 'antd';
import { useEffect } from 'react';
import { Tag } from './TagTable';

interface TagEditModalProps {
  visible: boolean;
  onCancel: () => void;
  onEdit: (values: any) => void;
  loading: boolean;
  tag: Tag | null;
  serverError: string | null;
}

export function TagEditModal({
  visible,
  onCancel,
  onEdit,
  loading,
  tag,
  serverError,
}: TagEditModalProps) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (tag) {
      const formValues = {
        name: tag.name || '',
      };
      form.setFieldsValue(formValues);
    } else {
      form.resetFields();
    }
  }, [tag, form]);

  return (
    <Modal
      title="Edit Tag"
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
          Update Tag
        </Button>,
      ]}
      destroyOnHidden
      centered
      width="80vw" // Responsive width
      style={{ maxWidth: '600px', margin: '20px 0' }}
    >
      <Form form={form} onFinish={onEdit} layout="vertical">
        <Row>
          <Col xs={24}>
            <Form.Item
              label="Name"
              name="name"
              rules={[
                { required: true, message: 'Please input the tag name!' },
                { max: 100, message: 'Name must be at most 100 characters' },
              ]}
            >
              <Input />
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
