import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Input, Popconfirm } from 'antd';

interface ArticleSearchBarProps {
    searchText: string;
    onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onCreateClick: () => void;
    onBulkDeleteClick: () => void;
    selectedRowCount: number;
}

export function ArticleSearchBar({
  searchText,
  onSearchChange,
  onCreateClick,
  onBulkDeleteClick,
  selectedRowCount,
}: ArticleSearchBarProps) {
  return (
    <div className="flex justify-between mb-4">
      <Input
        placeholder="Search Articles"
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
          Create Article
        </Button>
        <Popconfirm
          title="Are you sure to delete the selected articles?"
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