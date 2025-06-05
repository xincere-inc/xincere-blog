'use client';
import { Alert, Button, Col, Form, Input, Modal, Row } from 'antd';
import { useEffect } from 'react';

interface TagCreateModalProps {
  visible: boolean;
  onCancel: () => void;
  onCreate: (values: any) => void;
  loading: boolean;
  serverError: string | null;
  formRef: React.MutableRefObject<any>;
}

export function TagCreateModal({
  visible,
  onCancel,
  onCreate,
  loading,
  serverError,
  formRef,
}: TagCreateModalProps) {
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
      title="Create Tag"
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
          Create Tag
        </Button>,
      ]}
      destroyOnHidden
      centered
      width="80vw"
      style={{ maxWidth: '600px', margin: '20px 0' }}
    >
      <Form form={form} onFinish={onCreate} layout="vertical">
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
