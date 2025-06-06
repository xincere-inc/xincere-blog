'use client';
import InputField from '@/components/inputs/InputField';
import '@ant-design/v5-patch-for-react-19';
import { Button, Col, Modal, Row } from 'antd';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
interface TagCreateModalProps {
  visible: boolean;
  onCancel: () => void;
  onCreate: (values: TagFormValues) => void;
  loading: boolean;
  serverError: string | null;
}

interface TagFormValues {
  name: string;
}

export function TagCreateModal({
  visible,
  onCancel,
  onCreate,
  loading,
  serverError,
}: TagCreateModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TagFormValues>({
    mode: 'onChange',
  });

  // Reset form when modal opens or closes
  useEffect(() => {
    if (visible) {
      reset();
    }
  }, [visible, reset]);

  const onSubmit = (data: TagFormValues) => {
    onCreate(data);
  };

  return (
    <Modal
      title="Create Tag"
      open={visible}
      onCancel={() => {
        onCancel();
        reset();
      }}
      footer={[
        <Button
          key="cancel"
          onClick={() => {
            onCancel();
            reset();
          }}
          style={{ marginRight: 8 }}
        >
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={handleSubmit(onSubmit)}
        >
          Create Tag
        </Button>,
      ]}
      destroyOnHidden
      centered
      width="80vw"
      style={{ maxWidth: '600px', margin: '20px 0' }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Row gutter={[16, 16]}>
          <Col xs={24}>
            <InputField
              id="name"
              label="Name"
              placeholder="Tag Name"
              register={register('name', {
                required: 'Tag name is required',
                maxLength: {
                  value: 100,
                  message: 'Name must be at most 100 characters',
                },
              })}
              error={errors.name}
            />
          </Col>
        </Row>

        {serverError && (
          <Row>
            <Col xs={24}>
              <div
                style={{
                  color: 'red',
                  marginTop: '10px',
                  fontSize: '14px',
                }}
              >
                {serverError}
              </div>
            </Col>
          </Row>
        )}
      </form>
    </Modal>
  );
}
