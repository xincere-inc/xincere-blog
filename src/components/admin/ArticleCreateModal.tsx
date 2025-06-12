import {Alert, Button, Col, Form, FormInstance, Input, Modal, Row} from 'antd';
import { useImperativeHandle } from 'react';

interface ArticleCreateModalProps {
  visible: boolean;
  onCancel: () => void;
  onCreate: (values: any) => void;
  loading: boolean;
  serverError?: string | null;
  formRef?: React.RefObject<FormInstance>;
}

export function ArticleCreateModal({
  visible,
  onCancel,
  onCreate,
  loading,
  serverError,
  formRef,
}: ArticleCreateModalProps) {
  const [form] = Form.useForm();
  useImperativeHandle(formRef, () => form);

  return (
    <Modal
      title="Create Article"
      open={visible}
      onCancel={() => {
        onCancel();
        form.resetFields();
      }}
      footer={null}
      destroyOnClose
      centered
      style={{ margin: '20px 0px' }}
    >
      <Form form={form} onFinish={onCreate} layout="vertical">
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Title"
              name="title"
              rules={[
                { required: true, message: 'Please input Article Title!' },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Author"
              name="author"
              rules={[
                { required: true, message: 'Please input Author!' },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Category"
              name="category"
              rules={[
                { required: true, message: 'Please input the category' },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label="Slug" name="slug">
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Summary"
              name="summary"
            >
            </Form.Item>
          </Col>
        </Row>

        <Button
          className="form-btn"
          type="primary"
          htmlType="submit"
          loading={loading}
        >
          Create Article
        </Button>
        <Row>
          <Col span={24}>
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