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
  Upload,
  message,
} from 'antd';
import { useEffect } from 'react';
import { Article } from '@/app/admin/articles/page';
import { UploadOutlined } from '@ant-design/icons';
import ReactMarkdownEditorLite from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import { marked } from 'marked';

interface ArticleEditModalProps {
  visible: boolean;
  onCancel: () => void;
  onEdit: (values: any) => void;
  loading: boolean;
  serverError?: string | null;
  article: Article | null;
  authors: { id: string; name: string }[];
  categories: { id: number; name: string }[];
  tags: string[];
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
  tags = [],
}: ArticleEditModalProps) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible && article) {
      // Delay setting values to ensure ReactMarkdownEditorLite mounts first
      setTimeout(() => {
        form.setFieldsValue({
          title: article.title,
          slug: article.slug,
          summary: article.summary,
          markdownContent: article.markdownContent || '',
          content: article.content || '',
          thumbnailUrl: article.thumbnailUrl,
          status: article.status,
          tags: article.tags || [],
          authorId: article.authorId,
          categoryId: article.categoryId,
        });
      }, 0);
    }
  }, [visible, article, form]);

  const handleEditorChange = ({ text, html }: { text: string; html: string }) => {
    form.setFieldsValue({
      markdownContent: text,
      content: html,
    });
  };

  const handleThumbnailUpload = async ({ file, onSuccess, onError }: any) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/admin/uploads/article-thumbnail', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Upload failed');
      form.setFieldsValue({ thumbnailUrl: data.url });
      onSuccess?.(data, file);
    } catch (error: any) {
      onError?.(error);
      message.error('Failed to upload thumbnail.');
    }
  };

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

        <Form.Item label="Summary" name="summary" rules={[{ required: true }]}>
          <Input.TextArea />
        </Form.Item>

        <Form.Item
          label="Markdown Content"
          name="markdownContent"
          rules={[{ required: true }]}
        >
          <ReactMarkdownEditorLite
            style={{ height: 300 }}
            value={form.getFieldValue('markdownContent') || ''}
            renderHTML={(content) => marked(content)}
            onChange={handleEditorChange}
          />
        </Form.Item>

        <Form.Item name="content" hidden />

        <Form.Item label="Thumbnail Image" name="thumbnailUrl">
          <Upload
            name="file"
            listType="picture"
            showUploadList={false}
            customRequest={handleThumbnailUpload}
          >
            <Button icon={<UploadOutlined />}>Upload Thumbnail</Button>
          </Upload>
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
            options={tags.map((tag) => ({ label: tag, value: tag }))}
          />
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
