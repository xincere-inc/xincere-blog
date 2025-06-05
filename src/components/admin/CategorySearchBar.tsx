import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Input, Popconfirm } from 'antd';

interface CategorySearchBarProps {
  searchText: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCreateClick: () => void;
  onBulkDeleteClick: () => void;
  selectedRowCount: number;
}

export function CategorySearchBar({
  searchText,
  onSearchChange,
  onCreateClick,
  onBulkDeleteClick,
  selectedRowCount,
}: CategorySearchBarProps) {
  return (
    <div className="flex justify-between mb-4">
      <Input
        placeholder="Search categories"
        value={searchText}
        onChange={onSearchChange}
        style={{ width: 300 }}
        prefix={<SearchOutlined />}
      />
      <div>
        <Button
          type="primary"
          onClick={onCreateClick}
          icon={<PlusOutlined />}
          className="mr-2"
        >
          Create Category
        </Button>
        <Popconfirm
          title="Are you sure to delete the selected categories?"
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
