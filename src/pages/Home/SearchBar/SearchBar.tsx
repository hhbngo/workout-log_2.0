import React from 'react';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

interface SearchBarProps {
  searchValue: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchValue,
  onInputChange,
}) => {
  return (
    <div style={{ position: 'absolute', top: '22px', left: '20px' }}>
      <Input
        value={searchValue}
        onChange={onInputChange}
        suffix={<SearchOutlined />}
        placeholder="Name or category"
        allowClear
        size="large"
        style={{ fontSize: '16px !important' }}
      />
    </div>
  );
};

export default SearchBar;
