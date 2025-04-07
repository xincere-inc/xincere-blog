interface UserSelectionProps {
  record: any;
  selectedRowKeys: React.Key[];
  onSelectChange: (record: any) => void;
}

export function UserSelection({ record, selectedRowKeys, onSelectChange }: UserSelectionProps) {
  return (
    <input
      type="checkbox"
      checked={selectedRowKeys.includes(record.id)}
      onChange={() => onSelectChange(record)}
    />
  );
}