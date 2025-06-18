import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Input, Popconfirm } from 'antd';

interface UserSearchBarProps {
  searchText: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCreateClick: () => void;
  onBulkDeleteClick: () => void;
  selectedRowCount: number;
}

export function UserSearchBar({
  searchText,
  onSearchChange,
  onCreateClick,
  onBulkDeleteClick,
  selectedRowCount,
}: UserSearchBarProps) {
  return (
    <div className="flex justify-between mb-4">
      <Input
        placeholder="Search users"
        value={searchText}
        onChange={onSearchChange}
        className="!w-64"
        prefix={<SearchOutlined />}
      />
      <div>
        <Button
          type="primary"
          onClick={onCreateClick}
          icon={<PlusOutlined />}
          className="mr-2"
        >
          Create User
        </Button>
        <Popconfirm
          title="Are you sure to delete the selected users?"
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
