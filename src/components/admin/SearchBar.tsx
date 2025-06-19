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
      className="min-w-36 md:max-w-72 h-8"
      prefix={<SearchOutlined />}
    />
  );
}
