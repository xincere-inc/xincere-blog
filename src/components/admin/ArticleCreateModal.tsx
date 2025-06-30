import {Alert, Button, Col, Form, FormInstance, Input, Modal, Row, Select, Radio } from 'antd';
import { useImperativeHandle } from 'react';

interface ArticleCreateModalProps {
  visible: boolean;
  onCancel: () => void;
  onCreate: (values: any) => void;
  loading: boolean;
  serverError?: string | null;
  formRef?: React.RefObject<FormInstance>;
  authors: { id: string; name: string }[];
  categories: { id: number; name: string }[];
  tags: string[];
}

export function ArticleCreateModal({
  visible,
  onCancel,
  onCreate,
  loading,
  serverError,
  formRef,
  authors = [],
  categories = [],
  tags = [],
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
      destroyOnHidden
      centered
      style={{ margin: '20px 0px' }}
    >
      <Form form={form} onFinish={onCreate} layout="vertical">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Title" name="title" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Slug" name="slug" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Author"
              name="authorId"
              rules={[{ required: true }]}
            >
              <Select placeholder="Select an author">
                {authors.map((author) => (
                  <Select.Option key={author.id} value={author.id}>
                    {author.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Category"
              name="categoryId"
              rules={[{ required: true }]}
            >
              <Select placeholder="Select a category">
                {categories.map((category) => (
                  <Select.Option key={category.id} value={category.id}>
                    {category.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="Summary" name="summary" rules={[{ required: true }]}>
          <Input.TextArea />
        </Form.Item>

        <Form.Item
          label="Markdown Content"
          name="markdownContent"
          rules={[{ required: true }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item label="Thumbnail Image" name="thumbnailUrl">
          <Input type="url" placeholder="https://example.com/image.png" />
        </Form.Item>

        <Form.Item label="Status" name="status" rules={[{ required: true }]}>
          <Radio.Group>
            <Radio value="DRAFT">Draft</Radio>
            <Radio value="PUBLISHED">Published</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item label="Tags" name="tags">
          <Select
            mode="tags"
            style={{ width: '100%' }}
            placeholder="Enter or select tags"
            options={tags.map(tag => ({ label: tag, value: tag }))}
          />
        </Form.Item>

        <Button type="primary" htmlType="submit" loading={loading}>
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
