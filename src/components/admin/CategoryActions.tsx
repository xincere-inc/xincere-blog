import { Button } from 'antd';
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
      <Button type="primary" danger onClick={() => onDelete(record)}>
        Delete
      </Button>
    </div>
  );
}
