interface SelectionProps {
  record: any;
  selectedRowKeys: React.Key[];
  onSelectChange: (record: any) => void;
}

export function Selection({
  record,
  selectedRowKeys,
  onSelectChange,
}: SelectionProps) {
  return (
    <input
      type="checkbox"
      checked={selectedRowKeys.includes(record.id)}
      onChange={() => onSelectChange(record)}
    />
  );
}
