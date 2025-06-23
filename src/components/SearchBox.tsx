'use client'

interface SearchBoxProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({ value, onChange }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
      <div className="relative">
        <input
          type="text"
          placeholder="記事を検索"
          className="w-full pl-10 pr-4 py-2 border border-xincereGreen rounded-md focus:outline-none focus:ring-2 focus:ring-xincereGreen focus:border-transparent text-sm"
          value={value}
          onChange={onChange}
        />
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-xincereGreen">
          <i className="fas fa-search"></i>
        </div>
      </div>
    </div>
  );
};

export default SearchBox;
