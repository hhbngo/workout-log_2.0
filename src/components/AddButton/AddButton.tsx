import React from 'react';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

interface AddButtonProps {
  handleAddClick: () => void;
  loading?: boolean;
  disabled?: boolean;
}

const AddButton: React.FC<AddButtonProps> = ({
  handleAddClick,
  loading,
  disabled,
}) => {
  return (
    <div style={{ position: 'absolute', top: '20px', right: '20px' }}>
      <Button
        type="primary"
        shape="circle"
        size="large"
        icon={<PlusOutlined />}
        onClick={handleAddClick}
        loading={loading}
        disabled={disabled}
      />
    </div>
  );
};

export default AddButton;
