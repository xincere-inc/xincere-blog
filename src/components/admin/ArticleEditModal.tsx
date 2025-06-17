import {
  Alert,
  Button,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Radio,
} from 'antd';
import { useEffect } from 'react';
import { Article } from '@/app/admin/articles/page';

interface ArticleEditModalProps {
  visible: boolean;
  onCancel: () => void;
  onEdit: (values: any) => void;
  loading: boolean;
  serverError?: string | null;
  article: Article | null;
  authors: { id: string; name: string }[];
  categories: { id: number; name: string }[];
}

export function ArticleEditModal({
  visible,
  onCancel,
  onEdit,
  loading,
  serverError,
  article,
  authors = [],
  categories = [],
}: ArticleEditModalProps) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible && article) {
      form.setFieldsValue({
        title: article.title,
        slug: article.slug,
        summary: article.summary,
        markdownContent: article.content,
        thumbnailUrl: article.thumbnailUrl,
        status: article.status,
        tags: article.tags?.split(',').map((tag) => tag.trim()) || [],
        authorId: (article as any).authorId,
        categoryId: (article as any).categoryId,
      });
    }
  }, [visible, article, form]);

  return (
    <Modal
      title="Edit Article"
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
      <Form form={form} onFinish={onEdit} layout="vertical">
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
            <Form.Item label="Author" name="authorId" rules={[{ required: true }]}>
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
            <Form.Item label="Category" name="categoryId" rules={[{ required: true }]}>
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
          <Select mode="tags" style={{ width: '100%' }} placeholder="Enter tags" />
        </Form.Item>

        <Button type="primary" htmlType="submit" loading={loading}>
          Update Article
        </Button>

        {serverError && (
          <Row style={{ marginTop: 10 }}>
            <Col span={24}>
              <Alert message={serverError} type="error" />
            </Col>
          </Row>
        )}
      </Form>
    </Modal>
  );
}
