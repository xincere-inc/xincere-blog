import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Input, Popconfirm } from 'antd';

interface TagSearchBarProps {
  searchText: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCreateClick: () => void;
  onBulkDeleteClick: () => void;
  selectedRowCount: number;
}

export function TagSearchBar({
  searchText,
  onSearchChange,
  onCreateClick,
  onBulkDeleteClick,
  selectedRowCount,
}: TagSearchBarProps) {
  return (
    <div className="flex justify-between mb-4 flex-col gap-y-2 md:flex-row">
      <Input
        placeholder="Search tags"
        value={searchText}
        onChange={onSearchChange}
        style={{ minWidth: 150, maxWidth: 290, height: 32 }}
        prefix={<SearchOutlined />}
      />
      <div className="flex mb-4 gap-y-2 md:flex-row flex-col">
        <Button
          type="primary"
          onClick={onCreateClick}
          icon={<PlusOutlined />}
          className="md:mr-2"
        >
          Create Tag
        </Button>
        <Popconfirm
          title="Are you sure to delete the selected tags?"
          onConfirm={onBulkDeleteClick}
          placement="bottomLeft"
          okText="Yes"
          cancelText="No"
          disabled={selectedRowCount === 0}
        >
          <Button type="primary" danger disabled={selectedRowCount === 0}>
            Delete Selected
          </Button>
        </Popconfirm>
      </div>
    </div>
  );
}
