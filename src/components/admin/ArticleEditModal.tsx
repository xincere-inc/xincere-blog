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
import { useEffect, useState } from 'react';
import { Article } from '@/app/admin/articles/page';
import { UploadOutlined } from '@ant-design/icons';
import MarkdownEditor from '@uiw/react-markdown-editor';
import { marked } from 'marked';

interface ArticleEditModalProps {
  visible: boolean;
  onCancel: () => void;
  onEdit: (values: any) => void;
  loading: boolean;
  serverError?: string | null;
  article: Article | null;
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
  categories = [],
  tags = [],
}: ArticleEditModalProps) {
  const [form] = Form.useForm();
  const [thumbnailUrl, setThumbnailUrl] = useState<string>('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (visible && article) {
      // モーダルが表示され、記事データがある場合は初期値をセット
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

        // 既存のサムネイルURLをステートにセット
        setThumbnailUrl(article.thumbnailUrl || '');
      }, 0);
    }
  }, [visible, article, form]);

  const handleEditorChange = (value: string) => {
    form.setFieldsValue({
      markdownContent: value,
      content: marked(value),
    });
  };

  const handleThumbnailUpload = async ({ file, onSuccess, onError }: any) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/admin/uploads/article-images', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Upload failed');

      setThumbnailUrl(data.url);
      form.setFieldsValue({ thumbnailUrl: data.url });

      message.success('Thumbnail uploaded successfully');
      onSuccess?.(data, file);
    } catch (error: any) {
      console.error('Upload error:', error);
      onError?.(error);
      message.error('Failed to upload thumbnail.');
    } finally {
      setUploading(false);
    }
  };

  // サブミット前に値を整形するハンドラを追加
  const handleSubmit = (values: any) => {
    const formattedValues = {
      ...values,
      thumbnailUrl:
        typeof values.thumbnailUrl === 'object' &&
        values.thumbnailUrl?.response?.url
          ? values.thumbnailUrl.response.url
          : thumbnailUrl || values.thumbnailUrl,
    };

    console.log('Submitting form with values:', formattedValues); // デバッグ用ログ

    onEdit(formattedValues);
  };

  return (
    <Modal
      title="Edit Article"
      open={visible}
      onCancel={() => {
        onCancel();
        form.resetFields();
        setThumbnailUrl('');
      }}
      footer={[
        <Button
          key="cancel"
          onClick={() => {
            onCancel();
            form.resetFields();
            setThumbnailUrl('');
          }}
          className="mr-2"
        >
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          htmlType="submit"
          loading={loading}
          onClick={() => form.submit()}
        >
          Update Article
        </Button>,
      ]}
      destroyOnHidden
      centered
      closable={false}
      width={800}
    >
      <Form form={form} onFinish={handleSubmit} layout="vertical">
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
          <MarkdownEditor
            height="300px"
            value={form.getFieldValue('markdownContent') || ''}
            onChange={handleEditorChange}
          />
        </Form.Item>

        <Form.Item name="content" hidden />

        <Form.Item label="Thumbnail Image" name="thumbnailUrl">
          <div>
            <Upload
              name="file"
              listType="picture"
              showUploadList={true}
              customRequest={handleThumbnailUpload}
              maxCount={1}
            >
              <Button icon={<UploadOutlined />} loading={uploading}>
                Upload Thumbnail
              </Button>
            </Upload>

            {/* サムネイルプレビュー表示 */}
            {thumbnailUrl && (
              <div style={{ marginTop: '8px' }}>
                <img
                  src={thumbnailUrl}
                  alt="Thumbnail preview"
                  style={{ maxWidth: '100%', maxHeight: '150px' }}
                />
              </div>
            )}
          </div>
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
