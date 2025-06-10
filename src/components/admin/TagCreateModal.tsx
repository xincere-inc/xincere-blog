'use client';
import TagApi from '@/api/TagApi';
import InputField from '@/components/inputs/InputField';
import '@ant-design/v5-patch-for-react-19';
import { Alert, Button, Col, Modal, Row } from 'antd';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
interface TagCreateModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: (page: number, pageSize: number, search: string) => void; // Callback to refresh data
  pagination: { current: number; pageSize: number };
  searchText: string;
}

interface TagFormValues {
  name: string;
}

export function TagCreateModal({
  visible,
  onCancel,
  onSuccess,
  pagination,
  searchText,
}: TagCreateModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TagFormValues>({
    mode: 'onChange',
  });

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      reset();
      setServerError(null);
    }
  }, [visible, reset]);

  const createTag = async (values: TagFormValues) => {
    setLoading(true);
    try {
      const response = await TagApi.adminCreateTag({
        name: values.name,
      });

      if (response.status === 201) {
        toast.success(response.data.message || 'Tag created successfully', {
          position: 'bottom-right',
        });
        setServerError(null);
        reset();
        onCancel(); // Close modal
        onSuccess(1, pagination.pageSize, searchText); // Refresh data
      } else {
        toast.error(response.data.message || 'Failed to create tag', {
          position: 'bottom-right',
        });
      }
    } catch (error: any) {
      setServerError(error?.response?.data?.error || 'Error creating tag');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (data: TagFormValues) => {
    createTag(data);
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
          className="mr-2"
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
      className="w-80vw max-w-600 my-5"
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
              <Alert message={serverError} type="error" className="mt-2.5" />
            </Col>
          </Row>
        )}
      </form>
    </Modal>
  );
}
