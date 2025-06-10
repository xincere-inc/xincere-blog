import { SearchOutlined } from '@ant-design/icons';
import { Input } from 'antd';

interface searchBarProps {
  placeholder: string;
  searchText: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function SearchBar({
  placeholder,
  searchText,
  onSearchChange,
}: searchBarProps) {
  return (
    <Input
      placeholder={placeholder}
      value={searchText}
      onChange={onSearchChange}
      style={{ minWidth: 150, maxWidth: 290, height: 32 }}
      prefix={<SearchOutlined />}
    />
  );
}
