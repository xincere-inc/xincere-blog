import {Alert, Button, Col, Form, FormInstance, Input, Modal, Row, Select} from 'antd';
import { useImperativeHandle } from 'react';
const { Option } = Select;

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
    <Modal></Modal>
  );

}