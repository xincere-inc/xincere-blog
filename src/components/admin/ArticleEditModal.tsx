import {
  Alert,
  Button,
  Col,
  Form,
  Input,
  Modal,
  Radio,
  Row,
  Select,
  Upload,
  message,
  Image,
} from 'antd';
import { marked } from 'marked';
import { useEffect, useState, useRef } from 'react';
import MarkdownEditor, { ICommand } from '@uiw/react-markdown-editor';
import { Article } from '@/app/admin/articles/page';
import { UploadOutlined } from '@ant-design/icons';
import { getMarkdownToolbarCommands } from '@/lib/utils/markdown-editor-config';

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
  const editorRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (visible && article) {
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

  const handleImageUpload = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/admin/uploads/article-images', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Image upload failed');
      }

      return data.url;
    } catch (error) {
      console.error('Image upload error:', error);
      message.error('Failed to upload image.');
      return '';
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const url = await handleImageUpload(file);

      if (url && editorRef.current && editorRef.current.editor) {
        const { view } = editorRef.current.editor.current;
        if (view) {
          const { state, dispatch } = view;
          const { from, to } = state.selection.main;
          dispatch(
            state.update({
              changes: { from, to, insert: `![](${url})` },
              selection: { anchor: from + 2 },
            })
          );
        }
      }
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  const imageCommand: ICommand = {
    name: 'image',
    keyCommand: 'image',
    button: { 'aria-label': 'Insert image' },
    icon: (
      <svg width="12" height="12" viewBox="0 0 20 20">
        <path
          fill="currentColor"
          d="M15.25 15.25H4.75a.75.75 0 0 1-.75-.75V5.5a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 .75.75v9a.75.75 0 0 1-.75.75zM4.75 4a2.25 2.25 0 0 0-2.25 2.25v9A2.25 2.25 0 0 0 4.75 17.5h10.5A2.25 2.25 0 0 0 17.5 15.25V5.5A2.25 2.25 0 0 0 15.25 4H4.75z"
        />
        <path
          fill="currentColor"
          d="M6.5 8.5a1 1 0 1 1-2 0a1 1 0 0 1 2 0zM15.25 12.414l-3.558-3.557a.75.75 0 0 0-1.06 0L6.87 12.62a.75.75 0 0 1-1.12.002l-.75-.75a.75.75 0 0 0-1.06 1.06l1.28 1.28a.75.75 0 0 0 1.06 0l3.766-3.765a.75.75 0 0 1 1.06 0l3.56 3.558a.75.75 0 1 0 1.06-1.06z"
        />
      </svg>
    ),
    execute: () => {
      fileInputRef.current?.click();
    },
  };

  const handleThumbnailUpload = async ({ file, onSuccess, onError }: any) => {
    setUploading(true);
    try {
      const url = await handleImageUpload(file);
      if (url) {
        setThumbnailUrl(url);
        form.setFieldsValue({ thumbnailUrl: url });
        message.success('Thumbnail uploaded successfully');
        onSuccess?.({ url }, file);
      } else {
        throw new Error('Upload failed');
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      onError?.(error);
      message.error('Failed to upload thumbnail.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (values: any) => {
    const formattedValues = {
      ...values,
      thumbnailUrl:
        typeof values.thumbnailUrl === 'object' &&
        values.thumbnailUrl?.response?.url
          ? values.thumbnailUrl.response.url
          : thumbnailUrl || values.thumbnailUrl,
    };

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
            ref={editorRef}
            height="300px"
            visible={true}
            onChange={handleEditorChange}
            toolbars={getMarkdownToolbarCommands([imageCommand])}
            previewProps={{ className: 'markdown-body' }}
          />
        </Form.Item>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}
          accept="image/*"
        />

        <Form.Item
          label="Thumbnail Image"
          name="thumbnailUrl"
          rules={[
            { required: true, message: 'Please upload a thumbnail image.' },
          ]}
        >
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

            {thumbnailUrl && (
              <div style={{ marginTop: '8px' }}>
                <Image
                  src={thumbnailUrl}
                  alt="Thumbnail preview"
                  width={500}
                  height={500}
                  style={{ borderRadius: '8px', marginBottom: '8px' }}
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
