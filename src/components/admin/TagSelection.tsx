import { Checkbox } from 'antd';
import { Tag } from './TagTable';

interface TagSelectionProps {
  record: Tag;
  selectedRowKeys: React.Key[];
  onSelectChange: (record: Tag) => void;
}

export function TagSelection({
  record,
  selectedRowKeys,
  onSelectChange,
}: TagSelectionProps) {
  return (
    <Checkbox
      checked={selectedRowKeys.includes(record.id)}
      onChange={() => onSelectChange(record)}
    />
  );
}
