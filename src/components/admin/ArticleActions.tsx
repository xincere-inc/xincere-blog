import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Space } from 'antd';

interface ArticleActionsProps {
  record: any;
  onEdit: (record: any) => void;
  onDelete: (record: any) => void;
}

export function ArticleActions({
  record,
  onEdit,
  onDelete,
}: ArticleActionsProps) {
  return (
    <Space size="middle">
      <Button
        type="primary"
        icon={<EditOutlined />}
        onClick={() => onEdit(record)}
      >
        Edit
      </Button>
      <Popconfirm
          title="Are you sure to delete this article?"
          onConfirm={() => onDelete(record)}
          okText="Yes"
          cancelText="No"
        >
          <Button type="primary" danger icon={<DeleteOutlined />}>
            Delete
          </Button>
        </Popconfirm>
    </Space>
  );
}
