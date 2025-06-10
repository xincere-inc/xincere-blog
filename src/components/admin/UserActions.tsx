import { User } from '@/types/admin/user';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Space } from 'antd';

interface UserActionsProps {
  record: User;
  loggedInUserId?: string;
  onEdit: (record: any) => void;
  onDelete: (record: any) => void;
}

export function UserActions({
  record,
  loggedInUserId,
  onEdit,
  onDelete,
}: UserActionsProps) {
  return (
    <Space size="middle">
      <Button
        type="primary"
        icon={<EditOutlined />}
        onClick={() => onEdit(record)}
      >
        Edit
      </Button>
      {record.id !== loggedInUserId && (
        <Popconfirm
          title="Are you sure to delete this user?"
          onConfirm={() => onDelete(record)}
          okText="Yes"
          cancelText="No"
        >
          <Button type="primary" danger icon={<DeleteOutlined />}>
            Delete
          </Button>
        </Popconfirm>
      )}
    </Space>
  );
}
