import { Button, Popconfirm } from 'antd';
import { Tag } from './TagTable';

interface TagActionsProps {
  record: Tag;
  onEdit: (record: Tag) => void;
  onDelete: (record: Tag) => void;
}

export function TagActions({ record, onEdit, onDelete }: TagActionsProps) {
  return (
    <div className="flex space-x-2">
      <Button type="primary" onClick={() => onEdit(record)}>
        Edit
      </Button>

      {!record.deletedAt && (
        <Popconfirm
          title="Are you sure to delete this tag?"
          onConfirm={() => onDelete(record)}
          placement="bottomLeft"
          okText="Yes"
          cancelText="No"
        >
          <Button type="primary" danger>
            Delete
          </Button>
        </Popconfirm>
      )}
    </div>
  );
}
