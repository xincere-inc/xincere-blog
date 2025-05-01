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
} from 'antd';
import { useImperativeHandle } from 'react';
const { Option } = Select;

interface UserCreateModalProps {
  visible: boolean;
  onCancel: () => void;
  onCreate: (values: any) => void;
  loading: boolean;
  serverError?: string | null;
  formRef?: React.RefObject<FormInstance>;
}

export function UserCreateModal({
  visible,
  onCancel,
  onCreate,
  loading,
  serverError,
  formRef,
}: UserCreateModalProps) {
  const [form] = Form.useForm();
  useImperativeHandle(formRef, () => form);

  return (
    <Modal
      title="Create User"
      open={visible}
      onCancel={() => {
        onCancel();
        form.resetFields();
      }}
      footer={null}
      destroyOnClose
      centered
      style={{ margin: '20px 0px' }}
    >
      <Form form={form} onFinish={onCreate} layout="vertical">
        <Row gutter={16}>
          <Col xs={24} sm={12}>
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
          <Col xs={24} sm={12}>
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
          <Col xs={24} sm={12}>
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
          <Col xs={24} sm={12}>
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
          <Col xs={24} sm={12}>
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
          <Col span={24}>
            <Form.Item label="Address" name="address">
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
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
          <Col xs={24} sm={12}>
            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: 'Please input the password!' },
                {
                  validator: (_, value) => {
                    if (!value || value.length >= 8) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error('Password must be at least 8 characters')
                    );
                  },
                },
              ]}
            >
              <Input.Password />
            </Form.Item>
          </Col>
        </Row>

        <Button
          className="form-btn"
          type="primary"
          htmlType="submit"
          loading={loading}
        >
          Create User
        </Button>
        <Row>
          <Col span={24}>
            {serverError && (
              <Alert
                message={serverError}
                type="error"
                style={{ marginTop: '10px' }}
              />
            )}
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}
