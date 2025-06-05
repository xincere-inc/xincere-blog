import { Button, Popconfirm } from 'antd';
import { Category } from './CategoryTable';

interface CategoryActionsProps {
  record: Category;
  onEdit: (record: Category) => void;
  onDelete: (record: Category) => void;
}

export function CategoryActions({
  record,
  onEdit,
  onDelete,
}: CategoryActionsProps) {
  return (
    <div className="flex space-x-2">
      <Button type="primary" onClick={() => onEdit(record)}>
        Edit
      </Button>
      <Popconfirm
        title="Are you sure to delete this category?"
        onConfirm={() => onDelete(record)}
        placement="bottomLeft"
        okText="Yes"
        cancelText="No"
      >
        <Button type="primary" danger>
          Delete
        </Button>
      </Popconfirm>
    </div>
  );
}
