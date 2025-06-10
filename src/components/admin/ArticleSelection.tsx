interface ArticleSelectionProps {
  record: any;
  selectedRowKeys: React.Key[];
  onSelectChange: (record: any) => void;
}

export function ArticleSelection({
  record,
  selectedRowKeys,
  onSelectChange,
}: ArticleSelectionProps){
  return (
    <input
      type="checkbox"
      checked={selectedRowKeys.includes(record.id)}
      onChange={() => onSelectChange(record)}
    />
  );
}