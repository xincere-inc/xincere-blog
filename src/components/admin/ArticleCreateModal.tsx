import {
  Alert,
  Button,
  Col,
  Form,
  FormInstance,
  Input,
  Modal,
  Row,
  Select,
  Radio,
  Upload,
  message,
} from 'antd';
import { useImperativeHandle } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import ReactMarkdownEditorLite from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import { marked } from 'marked';

interface ArticleCreateModalProps {
  visible: boolean;
  onCancel: () => void;
  onCreate: (values: any) => void;
  loading: boolean;
  serverError?: string | null;
  formRef?: React.RefObject<FormInstance>;
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
  categories = [],
  tags = [],
}: ArticleCreateModalProps) {
  const [form] = Form.useForm();
  useImperativeHandle(formRef, () => form);

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
            renderHTML={(text) => marked(text)}
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
          Create Article
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
