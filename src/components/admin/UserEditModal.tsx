import { Alert, Button, Col, Form, Input, Modal, Row, Select } from 'antd';
import { useEffect } from 'react';
const { Option } = Select;

interface UserEditModalProps {
  visible: boolean;
  onCancel: () => void;
  onEdit: (values: any) => void;
  loading: boolean;
  user: any;
  serverError: string | null;
}

export function UserEditModal({
  visible,
  onCancel,
  onEdit,
  loading,
  user,
  serverError,
}: UserEditModalProps) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (user) {
      form.setFieldsValue(user);
    } else {
      form.resetFields();
    }
  }, [user, form]);

  return (
    <Modal
      title="Edit User"
      open={visible}
      onCancel={() => {
        onCancel();
        form.resetFields();
      }}
      footer={null}
      destroyOnHidden
      centered
      className="my-5"
      width={800}
    >
      <Form
        form={form}
        onFinish={onEdit}
        layout="vertical"
        initialValues={user}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="First Name"
              name="firstName"
              rules={[
                { required: true, message: 'Please input the first name!' },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Last Name"
              name="lastName"
              rules={[
                { required: true, message: 'Please input the last name!' },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: 'Please input the email!' },
                { type: 'email', message: 'Invalid email format!' },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Phone"
              name="phone"
              rules={[
                { required: true, message: 'Please input the phone number!' },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Country"
              name="country"
              rules={[{ required: true, message: 'Please input the country!' }]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Address" name="address">
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Role"
              name="role"
              rules={[{ required: true, message: 'Please select the role!' }]}
            >
              <Select>
                <Option value="user">User</Option>
                <Option value="admin">Admin</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12} className="flex items-end">
            <Button
              type="primary"
              className="form-btn w-full"
              htmlType="submit"
              loading={loading}
            >
              Update User
            </Button>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            {serverError && (
              <Alert message={serverError} type="error" className="mt-2.5" />
            )}
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}
