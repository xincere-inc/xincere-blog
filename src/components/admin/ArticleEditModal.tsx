import { Alert, Button, Col, Form, Input, Modal, Row, Select } from 'antd';
import { useEffect } from 'react';
const { Option } = Select;

interface ArticleEditModalProps {
  visible: boolean;
  onCancel: () => void;
  onEdit: (values: any) => void;
  loading: boolean;
  article: any;
  serverError: string | null;
}

export function ArticleEditModal({
  visible,
  onCancel,
  onEdit,
  loading,
  article,
  serverError,
}: ArticleEditModalProps) {
  const [form] = Form.useForm();
  
  return (
    <Modal></Modal>
  );
}