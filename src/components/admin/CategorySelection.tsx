import { Checkbox } from 'antd';
import { Category } from './CategoryTable';

interface CategorySelectionProps {
  record: Category;
  selectedRowKeys: React.Key[];
  onSelectChange: (record: Category) => void;
}

export function CategorySelection({
  record,
  selectedRowKeys,
  onSelectChange,
}: CategorySelectionProps) {
  return (
    <Checkbox
      checked={selectedRowKeys.includes(record.id)}
      onChange={() => onSelectChange(record)}
    />
  );
}
